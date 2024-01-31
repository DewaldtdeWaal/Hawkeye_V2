import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-site-page',
  templateUrl: './dynamic-site-page.component.html',
  styleUrls: ['./dynamic-site-page.component.css']
})
export class DynamicSitePageComponent implements OnChanges {
  @Input() structure: any = { components: [] };
  @Input() shortenStructure: any;
  @Input() chartedStructure: any;
  @Input() showTrends: any;

  showTrend: boolean = false;

ngOnChanges(changes: SimpleChanges): void {
  if ('showTrends' in changes) {
    this.showTrend = changes['showTrends'].currentValue;
  }
}

}
