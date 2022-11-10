import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {PasswordHasherBindings, UserServiceBindings} from '../keys';
import {
  Product,
  ResetPasswordInit,
  User,
  KeyAndPassword,
  NodeMailer,
} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {
  basicAuthorization,
  EmailService,
  PasswordHasher,
  UserManagementService,
  validateCredentials,
  validateKeyPassword,
} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils';
import {
  CredentialsRequestBody,
  PasswordResetRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import isemail from 'isemail';
import {SentMessageInfo} from 'nodemailer';

const uuidv4 = require('uuid');

/**
 * Crea un pequeño modelo que captura la contraseña insertada en la solicitud de crear nuevo
 * usuario (cliente) y es extendido hacia el modelo User.
 */
@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserManagementController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(UserServiceBindings.USER_SERVICE)
    public userManagementService: UserManagementService,
    @inject('services.EmailService')
    public emailService: EmailService,
  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    /**
     * Todos los usuarios nuevos tendrán el rol de "Cliente" por defecto.
     */
    newUserRequest.roles = ['cliente'];
    /**
     * Garantiza que el usuario ingrese un valor de correo electrónico y un valor de contraseña válidos.
     */
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    try {
      newUserRequest.resetKey = '';
      return await this.userManagementService.createUser(newUserRequest);
    } catch (error) {
      // Mongo: Error 11000 key duplicada.
      if (
        error.code === 11000 &&
        error.errmsg.includes('index: uniqueEmail' || 'index: uniqueIdCard')
      ) {
        throw new HttpErrors.Conflict('La cédula o el correo ya existe!!');
      } else {
        throw error;
      }
    }
  }

  @put('/users/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'cliente'],
    voters: [basicAuthorization],
  })
  async set(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('userId') userId: string,
    @requestBody({description: 'update user'}) user: User,
  ): Promise<void> {
    try {
      /**
       * Sólo el administrador puede asignar roles
       */
      if (!currentUserProfile.roles.includes('admin')) {
        delete user.roles;
      }
      return await this.userRepository.updateById(userId, user);
    } catch (e) {
      return e;
    }
  }

  @get('/users/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'soporte', 'cliente'],
    voters: [basicAuthorization],
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  @get('/users/whoami', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'El perfil de usuario actual',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    /**
     * Asegúra de que el usuario exista y que la contraseña sea correcta.
     */
    const user = await this.userService.verifyCredentials(credentials);

    /**
     * Convierte un objeto de usuario en un objeto de perfil de usuario (conjunto reducido de propiedades)
     */
    const userProfile = this.userService.convertToUserProfile(user);

    /**
     * Crea un JSON Web Token basado en el perfil de usuario.
     */
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @put('/users/forgot-password', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Actualiza el perfil del usuario (contraseña)',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async forgotPassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(PasswordResetRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const {email, password} = credentials;
    const {id} = currentUserProfile;

    const user = await this.userRepository.findOne(id);

    //Verifica si una cuenta de usuario existe.
    if (!user) {
      throw new HttpErrors.NotFound('Cuenta de usuario no encontrada!!');
    }
    //Verifica si un correo existe.
    if (email !== user?.email) {
      throw new HttpErrors.Forbidden('Invalid email address');
    }

    //Valida las credenciales de usuario (Usuario y contraseña)
    validateCredentials(_.pick(credentials, ['email', 'password']));

    //Encripta la contraseña
    const passwordHash = await this.passwordHasher.hashPassword(password);

    await this.userRepository
      .userCredentials(user.id)
      .patch({password: passwordHash});

    //Crea una key UUID de verificación para el reestablecimiento de contraseña
    user.resetKey = uuidv4();

    try {
      /**
       * Actualiza al usuario para almacenar su clave de reinicio y maneja errores.
       */
      await this.userRepository.updateById(user.id, user);
    } catch (e) {
      return e;
    }

    /**
     * Envia un correo electrónico al correo electrónico del usuario.
     */
    const nodeMailer: NodeMailer =
      await this.emailService.sendResetPasswordMail(user);

    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/users/reset-password/init', {
    responses: {
      '200': {
        description:
          'Confirmación de que se ha enviado el correo electrónico de restablecimiento de contraseña',
      },
    },
  })
  async resetPasswordInit(
    @requestBody() resetPasswordInit: ResetPasswordInit,
  ): Promise<string> {
    if (!isemail.validate(resetPasswordInit.email)) {
      throw new HttpErrors.UnprocessableEntity(
        'Dirección de correo electrónico no válida!!',
      );
    }

    const sentMessageInfo: SentMessageInfo =
      await this.userManagementService.requestPasswordReset(
        resetPasswordInit.email,
      );

    if (sentMessageInfo.accepted.length) {
      return 'Enlace de restablecimiento de contraseña enviado con éxito';
    }
    throw new HttpErrors.InternalServerError(
      'Error al enviar el correo electrónico de restablecimiento de contraseña',
    );
  }

  @put('/users/reset-password/finish', {
    responses: {
      '200': {
        description: 'Respuesta de restablecimiento de contraseña exitosa',
      },
    },
  })
  async resetPasswordFinish(
    @requestBody() keyAndPassword: KeyAndPassword,
  ): Promise<string> {
    validateKeyPassword(keyAndPassword);

    const foundUser = await this.userRepository.findOne({
      where: {resetKey: keyAndPassword.resetKey},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        'No hay cuenta asociada para la clave de reinicio proporcionada!!',
      );
    }

    const user = await this.userManagementService.validateResetKeyLifeSpan(
      foundUser,
    );

    const passwordHash = await this.passwordHasher.hashPassword(
      keyAndPassword.password,
    );

    try {
      await this.userRepository
        .userCredentials(user.id)
        .patch({password: passwordHash});

      await this.userRepository.updateById(user.id, user);
    } catch (e) {
      return e;
    }

    return 'Restablecimiento de contraseña exitoso';
  }
}
