import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { InterviewListItem } from './models/InterviewListItem.model';
import { Interview } from './models/Interview.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // latitude and longitude for map
  _lat: number;
  _lng: number;
  _locationName: string;

  _showInterviewListOverlay: boolean = true;

  // controls the linear mode for create form.
  // true : cant proceed to next form unless current form is valid.
  _linearModeForCreateForms: boolean = true;

  _viewMode : boolean = false;
  _interviewDetails: Interview;

  constructor(private storage: Storage) {

  }

  /**
   * Get the data for interview list
   * @param data 
   */
  getDataForInterviewList(data: any): InterviewListItem[] {
    const interviewList: InterviewListItem[] = [];
    data.forEach((interview) => {
      let dateArray;
      let dateString;
      if(interview.date.toString().indexOf("T") > -1){
        dateArray = interview.date.toString().split("T");
        dateString = dateArray[0];
      }else{
        dateArray = interview.date.toString().split(" ");
        dateString = dateArray[0] + " " + dateArray[1] + " " + dateArray[2] + " " + dateArray[3];
      }
      
      
      let interviewListItem: InterviewListItem = {
        id: interview.id,
        designation: interview.designation,
        companyName: interview.company.name,
        address: interview.company.address.addressLine,
        date: dateString,
        time: interview.time,
        location: {
          lat: interview.location.lat,
          lng: interview.location.long
        },
        showLocationBtn: interview.location.lat ? true : false
      };

      interviewList.push(interviewListItem);
    });
    return interviewList;
  }

  /**
   * Get the data from Storage
   */
  getDataFromStorage(): Promise<any> {
    return this.storage.get("interviews");
  }

  /**
   * Save data to Storage
   * @param dataToSave 
   */
  saveDataToStorage(dataToSave: any): Promise<any> {
    return this.storage.set("interviews", dataToSave);
  }

  /**
   * initialize the storage 
   */
  initStorage(): Promise<any>{
    return this.storage.set("interviews", []);
  }

  /**
   * Delete an interview by id
   * @param id 
   */
  deleteInterviewById(id: any): Promise<any>{
    return this.getDataFromStorage()
    .then((data)=>{
      const index = data.map((item)=> { 
        return item.id; 
      })
      .indexOf(id);

      if(index > -1){
        data.splice(index, 1);
        //console.log(data);
        return this.saveDataToStorage(data);
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  /**
   * show or hide the list helper overlay
   */
  showInterviewListOverlay(): boolean{
    return this._showInterviewListOverlay;
  }

  /**
   * create data for save
   * @param firstFormGroup 
   * @param secondFormGroup 
   * @param thirdFormGroup 
   * @param lat 
   * @param long 
   */
  createInterviewData(firstFormGroup, secondFormGroup, thirdFormGroup, lat, long){
    const interview: Interview = {
      id: Date.now().toString(),
      designation: firstFormGroup.value.designation,
      company: {
        name: firstFormGroup.value.companyName,
        address: {
          addressLine: secondFormGroup.value.addressLine,
          city: secondFormGroup.value.city,
          state: secondFormGroup.value.state,
          zipCode: secondFormGroup.value.zipCode
        }
      },
      date: firstFormGroup.value.date,
      time: firstFormGroup.value.time,
      jobDescription: firstFormGroup.value.jobDescription,
      contact: {
        name: thirdFormGroup.value.supervisorName,
        email:  thirdFormGroup.value.email,
        phone: thirdFormGroup.value.contact
      },
      location: {
        lat: lat,
        long: long
      }
    };

    return interview;
  }

  /**
   * Get the details by Id
   * @param id 
   */
  getInterviewDetailsById(id: String): Promise<any>{
    return this.getDataFromStorage()
    .then((data)=>{
     

      const interviewDetails = data.filter( (item)=> {
        return item.id === id;
      })[0];


      console.log(interviewDetails);
      return interviewDetails;
    })
    .catch((err)=>{
      console.log(err);
    });
  }

}
