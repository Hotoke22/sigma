import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroClientesRoutingModule } from './registro-clientes-routing.module';
import { RegistroClientesComponent } from './registro-clientes.component';


@NgModule({
  declarations: [
    RegistroClientesComponent
  ],
  imports: [
    CommonModule,
    RegistroClientesRoutingModule
  ]
})
export class RegistroClientesModule { }
