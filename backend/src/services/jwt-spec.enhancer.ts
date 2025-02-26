import {bind} from '@loopback/core';
import {
  asSpecEnhancer,
  mergeOpenAPISpec,
  OASEnhancer,
  OpenApiSpec,
  ReferenceObject,
  SecuritySchemeObject,
} from '@loopback/rest';
import debugModule from 'debug';
import {inspect} from 'util';
const debug = debugModule('loopback:jwt-extension:spec-enhancer');

export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};

export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  jwt: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};

/**
 * Un potenciador de especificaciones para agregar una entrada de seguridad OpenAPI de token de portador a
 * `spec.component.securitySchemes`
 */
@bind(asSpecEnhancer)
export class SecuritySpecEnhancer implements OASEnhancer {
  name = 'bearerAuth';

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const patchSpec = {
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      security: [],
    };
    const mergedSpec = mergeOpenAPISpec(spec, patchSpec);
    debug(
      `Extensión de especificación de seguridad, especificación combinada: ${inspect(
        mergedSpec,
      )}`,
    );
    return mergedSpec;
  }
}
