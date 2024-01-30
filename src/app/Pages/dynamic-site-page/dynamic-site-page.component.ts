import { Component, ViewChild, AfterContentInit, Input, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-dynamic-site-page',
  templateUrl: './dynamic-site-page.component.html',
  styleUrls: ['./dynamic-site-page.component.css']
})
export class DynamicSitePageComponent implements AfterContentInit {
  @Input() structure: any = { components: [] };

  shortenedStructure: any
  
  chartStructure:any

  constructor(private cdr: ChangeDetectorRef) {}
   reloadComponent(): void {
    // Trigger change detection
    this.cdr.detectChanges();
  }
  siteTitle: string = "Site Title";

  chatVariable: any = {};

  showTrend:any

  ngOnInit() {

    this.shortenedStructure = this.structure.components
    this.chartStructure = this.shortenedStructure

    this.chartStructure = this.chartStructure.filter(item => item.components[0].componentType === "chart");

    console.log()
    if (this.chartStructure[0].components[0].componentType === "chart") {
      this.showTrend = true
    }

    this.shortenedStructure = this.shortenedStructure.filter(item => item.components[0].componentType !== "chart");


    console.log(this.chartStructure)


  }


  ngAfterContentInit(): void { 

  }

}
