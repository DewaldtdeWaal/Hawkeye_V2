import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthenticationService } from 'src/app/user-authentication.service';

@Component({
  selector: 'app-new-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
isLoading:any
  enteredTitle = "";
  enteredContent = "";

  email : string;
  password : string;


  constructor(private router: Router, public userAuth: UserAuthenticationService) { }
  
 togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
  onSubmit(form : NgForm)
  {

    console.log(form.value)
    if (form.invalid){
      return;
    }
    this.userAuth.login(form.value.email, form.value.password,"/App")
      form.resetForm();
  }

}
