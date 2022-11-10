import {injectable, inject, BindingScope} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      /**
       * Decodifica el perfil de usuario desde token
       */
      const decodedToken = await verifyAsync(token, this.jwtSecret);

      /**
       * No copie sobre el campo de token 'iat' y 'exp', ni 'correo electrónico' al perfil de usuario
       * iat (issued at time): Hora en que se emitió el JWT; se puede utilizar para determinar la edad del JWT.
       * exp (expiration time):  Tiempo después del cual expira el JWT.
       * Mas info: https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims
       */
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
          roles: decodedToken.roles,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error al verificar el token: ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error al generar el token: Perfil de usuario es nulo o inválido',
      );
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      roles: userProfile.roles,
    };

    /**
     * Genera un JSON Web Token
     */
    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error al encriptar el token : ${error}`,
      );
    }

    return token;
  }
}
