import { Component, OnInit, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';


@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
})
export class JobDescriptionComponent implements OnInit {
  @Input() jd: String = '';
  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeJdWindow(){
    this.modalController.dismiss();
  }

}
