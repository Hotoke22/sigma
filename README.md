# MEAN STACK - (MongoDB Express Angular Node JS)

## ¿Qué es un STACK?

Un ***Stack*** de desarrollo es un grupo de herramientas y tecnológias que se utilizan en conjunto para el desarrollo de aplicaciones web. Es decir, son los lenguajes de programación, bibliotecas, framework, servidores y herramientas utilizadas por los desarrolladores web. El ***MEAN STACK*** sólo utiliza ***tecnológias relacionadas*** con Javascript.

## Estructura de  carpetas

* **app:** Es la sección donde se ubica o encuentra todo aquello que siempre si o si se debe cargar y que se necesita para que la aplicación corra de forma correcta.

* **auth:** Es la sección donde se ubica o encuentra todas las rutas relacionadas con la Autenticación de usuarios, contine los ***Guards***; **middlewares** que se ejecutan antes de cargar una ruta y determinan si se puede cargar dicha ruta o no. Existen 4 tipos diferentes de Guards (o combinaciones de estos) que son los siguientes:

  1. (CanActivate) Antes de cargar los componentes de la ruta.

  1. (CanLoad) Antes de cargar los recursos (assets) de la ruta.

  1. (CanDeactivate) Antes de intentar salir de la ruta actual (usualmente utilizado para evitar salir de una ruta, si no se han guardado los datos).

  1. (CanActivateChild) Antes de cargar las rutas hijas de la ruta actual.

* **components:** Es la sección donde se ubican o encuentran componentes, widgets, servicios que no tienen que ver con datos, enfocados más a transformarlos, y pipes.

* **modules:** En esta sección se ubican todo los módulos que ayudaran a estructurar la aplicación, tales como modulos de authenticación, modulos de registro, login, y  módulos propios de negocio.

* **layout:** Hubicaremos la estructura visual del proyecto, tales como header, footer, sidebar, etc. Esta sección puede hubicarse en shared (Si se crea), pero es una sección viable para diferenciar ente componentes y elementos que dan estructura visual al proyecto.

* **services:** En esta sección se ubican todo los servicios que ayudaran a conectar e interacturar con nuestro backend.
