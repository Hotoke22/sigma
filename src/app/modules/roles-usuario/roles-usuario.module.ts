import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesUsuarioRoutingModule } from './roles-usuario-routing.module';
import { RolesUsuarioComponent } from './roles-usuario.component';


@NgModule({
  declarations: [
    RolesUsuarioComponent
  ],
  imports: [
    CommonModule,
    RolesUsuarioRoutingModule
  ]
})
export class RolesUsuarioModule { }
