import { Component, OnInit, Input } from '@angular/core';
import {  Interview} from '../models/Interview.model';
import { ModalController } from '@ionic/angular';
import { AppService} from '../app.service';
import { JobDescriptionComponent } from '../job-description/job-description.component';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @Input() interviewDetails: Interview;
  constructor(public modalController: ModalController,
    private service: AppService) {
    this.interviewDetails = this.service._interviewDetails;
   }

  ngOnInit() {}

  closeWindow(){
    this.modalController.dismiss();
  }

  /**
   * converts the date to readable form
   * @param date 
   */
  convertReadabaleDate(date: any): String{
    let dateArray;
    let dateString;
    if(date.toString().indexOf("T") > -1){
      dateArray = date.toString().split("T");
      dateString = dateArray[0];
    }else{
      dateArray = date.toString().split(" ");
      dateString = dateArray[0] + " " + dateArray[1] + " " + dateArray[2] + " " + dateArray[3];
    }
    return dateString;
  }

  /**
   * converts the number to US number format
   * @param numberString 
   */
  formatUSNumber(numberString: String): String{
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return numberString.replace(phoneRegex, "($1) $2-$3");
  }

  async presentJobDescriptionModal(desc: any) {
    console.log(desc);
    const modal = await this.modalController.create({
      component: JobDescriptionComponent,
      componentProps: { jd: desc }
    });
    return await modal.present();
  }

}
