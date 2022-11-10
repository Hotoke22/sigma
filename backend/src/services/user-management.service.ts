import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {User, UserWithPassword} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasher} from './hash.password.bcryptjs';
import _ from 'lodash';
import {EmailService} from './email.service';
import {v4 as uuidv4} from 'uuid';
import {subtractDates} from '../utils';
import {SentMessageInfo} from 'nodemailer';

@injectable({scope: BindingScope.TRANSIENT})
export class UserManagementService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject('services.EmailService')
    public emailService: EmailService,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalidCredentialsError =
      'Correo electrónico o contraseña no válidos!!';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.userRepository.findOne({
      where: {email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    let userName = '';
    if (user.name) userName = `${user.name}`;
    if (user.surname)
      userName = user.name ? `${userName} ${user.surname}` : `${user.surname}`;
    return {
      [securityId]: user.id,
      name: userName,
      id: user.id,
      roles: user.roles,
    };
  }

  async createUser(userWithPassword: UserWithPassword): Promise<User> {
    const password = await this.passwordHasher.hashPassword(
      userWithPassword.password,
    );
    userWithPassword.password = password;
    const user = await this.userRepository.create(
      _.omit(userWithPassword, 'password'),
    );
    user.id = user.id.toString();
    await this.userRepository.userCredentials(user.id).create({password});
    return user;
  }

  async requestPasswordReset(email: string): Promise<SentMessageInfo> {
    const noAccountFoundError =
      'No hay cuenta asociada a la dirección de correo electrónico proporcionada.';
    const foundUser = await this.userRepository.findOne({
      where: {email},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(noAccountFoundError);
    }

    const user = await this.updateResetRequestLimit(foundUser);

    try {
      await this.userRepository.updateById(user.id, user);
    } catch (e) {
      return e;
    }
    return this.emailService.sendResetPasswordMail(user);
  }

  /**
   * Comprueba la marca de tiempo de restablecimiento del usuario si es el mismo día que aumenta el conteo.
   * De lo contrario, establezca la fecha actual como marca de tiempo y comience a contar
   * Para la solicitud de restablecimiento por primera vez, establezca el recuento de restablecimiento en 1 y asigne la marca de tiempo del mismo día.
   * @param user
   */
  async updateResetRequestLimit(user: User): Promise<User> {
    const resetTimestampDate = new Date(user.resetTimestamp);

    const difference = await subtractDates(resetTimestampDate);

    if (difference === 0) {
      user.resetCount = user.resetCount + 1;

      if (user.resetCount > +(process.env.PASSWORD_RESET_EMAIL_LIMIT ?? 2)) {
        throw new HttpErrors.TooManyRequests(
          'La cuenta ha alcanzado el límite diario para enviar solicitudes de restablecimiento de contraseña',
        );
      }
    } else {
      user.resetTimestamp = new Date().toLocaleDateString();
      user.resetCount = 1;
    }
    // Para generar una clave de reinicio única, existen otras opciones además de la solución propuesta a continuación.
    // Siéntase libre de usar cualquier opción que funcione mejor para sus necesidades.
    user.resetKey = uuidv4();
    user.resetKeyTimestamp = new Date().toLocaleDateString();

    return user;
  }

  /**
   * Asegura que la clave de reinicio solo sea válida por un día.
   * @param user
   */
  async validateResetKeyLifeSpan(user: User): Promise<User> {
    const resetKeyLifeSpan = new Date(user.resetKeyTimestamp);
    const difference = await subtractDates(resetKeyLifeSpan);

    user.resetKey = '';
    user.resetKeyTimestamp = '';

    if (difference !== 0) {
      throw new HttpErrors.BadRequest(
        'La clave de reinicio proporcionada ha caducado.',
      );
    }

    return user;
  }
}
