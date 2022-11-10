/**
 * Middleware es software que se sitúa entre un sistema operativo y las aplicaciones que se ejecutan en él. Básicamente, funciona como una capa de traducción oculta para permitir la comunicación y la administración de datos en aplicaciones distribuidas. A veces, se le denomina “plumbing” (tuberías), porque conecta dos aplicaciones para que se puedan pasar fácilmente datos y bases de datos por una “canalización”. El uso de middleware permite a los usuarios hacer solicitudes como el envío de formularios en un explorador web o permitir que un servidor web devuelva páginas web dinámicas en función del perfil de un usuario.
 *
 * Algunos ejemplos comunes de middleware son el middleware de base de datos, el middleware de servidor de aplicaciones, el middleware orientado a mensajes, el middleware web y los monitores de procesamiento de transacciones.
 *
 * https://azure.microsoft.com/es-es/resources/cloud-computing-dictionary/what-is-middleware
 */

import {inject, injectable, Next, Provider} from '@loopback/core';
import {
  asMiddleware,
  HttpErrors,
  LogError,
  Middleware,
  Response,
  MiddlewareContext,
  RestBindings,
  RestMiddlewareGroups,
} from '@loopback/rest';

@injectable(
  asMiddleware({
    group: 'validationError',
    upstreamGroups: RestMiddlewareGroups.SEND_RESPONSE,
    downstreamGroups: RestMiddlewareGroups.CORS,
  }),
)
export class ErrorHandlerMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
  ) {}

  async value() {
    const middleware: Middleware = async (
      ctx: MiddlewareContext,
      next: Next,
    ) => {
      try {
        return await next();
      } catch (err) {
        // Cualquier manejo de errores si implementa aquí
        return this.handleError(ctx, err);
      }
    };
    return middleware;
  }

  handleError(context: MiddlewareContext, err: HttpErrors.HttpError): Response {
    /**
     * Registra el error (sencillo), se pueden registrar escenarios más complejos
     * como la personalización de errores para un endpoint específico.
     */
    this.logError(err, err.statusCode, context.request);
    throw err;
  }
}
