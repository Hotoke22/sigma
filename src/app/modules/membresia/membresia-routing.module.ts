import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembresiaComponent } from './membresia.component';

const routes: Routes = [{ path: '', component: MembresiaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembresiaRoutingModule { }
