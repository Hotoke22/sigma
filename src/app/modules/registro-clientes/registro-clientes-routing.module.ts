import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroClientesComponent } from './registro-clientes.component';

const routes: Routes = [{ path: '', component: RegistroClientesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroClientesRoutingModule { }
