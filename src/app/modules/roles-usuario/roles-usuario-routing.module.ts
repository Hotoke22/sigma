import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesUsuarioComponent } from './roles-usuario.component';

const routes: Routes = [{ path: '', component: RolesUsuarioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesUsuarioRoutingModule { }
