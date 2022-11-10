import {BootMixin} from '@loopback/boot';
import {
  ApplicationConfig,
  //BindingKey,
  createBindingFromClass,
} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin /*SchemaMigrationOptions*/} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {SigmaSequence} from './sequence';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import crypto from 'crypto';
//import fs from 'fs';
import {PasswordHasherBindings, UserServiceBindings} from './keys';
//import {UserWithPassword} from './models';
//import {ProductRepository, UserRepository} from './repositories';
import {
  UserManagementService,
  BcryptHasher,
  SecuritySpecEnhancer,
  JwtService,
} from './services';
import {ErrorHandlerMiddlewareProvider} from './middlewares';

export {ApplicationConfig};

export class SigmaApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);

    this.setUpBindings();

    /**
     * Secuencia personalizada
     */
    this.sequence(SigmaSequence);

    /**
     * Página de inicio predeterminada
     */
    this.static('/', path.join(__dirname, '../public'));

    /**
     * Aquí se puede personalizar la configuración de @loopback/rest-explorer
     */
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    /**
     * Aquí se puede personalizar la configuración de @loopback/boot
     */
    this.bootOptions = {
      controllers: {
        /**
         * Aquí se puede personalizar las las convenciones de ControllerBooter
         *  */
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    /**
     * Vincular servicios de hash de bcrypt
     */
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JwtService);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(UserManagementService);
    this.add(createBindingFromClass(SecuritySpecEnhancer));

    this.add(createBindingFromClass(ErrorHandlerMiddlewareProvider));

    /**
     * Usa el JWT secreto de la variable de entorno JWT_SECRET (si está configurado)
     * de lo contrario, crea una cadena aleatoria de 64 dígitos hexadecimales
     */
    const secret =
      process.env.JWT_SECRET ?? crypto.randomBytes(32).toString('hex');
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(secret);
  }

  /**
   * Desafortunadamente, TypeScript no permite anular los métodos heredados
   * de tipos mapeados. https://github.com/microsoft/TypeScript/issues/38496
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  async start(): Promise<void> {
    /**
     * Usa el indicador `database Seeding` para controlar si los productos/usuarios deben ser * pre poblada en la base de datos. Su valor por defecto es `true`.
     * (Pupulate products no implementado)
     */
    if (this.options.databaseSeeding !== false) {
      await this.migrateSchema();
    }
    return super.start();
  }
}
