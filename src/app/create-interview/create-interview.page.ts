import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Interview } from '../models/Interview.model';

import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { MatStepper } from '@angular/material/stepper';

import { AppService } from '../app.service';
import { isValid } from 'ionicons/dist/types/icon/utils';

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

//Custom validator to accept US phone number
export function PhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let validNumber = false;
    if (phoneRegex.test(control.value)) {
      console.log(control.value.replace(phoneRegex, "($1) $2-$3"));
      validNumber = true;
    } else {
      // Invalid phone number
      validNumber = false;
    }

    return validNumber ? null : { 'wrongNumber': { value: control.value } };

  }
}

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.page.html',
  styleUrls: ['./create-interview.page.scss'],
  providers: [NativeGeocoder]
})
export class CreateInterviewPage implements OnInit {
  loading;
  data = '';
  lat;
  long;

  stepperRef: MatStepper;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  interview: Interview;

  isLinear: Boolean;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private nativeGeocoder: NativeGeocoder,
    public loadingController: LoadingController,
    private router: Router,
    public alertController: AlertController,
    public service: AppService,
    public zone: NgZone) {
  }

  ngOnInit() {
    this.service._viewMode ? this.populateForms(): this.buildForms();
    //this.buildForms();
    this.isLinear = this.service._linearModeForCreateForms;
  }
  createInterview() {
    this.createInterviewObject();
  }

  buildForms() {
    this.firstFormGroup = this._formBuilder.group({
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      jobDescription: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      addressLine: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      supervisorName: ['', Validators.required],
      contact: ['', [PhoneNumberValidator()]],
      email: ['', Validators.email]
    });
  }

  populateForms() {
    const details = this.service._interviewDetails;
    
    this.firstFormGroup = this._formBuilder.group({
      companyName: [details.company.name],
      designation: [details.designation],
      date: [details.date],
      time: [details.time],
      jobDescription: [details.jobDescription]
    });
    this.secondFormGroup = this._formBuilder.group({
      addressLine: [details.company.address.addressLine],
      city: [details.company.address.city],
      state: [details.company.address.state],
      zipCode: [details.company.address.zipCode]
    });
    this.thirdFormGroup = this._formBuilder.group({
      supervisorName: [details.contact.name],
      contact: [details.contact.phone],
      email: [details.contact.email]
    });
  }

  geoCodeLocation(stepper: MatStepper) {
    this.stepperRef = stepper;
    if (this.secondFormGroup.controls.addressLine.valid &&
      this.secondFormGroup.controls.city.valid &&
      this.secondFormGroup.controls.state.valid &&
      this.secondFormGroup.controls.zipCode.valid) {
      this.presentLoading('Fetching coordinates for the location...').then(() => {
        this.nativeGeocoder.forwardGeocode(`${this.secondFormGroup.value.addressLine}, ${this.secondFormGroup.value.city}, ${this.secondFormGroup.value.state}, ${this.secondFormGroup.value.zipCode}`, this.options)
          .then((coordinates: any[]) => {
            //console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude);
            this.data = 'The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude;
            this.loading.dismiss();
            this.lat = coordinates[0].latitude;
            this.long = coordinates[0].longitude;
            this.goForward(stepper);
          })
          .catch((error: any) => {
            console.log(error);
            this.data = error;
            this.loading.dismiss();
            this.lat = 0;
            this.long = 0;
            this.presentAlertConfirm();
          });
      }
      );
    } else {
      console.log("invalid");
    }


  }

  async presentLoading(msg: string) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    await this.loading.present();
  }

  createInterviewObject() {
    const interview = this.service.createInterviewData(this.firstFormGroup,
      this.secondFormGroup,
      this.thirdFormGroup,
      this.lat,
      this.long);

    this.service.getDataFromStorage()
      .then((data) => {
        data.push(interview);
        this.service.saveDataToStorage(data)
          .then(() => {
            this.zone.run(() => {
              this.router.navigate(['/home'], { replaceUrl: true });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Location',
      message: 'Unable to find coordinates for location. Please check the entered address',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Use As Is',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
            this.goForward(this.stepperRef);
          }
        }, {
          text: 'Retry',
          handler: () => {
            //console.log('Confirm Okay');
            this.geoCodeLocation(this.stepperRef);
          }
        }
      ]
    });

    await alert.present();
  }
}
