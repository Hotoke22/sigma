import {ApplicationConfig, SigmaApp} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new SigmaApp(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Ejecutar la aplicación
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      protocol: 'http',
      key: '',
      cert: '',
      host: process.env.HOST,
      cors: {
        origin: [],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },

      /**
       * `gracePeriodForClose` proporciona un cierre elegante para http/https
       * servidores con clientes keep-alive. El valor predeterminado es `Infinito`
       * (no fuerce el cierre). Si desea destruir inmediatamente todos los sockets
       * al detenerse, establezca su valor en `0`.
       * más info https://www.npmjs.com/package/stoppable
       */

      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // Útil cuando se usa con OpenAPI-to-GraphQL para ubicar su aplicación
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
