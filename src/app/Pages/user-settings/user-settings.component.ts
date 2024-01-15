import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from 'src/app/communication.service';
import { UserAuthenticationService } from 'src/app/user-authentication.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
@Input() userdata:any = null
oldpassword = ""
newpassword = ""
confirmpassword = ""

constructor(private http:HttpClient, private commservice:CommunicationService, private userauth: UserAuthenticationService)
{
  
}

SetNewPassword()
{

  if(this.confirmpassword == this.newpassword)
  {
    var message = {requesttype:"set user password",user:this.userauth.email,oldpassword:this.oldpassword,newpassword:this.newpassword}
    this.http.post<any>(this.commservice.postHostName,message).subscribe((res)=>
    {
      this.oldpassword = ""
      this.newpassword = ""
      this.confirmpassword = ""
    })
  }
  
}
}
