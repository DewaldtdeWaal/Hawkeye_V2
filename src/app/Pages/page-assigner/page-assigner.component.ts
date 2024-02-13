import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, Input } from '@angular/core';
import { CommunicationService } from 'src/app/communication.service';
import { HeirarchyEditor } from 'src/app/heirarchy-editor.service';
import { UserAuthenticationService } from 'src/app/user-authentication.service';

@Component({
  selector: 'app-page-assigner',
  templateUrl: './page-assigner.component.html',
  styleUrls: ['./page-assigner.component.css']
})
export class PageAssignerComponent implements AfterContentInit {

  @Input() customers:any = []
  @Input() pages:any = null
  heir:any = {}
  displayheir:any = {}

  pageassignments:any = null
  users:any = []

  currentuser:any = ""
  disableuserchange:any = false
  saveable:any = false

  constructor(private heirarchyeditor:HeirarchyEditor,private http:HttpClient, private userauth: UserAuthenticationService, private commservice:CommunicationService)
  {
    
  }

  ngAfterContentInit(): void {
    this.GetUserData()

    this.SetStructure()

    this.displayheir = this.heir
  }

  async GetUserData()
  {
    const message = {requesttype: "get page assignments", customers:this.customers}
    this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
    {
      this.pageassignments = res
      this.users = []
      for(var user of this.pageassignments)
      {
        this.users.push(user.email)
      }
    })
  }

  SetStructure()
  {
    this.heir = this.heirarchyeditor.GetStructure(this.pages)
  }

  UpdateSiteSelections(updateItemName)
  {
    this.currentuser = updateItemName
    for(var user of this.pageassignments)
    {
      if(user.email == updateItemName)
      {
        
        this.SetStructure()

        this.heirarchyeditor.SelectNavigationChildren(this.heir,user.pages)
        var toremove:any = []
        for(var site in this.heir)
        {
          var found = false
          for(var x in user.pages)
          {
            if(site == x)
            {
              found = true
            }
          }

          if(!found && site != "showchildren" && site != "enable")
          {
            toremove.push(site)
          }
        }

        for(var item of toremove)
        {
          delete this.heir[item]
        }

        this.displayheir = this.heir
        break
      }
    }
  }

  UpdateUser()
  {
    var out = {}
     this.heirarchyeditor.BuildUserPages(this.displayheir,out)

    for(var cust of this.customers)
    {
      var exists = false 

      for(var omer in out)
      {
        if(cust == omer)
        {
          exists = true
          break
        }
      }
      if(!exists)
      {
        out[cust] = []
      }
    }
    
    for(var user of this.pageassignments)
    {
      if(user.email == this.currentuser)
      {

        for(var customer in out)
        {
          if(user.pages[customer])
          {
            user.pages[customer] = out[customer]
          }
        }

        var userList = []
        userList.push(user)

        const message = {requesttype: "set page assignments", user:this.userauth.email ,assignments:userList}
        this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
        {
          this.disableuserchange = false
          this.currentuser = ""
        })

        break;
      }
    }

  }

  HeirarchyValueChanged()
  {
    if(this.currentuser != "")
    {
      this.disableuserchange = true
      this.saveable = false
    }
  }
  


}
