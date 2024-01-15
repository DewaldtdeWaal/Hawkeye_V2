import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationService } from 'src/app/communication.service';
import { UserAuthenticationService } from 'src/app/user-authentication.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements AfterContentInit {
  @Input() userdata:any = {}
  selecteduser = ""
  selecteduserObj:any = {}
  useritems = []
  fetchedusers = []
  @Input() customers = []
  @Output() pagechanged = new EventEmitter<any>()
  @Output() discardchanges = new EventEmitter<any>()
  @Output() savechanges = new EventEmitter<any>()
  customerChecked = []
  disableuserchange = false
  showprojectwarning = false

  constructor(private http:HttpClient, private userauth: UserAuthenticationService, private commservice:CommunicationService)
  {

  }

  ngAfterContentInit(): void {
    this.GetUsers()
    this.GetCustomerObj()
  }

  GetCustomerObj()
  {
    this.customerChecked = []
    for(var cust of this.customers)
    {

      var found = false

      if(this.selecteduserObj.pages)
      {
        for(var usrcust in this.selecteduserObj.pages)
        {
          if(cust == usrcust)
          {
            found = true
            break
          }
        }
      }
  

      this.customerChecked.push({customer:cust,enable:found})
    }
  }

  GetUsers()
  {
    this.http.post<any>(this.commservice.postHostName,{requesttype:"get users",user:this.userauth.email}).subscribe((resp)=>
    {


      this.fetchedusers = resp

      
      this.GetUserItems()
    })
  }

  GetUserItems()
  {
    this.useritems = ["New User"]

    for(var item of this.fetchedusers)
    {
      this.useritems.push(item.name + " " + item.surname)
    }
  }

  SetUser(username:string)
  {
    this.SetSelectedUser(username)
  }

  SetSelectedUser(username:string)
  {
    var usrsplit = username.split(' ')


    var usrs = this.fetchedusers.filter((value) => 
    {
      if(usrsplit.length > 1)
      {
        if((value.name == usrsplit[0] && value.surname == usrsplit[1]) )
        {
          return true
        }
      }
      else if(value.email == username)
        return true
      return false
    })

    if(usrs.length == 1)
    {
      this.selecteduser = usrs[0].email
      this.selecteduserObj = JSON.parse(JSON.stringify(usrs[0]))
    }


    if(username == "New User")
    {
      this.selecteduser = username
      this.selecteduserObj = {}
    }
    
    this.GetCustomerObj()
  }

  PageChanged()
  {
    this.disableuserchange = true
    this.pagechanged.emit()
  }

  SaveChanges()
  {
    if(this.selecteduserObj.pages == undefined)
      this.selecteduserObj.pages = {}

    var selectedProject = false

    for(var cust of this.customerChecked)
    {
      if(!cust.enable)
      {
        if(this.selecteduserObj.pages[cust.customer] != undefined)
          delete this.selecteduserObj.pages[cust.customer]
      }
      else if(this.selecteduserObj.pages[cust.customer] == undefined && cust.enable)
        this.selecteduserObj.pages[cust.customer] = []

        if(cust.enable == true)
          selectedProject = true
    }

    if(selectedProject == true)
    {
      this.http.post<any>(this.commservice.postHostName,{requesttype:"create user",user:this.userauth.email,userdata:this.selecteduserObj}).subscribe((resp)=>
      {
        var found = false
        for(var i = 0; i < this.fetchedusers.length; i++)
        {
          if(this.fetchedusers[i].email == this.selecteduserObj.email)
          {
            this.fetchedusers[i] = this.selecteduserObj
            found = true
            break
          }
        }
  
        if(!found)
        {
          this.selecteduserObj.userid = resp.userid
          this.fetchedusers.push(this.selecteduserObj)
        }
  
        this.selecteduser = ""
        this.selecteduserObj = {}
        this.disableuserchange = false
        this.showprojectwarning = false
        this.SetSelectedUser("New User")
        this.GetUserItems()
        this.savechanges.emit()
      })
    }
    else
    {
      this.showprojectwarning = true
    }

    
  }

  DiscardChanges()
  {
    if(this.selecteduserObj.email)
      this.SetSelectedUser(this.selecteduserObj.email)
    else
      this.SetSelectedUser("New User")
    this.disableuserchange = false
    this.showprojectwarning = false
    this.discardchanges.emit()
  }

  DeleteUser()
  {
    this.http.post<any>(this.commservice.postHostName,{requesttype:"delete user",user:this.userauth.email,userdata:{email:this.selecteduserObj.email,userid:this.selecteduserObj.userid}}).subscribe((resp)=>
    {
      
      var index = -1

      for(var i = 0; i < this.fetchedusers.length; i++)
      {
        if(this.selecteduserObj.email == this.fetchedusers[i].email)
        {
          index = i
          break
        }
      }

      if(index > -1 )
      {
        this.fetchedusers.splice(index,1)
      }

      this.selecteduser = ""
      this.selecteduserObj = {}
      this.SetSelectedUser("New User")
      this.GetUserItems()
      this.savechanges.emit()
    })
  }

  DisableAccess()
  {
    return this.selecteduserObj.superuser || (!this.userdata.superuser && (this.selecteduserObj.admin || this.selecteduserObj.developer) && this.userdata.admin)
  }
}
