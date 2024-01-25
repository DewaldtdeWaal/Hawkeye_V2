import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { number } from 'echarts';

@Component({
  selector: 'app-embedded-drop-down',
  templateUrl: './embedded-drop-down.component.html',
  styleUrls: ['./embedded-drop-down.component.css']
})
export class EmbeddedDropDownComponent implements AfterContentInit, OnChanges {
  @Input() structure:any = null
  @Input() allowchildcheckbox:any = false
  @Input() allowchildren:any = true
  @Output() valuechanged = new EventEmitter<any>()
  @Output() childclicked = new EventEmitter<any>()

  @Input() recursionCount: number;
  @Input() generationStatus: string;
  generation: any;
  display:any = false
  names: any = [];
  items:any = [];

  countUp:any

  percentage: any
  

  hideChildren() {
    // this.structure.showchildren = false

  }

  ngOnInit() {
     this.hideChildren();
  }

  ngAfterContentInit(): void {
    this.GetCurrentNames()
    this.GetItems()
  }

  

  ngOnChanges(changes: SimpleChanges): void {
    this.GetCurrentNames()
    this.GetItems();

    if (this.recursionCount == undefined)
      {
      this.countUp = 0;
      this.percentage = this.countUp;
  }
      else {
      this.countUp = ++this.recursionCount;
      this.percentage = this.countUp * 5;
    }
  }

  GetCurrentNames()
  {
    this.names = []

    for(var item in this.structure)
    {
      if(item != 'items' && item != "showchildren")
        this.names.push(item)
    }
  }

 
  GetItems()
  {


    this.items = []

    for(var item in this.structure.items)
    {
      if(item != 'items')
        this.items.push(item)
    }
  }

  ChildClicked(item)
  {

    this.childclicked.emit(item)
  }

  ValueChanged()
  {
    this.valuechanged.emit()
  }
}
