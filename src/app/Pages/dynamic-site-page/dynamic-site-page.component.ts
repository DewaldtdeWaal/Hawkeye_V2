import { Component, ViewChild, AfterContentInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-dynamic-site-page',
  templateUrl: './dynamic-site-page.component.html',
  styleUrls: ['./dynamic-site-page.component.css']
})
export class DynamicSitePageComponent implements AfterContentInit {
  @Input() structure: any = { components: [] };

  

  constructor(private http: HttpClient) {}

  siteTitle: string = "Site Title";

  chatVariable: any;


  ngOnInit() {
        let i = 0;

    console.log(this.structure)

    while (i < this.structure.components.length) {


      let componentType = this.structure.components[i].components[0].componentType;
      let component = this.structure.components[i].components[0]
      console.log(componentType)

      if (componentType == "chart")
      {
     

        this.chatVariable = componentType
      }
        
        
      i++
    }
  }


  ngAfterContentInit(): void {

  }

}
