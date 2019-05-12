import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateInterviewPage } from './create-interview.page';

import {DemoMaterialModule} from '../../material-modules';


const routes: Routes = [
  {
    path: '',
    component: CreateInterviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DemoMaterialModule ,
    ReactiveFormsModule ],
  declarations: [CreateInterviewPage]
})
export class CreateInterviewPageModule {}
