import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {
  defaultQuestion:any = "Pet"
  signupForm: FormGroup = {} as FormGroup

  forbiddenpasswords=['1234','0000',"4321","2023"]

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'email': new FormControl('',[Validators.required,Validators.email],this.ForbiddenEmails.bind(this))
     ,'password': new FormControl(null,[Validators.required, this.ForbiddenPasswords.bind(this)])
     ,'Extra': new FormGroup({
        'securityQuestion': new FormControl('Pet',[Validators.required])
       ,'securityAnswer': new FormControl('',[Validators.required])})
     ,'tags': new FormArray([])
   });

  //  this.signupForm.valueChanges.subscribe((value) => {         // log all changes
  //   console.log(value);
  //  })
   this.signupForm.setValue({
    'email':'',
    'password':'',
    'Extra': {
      'securityQuestion': "Pet",
      'securityAnswer': "Doggy"
    },
    'tags':[]
   })

   this.signupForm.patchValue({'Extra':{'securityQuestion':"Teacher",'securityAnswer': ""}})
  }

  OnSubmit()
  {
    this.signupForm.reset()
  }

  OnAddTag()
  {
    const control = new FormControl(null);
    (<FormArray> this.signupForm.get('tags')).push(control)
  }

  OnRemoveTag()
  {
    var cont = (<FormArray> this.signupForm.get('tags')).controls
    var len = cont.length
    cont.splice(len-1,1)
  }

  GetControls()
  {
    return (this.signupForm.get("tags") as FormArray).controls
  }

  ForbiddenPasswords(control: FormControl):{[s:string]:boolean} // this is a custom validator
  {
    if(this.forbiddenpasswords.indexOf(control.value) > -1)
      return {'passwordIsForbidden':true}

    return null;
  }

  ForbiddenEmails(control: FormControl): Promise<any> | Observable<any>
  {
    const promise = new Promise((resolve,reject) => {
      setTimeout(() => {  if(control.value == 'admin@macautomation.co.za')
                            reject({'emailIsForbidden':true})
                          else
                            resolve (null)
    },1500);
    })
    

    return promise;
  }
}
