import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-real-scan',
  templateUrl: './real-scan.component.html',
  styleUrls: ['./real-scan.component.css']
})
export class RealScanComponent implements OnChanges {
  @Input() structure:any = {
    "componentType": "",
    "driverName": "",
    "description": "",
    "tagName": "",
    "useUnit": true,
    "unit": "",
    "value" : ""}

  value = "";
  unit = "";

    ngOnChanges(): void 
    {
      this.UpdateUnit()
    }

  UpdateUnit()
  {
    if(this.structure.useUnit == true)
      {
        return this.structure.unit;
      }
      else
        return ""
  }
}
