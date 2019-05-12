import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import {
  LoadingController
} from '@ionic/angular';

import { AppService } from '../app.service';

import { InterviewListItem } from '../models/InterviewListItem.model';
import { DetailsComponent } from '../details/details.component';
import { Interview } from '../models/Interview.model';

@Component({
  selector: 'app-list',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  loading;
  myData;

  overlayHidden: boolean = false;

  interviewList: InterviewListItem[] = [];

  constructor(public modalController: ModalController,
    private router: Router,
    public service: AppService,
    public loadingCtrl: LoadingController,
    private alertController: AlertController,
    private ref: ChangeDetectorRef) {
    this.overlayHidden = this.service.showInterviewListOverlay() ? false : true;

  }

  ngOnInit() {
    console.log("in ngOnInit...");
    this.loadInterviewList();
  }

  async loadInterviewList() {
    this.showLoading()
      .then(() => {
        this.service.getDataFromStorage()
          .then((data) => {
            this.loading.dismiss().then(() => {
              this.interviewList = this.service.getDataForInterviewList(data);
              // Hack for list not reloading after successfull delete.
              this.ref.detectChanges();
            });

          })
          .catch((err) => {
            this.loading.dismiss().then(() => {
              console.log(err);
            });
          });
      })
      .catch((err) => {
        console.log("Show loading failed.");
      });
  }

  deleteInterview(id: String) {
    console.log("in removeItem", id);

    this.showLoading()
    .then(()=>{
      this.service.deleteInterviewById(id)
      .then(() => {
        this.loading.dismiss()
        .then(()=>{
          this.loadInterviewList();
        })
        .catch((err)=>{
          console.log("Dismiss loading failed in deleteInterview");
        });
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err)=>{
      console.log("Show loading failed.");
    });
  }

  method1() {
    console.log("in method1");
  }

  public hideOverlay() {
    this.overlayHidden = true;
    this.service._showInterviewListOverlay = false;
  }

  viewLocation(location: any, address: string) {
    console.log("clicked viewLocation...");
    this.service._lat = location.lat;
    this.service._lng = location.lng;
    this.service._locationName = address;
    this.router.navigateByUrl("location");
  }

  viewDetails(id: String) {
    console.log("clicked viewDetails...");

    this.service.getInterviewDetailsById(id)
    .then((data)=>{
      this.service._interviewDetails = data;
      this.presentDetailsModal(data);
   })
    .catch((err)=>{
      console.log(err);
    });
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();
  }

  async presentDeleteConfirm(id: String) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Do you really want to delete this interview?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Delete');
            this.deleteInterview(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDetailsModal(data: Interview) {
    const modal = await this.modalController.create({
      component: DetailsComponent,
      componentProps: { value: data }
    });
    return await modal.present();
  }
}




