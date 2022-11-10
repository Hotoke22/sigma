# Sistema De Gestión De Mascotas (sigma)

## Pre-requisitos

Se requiere Node.js == 18.12, Loopback 4 y ejecutar instancias de un servidor MongoDB (Mongodb Atlas) para que la aplicación se inicie. MongoDB se usa para la base de datos de los modelos de la aplicación.

## Paquetes Utilizados

`
$ npm install --save @loopback/authentication
`


![image](./backend/img-md/loopback-authentication.png)


Este paquete contiene la lógica central para la capa de autenticación en LoopBack 4.

Contiene:

* Un decorador para expresar un requisito de autenticación en los métodos del controlador.
* Un proveedor para acceder a metadatos de autenticación a nivel de método.  
* Una acción en la secuencia REST para hacer cumplir la autenticación (ya no es necesaria para la secuencia basada en middleware)  
* Un punto de extensión para descubrir todas las estrategias de autenticación y manejar su delegación.  

`$ npm install @loopback/authorization`  


![imgage](./backend/img-md/loopback-authorization.png)

El siguiente ejemplo muestra el uso básico del @authorizedecorador, el autorizador y el componente de autorización mediante la autorización de un cliente según su rol:

ASUMIENDO que su aplicación utiliza jwt como estrategia de autenticación y que la información del usuario está codificada en el token del encabezado de una solicitud.

`$ npm install isemail`

Determina si el correo electrónico es válido o no, para diversas definiciones del mismo. Opcionalmente acepta un options objet. Las opciones pueden incluir errorLevel.

Se puede usar el error level para especificar el tipo de resultado para validate(). Pasar un false literal dará como resultado un booleano verdadero o falso que indica si la dirección de correo electrónico está suficientemente definida para usarla al enviar un correo electrónico.

Pasar un true literal dará como resultado un estado numérico más granular, siendo 0 una dirección de correo electrónico perfectamente válida.

```npm
$ npm install jsonwebtoken
$ npm i -D @types/bcryptjs
```

**Dependencias requeridad Nodemailer**

![Nodemailer](./backend/img-md/n2-2.webp)

```node
$ npm i nodemailer #usaremos nodemailer para enviar un correo electrónico para restablecer la contraseña
$ npm i -D @types/nodemailer # para habilitar la compatibilidad con TypeScript para nodemailer
$ npm i dotenv # para habilitar el soporte de uso de variables de entorno
$ npm i uuid # para generar una clave de reinicio única 
$ npm i -D @types/uuid # para habilitar la compatibilidad con TypeScript para uuid
```

## Instalación de la aplicación

Sigue los siguientes pasos para clonar e iniciar la aplicación.

```git
git clone https://github.com/jalvarezy/sigma.git
cd sigma
npm i
```

## Pruebas

`npm start`

## Modelos

**1. User -**  Esta entidad representa a los usuarios del sistema.  
**2. UserCredentials -**  Esta entidad es para las credenciales confidenciales de los usuarios.  
**3. Product -** Representa una entidad para los productos ofrecidos por Mascota Feliz  
**4. KeyAndPassword -** Este modelo modelo es para representar la solicitud de restablecimiento de contraseña del usuario.  
**5. EmailTemplate -** Este modelo es para representar la plantilla de solicitud de correo electrónico para Nodemailer.  
**6. NodeMailer -** Este modelo es para representar la respuesta de Nodemailer después de enviar el correo electrónico de restablecimiento de contraseña.  
**7. ResetPasswordInit -** Este modelo es para representar la solicitud del paso inicial de restablecimiento de contraseña.  
**8. Service -** Representa una entidad para los servicios ofrecidos por Mascota Feliz  
**9. Prospect -** Representa una entidad para identidicar y facilitar el contacto de los clientes potenciales.

**User** y **Pet**  se marcan de 1 a muchos utilizando el decorador de modelo **@HasMany** porque un cliente puede tener muchas mascotas y como **Pet** perteneciente a **User** utilizando el decorador de modelo **@BelongsTo**.

**User** y **UserCredentials**  se marcan de 1 a 1 utilizando el decorador de modelo **@HasOne** porque un cliente puede tener una sola credencial de autenticación.

**Pet** y **Plan**  se marcan de 1 a 1 utilizando el decorador de modelo **@HasOne** porque una mascota puede tener o adquirir un solo plan.

## Controladores

**1. user-management -** Controlador para crear, obtener información, actualizar información de usuarios e iniciar sesión.

**2. product -** Controller para la gestión del catálogo de productos.

**3. service -** Controller para la gestión del catálogo de servicios.

**4. pet -** Controlador para crear, obtener información, actualizar información de las mascotas.

**5. plan -** Controlador para crear, obtener información, actualizar información de las mascotas.

**6. prospect -** Controlador para crear y obtener información sobre los prospectos de usuarios potenciales.

**7. branch -** Controlador para crear, obtener información, actualizar información de las sucursales.

## Servicios

**1. user-management -** Este servicio es el responsable de verificar si el usuario existe y la contraseña enviada al servidor coincide con la de un usuario existente.

**2. hash.password.bcryptjs -** Este servicio es el responsable de generar y comparar los hashes de las contraseñas.

**3. validator -** Este servicio es el responsable de válidar el correo electrónico y la contraseña cuando se crea o registra un nuevo usuario.

**4. jwt -** Este servicio es el responsable de generar y verificar  los JSON Web Token.

**5. email -** Este servicio es el responsable de enviar el correo electrónico de restablecimiento de contraseña.

**6. basic-authorizor -** Este servicio es el responsable de  autorizar y negar accesos.

## Autenticación

**Nota:** Esta aplicación contiene un endpoint de inicio de sesión con el propósito demostración o test, la autenticación para las operaciones CRUD y los endpoints de navegación del modelo usuario y demás aún están en progreso de implementación.

## Login

El endpoint para el inicio de sesión de un usuario es una solicitud POST a /users/login.

Una vez que se extraen las credenciales, la implementación de inicio de sesión en el nivel del controlador es solo un proceso de cuatro pasos. Este nivel de simplicidad es posible gracias al uso del servicio UserService proporcionado por @loopback/authentication.

**1** `const user = await this.userService.verifyCredentials(credentials)` - Verifica las credenciales del usuario.

**2.** `const userProfile = this.userService.convertToUserProfile(user)` - Genera un objeto user profile.

**3.** `const token = await this.jwtService.generateToken(userProfile)` - Genera un JWT basado en el objeto de perfil de usuario (user profile).

**4.** `return {token}` - - Envia el JWT.

Más info [backend/src/controllers/user-management.controller.ts](./backend/src/controllers/user-management.controller.ts)

## Autorización

La autorización del endpoint se realiza mediante @loopback/authorization. Se utiliza el decorador @authorize para proteger el acceso a los métodos del controlador.

***Todos los métodos de controlador sin el decorador @authorize serán accesibles para todos.*** Para restringir el acceso, hay que especificar los roles en la propiedad allowRoles. A Continuación hay dos ejemplos para tratar de explicar el punto.

Método de controlador desprotegido (sin  el decorador @autorize), todos pueden acceder a él:

```loopback
async find(
  @param.query.object('filter', getFilterSchemaFor(Pet))
  filter?: Filter<Pet>,
): Promise<Pet[]> {
  ...
}
```

Método de controlador protegido, solo el administrador y el cliente pueden acceder a él:

```loopback
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
  ...
}
```

Por el momento hay cuatro roles en esta aplicación: administrador, soporte, asesor y cliente. Pueden revisar los métodos del controlador en [backend/src/controllers/user-management.controller.ts](./backend/src/controllers/user-management.controller.ts), actualmente se encuentran en desarrollo  los metodos de los controladores restantes y los roles que tienen acceso a los métodos correspondientes.

La implementación de la autorización se realiza a través de voter functions. En esta aplicación, solo hay una fvoter functions: - 'basicAuthorization'. Implementa las siguientes reglas:

**1.** Sin acceso si el usuario se creó o registró sin una propiedad de rol.  
**2.** Sin acceso si el rol del usuario no está en los metadatos de autorización de roles permitidos.  
**3.** El usuario puede acceder sólo a la modelo que pertenece a sí mismo.  
**4.** Los roles de administrador y soporte omiten la verificación de propiedad del modelo.  

Para obtener más información detallada sobre la autorización en LoopBack 4, puedes consultar [https://loopback.io/doc/en/lb4/Loopback-component-authorization.html](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html)

## JWT secreto

De forma predeterminada, los JWT se firmarán utilizando HS256 con una cadena de 64 caracteres hexadecimales aleatorios como secreto. Para usar su propio secreto, hay que establezcer la variable de entorno JWT_SECRET en el valor de tu JWT secreto. Se puede usar el JWT secreto si ejecutas varias instancias de la aplicación o si desea generar o validar los JWT en una aplicación diferente. Por ejemplo en el frontend utilizando Angular.

Se pueden consultar un pequeño ejemplo en [./backend/src/application.ts](./backend/src/application.ts)

## Restablecimiento de Contraseña

Este repositorio incluye un endpoint forgot password y una función de restablecimiento de contraseña que ilustra cómo los clientes pueden restablecer su contraseña en caso de que la hayan olvidado. Los usuarios pueden restablecer su contraseña mientras están autenticados o no en la aplicación. Para esta funcionalidad de correo utilizamos Nodemailer y el SMTP de gmail. Puedes consultar https://nodemailer.com/usage/using-gmail/ si te interesa o consideras utilizar Nodemailer con Gmail como alternativa a sendgrid. Además, para administrar las variables de entorno usamos el paquete dotenv, por lo tanto, debe crear un archivo .env en la raíz del proyecto con el siguientes contenidos:

```.env
SMTP_PORT=587
SMTP_SERVER=smtp.gmail.com
APPLICATION_URL=http://localhost:3000/ <Ejemplo endpoint a la página con el formulario de restablecimiento de contraseña>
SMTP_USERNAME=<gmail-username>
SMTP_PASSWORD=<gmail-password>
```

## Tutorial

Hay un tutorial que muestra cómo aplicar la estrategia JWT para proteger tu terminal con @loopback/authentication Puedes consultar más información en https://loopback.io/doc/en/lb4/Authentication-tutorial.html

## Trying It Out

Tambien puedes consultar la sección [the try it out](https://loopback.io/doc/en/lb4/Authentication-tutorial.html#try-it-out) en el tutorial de la documentación oficial de loopback.

## Implementación en la nube como Microservicios **(No IMPLEMENTADO)**

Investigando o indagando sobre tecnologias modernas; la aplicación se puede empaquetar como varios contenedores de Docker e implementarse en un entorno en la nube como un clúster de Kubernetes.

Pueden consultar más información en  [Implementar la aplicación como microservicios nativos en la nube](https://github.com/loopbackio/loopback4-example-shopping/blob/master/kubernetes/README.md)


***En construcción...***


