import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-driver-creation',
  templateUrl: './driver-creation.component.html',
  styleUrls: ['./driver-creation.component.css']
})
export class DriverCreationComponent implements OnChanges {

  @Input() driverdata:any = {};
  sitenames:any = []
  sitefilter:any = ""
  sitename:any = ""
  selectedsite:any = null
  disablesiteselection:any = false
  tagnames:any = []
  currenttag = null
  disabletagselector = false;
  displaysave = false


  GetTags()
  {
    this.tagnames = []
    for(var x = 0; x<this.selectedsite.dataArray.length; x++)
    {
      this.tagnames.push(this.selectedsite.dataArray[x].tagName)
    }
  }


  SetSelectedTag(event:any)
  {
      var selectedtag = event
  
      for(var i = 0; i < this.selectedsite.dataArray.length; i++)
      {
        if(selectedtag == this.selectedsite.dataArray[i].tagName)
          this.currenttag = this.selectedsite.dataArray[i]
      }
  }




  constructor(private http:HttpClient, private commservice:CommunicationService)
  {
    this.GetSites()
  }

  ngOnChanges(changes: SimpleChanges): void 
  {
    this.GetSites()
  }
  
  GetSite(event:any)
  {
    this.sitename = event
    this.selectedsite = null

    for(var i = 0; i<this.driverdata.length; i++)
    {
      if(this.sitename == this.driverdata[i].driverName)
      {
        this.selectedsite = this.driverdata[i]
        this.GetTags()
        break;
      }
    }
    this.currenttag = null
  }

  TagEditorChange()
  {
    this.disabletagselector = true
    this.disablesiteselection = true;
    this.displaysave = false
  }
  
  TagEditorSaved()
  {
    this.disabletagselector = false
    this.displaysave = true
    this.currenttag = null
  }

  ValueChanged()
  {
    this.disablesiteselection = true;
    this.displaysave = true
  }

  GetSites()
  {
    this.sitenames = []
    for(var i = 0; i<this.driverdata.length; i++)
    {
      this.sitenames.push(this.driverdata[i].driverName)
    }
  }

  ReadData()
  {
    let selected:any = document.getElementById("picker")

    let reader = new FileReader();

    var Anon = () => {
      let data = reader.result
      
      var message = {requesttype:"add driver", user:"Brandon", driver: data}
      this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
      {
        
      })
      reader.removeEventListener("loadend",Anon)
    }
    
    reader.addEventListener("loadend", Anon)

    
    reader.readAsText(selected.files[0]);
  }

  SaveSite()
  {
    this.displaysave = false
    this.disablesiteselection = false;
    this.selectedsite = null;
    this.currenttag = null
  }

}
