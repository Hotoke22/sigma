import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

/**
 * Autorizador de nivel de instancia
 * También se puede registrar como autorizador, depende de la necesidad de los usuarios.
 */

export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // Niega el acceso si faltan datos de la autorización
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'name',
      'roles',
    ]);
    currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Autoriza todo lo que no tenga una propiedad allowRoles
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true;
      break;
    }
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  // Las cuentas de administrador y soporte omiten la verificación de identificación.
  if (
    currentUser.roles.includes('admin') ||
    currentUser.roles.includes('support')
  ) {
    return AuthorizationDecision.ALLOW;
  }

  /**
   * Permita el acceso solo a los propietarios del modelo, usando la ruta como fuente verdadera.
   *
   * ejemplo. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
  if (currentUser[securityId] === authorizationCtx.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
