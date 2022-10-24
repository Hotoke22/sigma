import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembresiaRoutingModule } from './membresia-routing.module';
import { MembresiaComponent } from './membresia.component';


@NgModule({
  declarations: [
    MembresiaComponent
  ],
  imports: [
    CommonModule,
    MembresiaRoutingModule
  ]
})
export class MembresiaModule { }
