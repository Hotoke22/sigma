import {SchemaObject} from '@loopback/rest';

/**
 * Según investigado este bloque es recomendado ingresarlo a @loopback/authentication
 */
export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

/**
 * Describe el cuerpo de la peticion de user/login
 * Se creó el modelo UserCredentials, tambien se podia
 * inferir la especificación (spec) del modelo de usuario
 */

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'La entrada de la función de inicio de sesión',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export const PasswordResetRequestBody = {
  description: 'La entrada de la función de restablecimiento de contraseña',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
