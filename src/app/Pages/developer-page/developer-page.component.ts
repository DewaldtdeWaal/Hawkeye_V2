import { Component,EventEmitter,Output, Input, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UserAuthenticationService } from 'src/app/user-authentication.service';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-developer-page',
  templateUrl: './developer-page.component.html',
  styleUrls: ['./developer-page.component.css']
})
export class DeveloperPageComponent implements AfterContentInit, OnChanges {
dummy = {dummy:""}
currentstructure:any = this.dummy;
currentstructureselector:any = "Select Page";
pagechangedisabled:any = false;
newpagestring:any = "New Page"
hidedelete:any = false
cansave:any = true;
disablecreationpage:any = false;
@Input() developertags:any = null;
@Input() structure:any = null;
@Input() customers:any = []
@Input() heirarchystructure:any = {}
@Output() changepage = new EventEmitter<any>();


@Output() pagechanged = new EventEmitter<any>();
@Output() savechanges = new EventEmitter<any>();
@Output() discardchanges = new EventEmitter<any>();


pages:any = []

ngAfterContentInit(): void {
  this.developertags = this.structure.developerTags
  this.UpdatePages()
}

ngOnChanges(changes: SimpleChanges): void {
  this.ParentUpdateStructure()
}

DeletePage()
{
  this.pagechanged.emit();
  this.hidedelete = true
  this.disablecreationpage = true
  this.pagechangedisabled = true;
  this.cansave = false;
  const message = {requesttype: "delete page", user:this.userAuth.email, pageid: this.currentstructure.id}
  this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
  {
    this.PageChanged();
    this.pagechangedisabled = false;
    this.hidedelete = false;
    var index = -1
    for(var i = 0; i < this.structure.pages.length; i++)
    {
      if(this.structure.pages[i].pageName == this.currentstructureselector)
      {
        index = i
      }
    }

    this.structure.pages.splice(index,1)

    this.currentstructure = this.dummy;
    this.currentstructureselector = "Select Page";
    this.disablecreationpage = false
    this.savechanges.emit(this.structure)
  })
}

SavePage()
{
  this.cansave = false;
  this.disablecreationpage = true;
  const message = {requesttype: "add page", user:this.userAuth.email, page: this.currentstructure}
  this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
  {
      this.currentstructure.id = res.response
      this.disablecreationpage = false;
      this.pagechangedisabled = false;
      this.hidedelete = false;
      this.savechanges.emit(this.structure)
  })

}

DiscardChanges()
{
  this.disablecreationpage = true;
  this.discardchanges.emit()
  this.pagechangedisabled = false;
  this.hidedelete = false;
  setTimeout(() => {this.disablecreationpage = false;},500)
}


UpdatePages()
{
  this.pages = [this.newpagestring]
  for(var i = 0; i < this.structure.pages.length; i++)
  {
    this.pages.push(this.structure.pages[i].pageName)
  }
}

PageChanged()
{
  this.cansave = true;
  this.pagechangedisabled = true;
  this.hidedelete = true;
  this.pagechanged.emit();
}

constructor(private http:HttpClient, private userAuth:UserAuthenticationService, private commservice: CommunicationService)
{

}

ParentUpdateStructure()
{
  this.currentstructure = null

  for(var i = 0; i < this.structure.pages.length; i++)
  {
    if(this.structure.pages[i].pageName == this.currentstructureselector)
    {
      this.currentstructure = this.structure.pages[i]
      break;
    }
  }

  if(this.currentstructure == null && this.currentstructureselector == this.newpagestring)
  {
    this.structure.pages.push({pageName:this.newpagestring})
    this.currentstructure = this.structure.pages[this.structure.pages.length-1]
  }
  if(this.currentstructure == null)
  {
    this.currentstructure = this.dummy
  }
}


UpdateCurrentStructure(event:any)
{
  this.UpdatePages()
  this.disablecreationpage = true
  this.currentstructureselector = event
  this.currentstructure = null

  for(var i = 0; i < this.structure.pages.length; i++)
  {
    if(this.structure.pages[i].pageName == this.currentstructureselector)
    {
      this.currentstructure = this.structure.pages[i]
      break;
    }
  }

  if(this.currentstructure == null && this.currentstructureselector == this.newpagestring)
  {
    this.structure.pages.push({pageName:this.newpagestring})
    this.currentstructure = this.structure.pages[this.structure.pages.length-1]
  }
  if(this.currentstructure == null)
  {
    this.currentstructure = {dummy:""}
  }
  setTimeout(() => {this.disablecreationpage = false},500)
}
}
