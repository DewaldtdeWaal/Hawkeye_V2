import { Component, Input, Output, EventEmitter, ViewChild, AfterContentInit, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-boolean-scan-creation',
  templateUrl: './boolean-scan-creation.component.html',
  styleUrls: ['./boolean-scan-creation.component.css']
})
export class BooleanScanCreationComponent implements AfterContentInit, OnChanges {
  @Input() structure:any = null
  @Input() developertags:any = null;
  @Output() updatechild = new EventEmitter<any>();
  @Output() pagechanged = new EventEmitter<any>();
  drivers:any = []
  tagnames:any = []
  icons = ["check","cross","door closed", "door open"]

  ngOnChanges(changes: SimpleChanges): void {
  }

  PageChanged()
  {
    this.pagechanged.emit()
  }

  ngAfterContentInit(): void 
  {
    this.UpdateDriverInformation()
  }

  UpdateDriverInformation()
  {
    this.drivers = []

    for(var drN in this.developertags)
    {
      this.drivers.push(drN)
    }

  }

  UpdateTagInformation(event:any)
  {
    this.pagechanged.emit()
    this.tagnames = []
    var driverselected = (<HTMLInputElement>event.target).innerHTML
    this.structure.driverName = driverselected
    for(var i =0; i< this.developertags[driverselected].length; i++)
    {
      this.tagnames.push(this.developertags[driverselected][i])
    }
    this.tagnames.push("commstatus")
    this.tagnames.push("lastupdate")
  }

  UpdateTagName(event:any)
  {
    this.pagechanged.emit()
    this.structure.tagName = (<HTMLInputElement>event.target).innerHTML
  }

  updateChild()
  {
    this.pagechanged.emit()


    this.structure["componentType"] = "boolean_scan"
    this.structure["value"] = ""

    if(this.structure.description == undefined || this.structure.description == "")
    {
      this.structure["description"] = "No Name"
    }

    this.updatechild.emit(this.structure)
  }
}
