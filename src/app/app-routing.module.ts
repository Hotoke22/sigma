import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LayoutDashboardComponent } from './components/layout/layout-dashboard/layout-dashboard.component';

const routes: Routes = [

  {path: '', redirectTo: '/inicio', pathMatch: 'full'},

  {path:'', component: LayoutDashboardComponent, children:[

    { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },

    { path: 'clientes', loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule) },

    { path: 'usuarios', loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule) },

    { path: 'roles-usuario', loadChildren: () => import('./modules/roles-usuario/roles-usuario.module').then(m => m.RolesUsuarioModule) },

    { path: 'mascotas', loadChildren: () => import('./modules/mascotas/mascotas.module').then(m => m.MascotasModule) },

    { path: 'ciudades', loadChildren: () => import('./modules/ciudades/ciudades.module').then(m => m.CiudadesModule) },

  ]},

  { path: 'inicio', loadChildren: () => import('./modules/inicio/inicio.module').then(m => m.InicioModule) }, { path: 'autenticacion', loadChildren: () => import('./auth/autenticacion/autenticacion.module').then(m => m.AutenticacionModule) }, { path: 'reset-password', loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) }, { path: 'registro-clientes', loadChildren: () => import('./modules/registro-clientes/registro-clientes.module').then(m => m.RegistroClientesModule) }, { path: 'empleados', loadChildren: () => import('./modules/empleados/empleados.module').then(m => m.EmpleadosModule) }, { path: '404', loadChildren: () => import('./modules/pagina-no-encontrada/pagina-no-encontrada.module').then(m => m.PaginaNoEncontradaModule) }, { path: 'membresia', loadChildren: () => import('./modules/membresia/membresia.module').then(m => m.MembresiaModule) }, { path: 'servicios', loadChildren: () => import('./modules/servicios/servicios.module').then(m => m.ServiciosModule) }, { path: 'productos', loadChildren: () => import('./modules/productos/productos.module').then(m => m.ProductosModule) }, { path: 'sucursales', loadChildren: () => import('./modules/sucursales/sucursales.module').then(m => m.SucursalesModule) }, {path:'**', redirectTo: '404' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
