import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginaNoEncontradaRoutingModule } from './pagina-no-encontrada-routing.module';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada.component';


@NgModule({
  declarations: [
    PaginaNoEncontradaComponent
  ],
  imports: [
    CommonModule,
    PaginaNoEncontradaRoutingModule
  ]
})
export class PaginaNoEncontradaModule { }
