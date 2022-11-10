import {Credentials} from '../repositories';
import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';
import {KeyAndPassword} from '../models';

export function validateCredentials(credentials: Credentials) {
  // Valida el correo electrónico
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Correo incorrecto!!');
  }

  // Valida la longitud de la contraseña.
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'La contraseña debe ser de 8 caracteres como mínimo!!',
    );
  }
}

export function validateKeyPassword(keyAndPassword: KeyAndPassword) {
  // Valida la longitud de la contraseña.
  if (!keyAndPassword.password || keyAndPassword.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'La contraseña debe ser de 8 caracteres como mínimo!! must be minimum 8 characters',
    );
  }

  if (keyAndPassword.password !== keyAndPassword.confirmPassword) {
    throw new HttpErrors.UnprocessableEntity(
      'La contraseña y la contraseña de confirmación no coinciden!!',
    );
  }

  if (
    keyAndPassword.resetKey.length === 0 ||
    keyAndPassword.resetKey.trim() === ''
  ) {
    throw new HttpErrors.UnprocessableEntity(
      'La clave de reestablecimiento de contraseña es obligatoria!!',
    );
  }
}
