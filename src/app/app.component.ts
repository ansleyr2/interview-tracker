import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppService } from '../app/app.service';
import { Router } from '@angular/router';

import {
  LoadingController,
  ModalController
} from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loading;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Create',
      url: '/create-interview',
      icon: 'create'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private service: AppService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.showLoading()
      .then(()=>{
        this.initAppDataAndRedirectHome();
      })
      .catch((err)=>{
          console.log("show loading failed.");
      });
    });
  }

  async showLoading(){
    this.loading = await this.loadingCtrl.create({
      message: 'Initializing...'
    });

    await this.loading.present();
  }

  initAppDataAndRedirectHome(){
    this.service.getDataFromStorage()
      .then((data)=>{
        this.loading.dismiss();
        if(!data){
          this.service.initStorage()
          .then(()=>{
            this.router.navigate(['/home'],{replaceUrl: true});
          })
          .catch((err)=>{
            console.log(err);
          });
        }else{
          this.router.navigate(['/home'],{replaceUrl: true});
        }
      })
      .catch((err)=>{
        this.loading.dismiss();
        console.log(err);
      });
  }
}
