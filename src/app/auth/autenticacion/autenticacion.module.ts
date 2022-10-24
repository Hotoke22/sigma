import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { AutenticacionComponent } from './autenticacion.component';


@NgModule({
  declarations: [
    AutenticacionComponent
  ],
  imports: [
    CommonModule,
    AutenticacionRoutingModule,
    MatIconModule
  ]
})
export class AutenticacionModule { }
