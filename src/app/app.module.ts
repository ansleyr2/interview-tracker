import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { IonicStorageModule } from '@ionic/storage';

import { MapComponent } from './map/map.component';
import { DetailsComponent } from './details/details.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import {  AppService } from './app.service';

@NgModule({
  declarations: [AppComponent, MapComponent, DetailsComponent, JobDescriptionComponent],
  entryComponents: [MapComponent, DetailsComponent, JobDescriptionComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
