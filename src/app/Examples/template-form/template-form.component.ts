import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  @ViewChild('f') LoginForm: NgForm = {} as NgForm; 
  defaultQuestion:any = "Pet"
  // OnSubmit(form:NgForm)
  // {
  //   console.log(form)
  // }

  OnSubmit()
  {
    this.LoginForm.reset({
      'email':'',
      'password':'',
      'Extra':{
        'secret':'Pet',
        'secretAnswer':''
      }
    }); // this can take an object like patchValue to reset everything except the ones you set / nothing which will reset all inputs
  }

  SetValue()
  {
    //object passed must have the same format (all items and the values to assign them) as html form structure
    this.LoginForm.setValue({
      'email':''
     ,'password':''
     ,'Extra':{
        'secret':'Pet'
       ,'secretAnswer':''
     }
    })

    
    //object passed must have the same format (only the items that must change) as html form structure
    this.LoginForm.form.patchValue({
     'Extra':{
        'secret':'Teacher'
     }
    })
  }

}
