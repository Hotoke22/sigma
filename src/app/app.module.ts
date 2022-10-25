import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutDashboardComponent } from './components/layout/layout-dashboard/layout-dashboard.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { FooterDashboardComponent } from './components/layout/footer-dashboard/footer-dashboard.component';
import { NavigationDashboardComponent } from './components/layout/navigation-dashboard/navigation-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BodyDashboardComponent } from './components/layout/body-dashboard/body-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutDashboardComponent,
    HeaderComponent,
    FooterComponent,
    FooterDashboardComponent,
    NavigationDashboardComponent,
    BodyDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
