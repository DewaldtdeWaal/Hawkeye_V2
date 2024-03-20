import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {  EChartsOption, registerPostUpdate } from 'echarts';
import { CommunicationService } from 'src/app/communication.service';
import {ThemeService} from "src/app/Service-Files/theme.service"
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges,AfterContentInit {
  @Input() theme:any = 'white'
  @Input() structure:any = null
  @Output() setparentwidth = new EventEmitter<any>()

  disableChart:any = false;

    endtime:any = new Date()
  starttime: any = new Date(this.endtime.getTime() - (60 * 60 * 24 * 7 * 1000));


  trendYaxis:any = [];
  
  constructor(private http:HttpClient, private commservice:CommunicationService, private ts : ThemeService ){}
  
  ngAfterContentInit(): void {
    this.setparentwidth.emit("100%");
    this.Trend();
  }

  ngOnChanges()
  {
    this.trendYaxis = [];
    if(this.structure)
    {
      this.HandleYAxis()
      this.options.yAxis = this.trendYaxis
      this.options.series = this.structure.components[0].trendinformation;
    }
  }
  
  HandleYAxis()
  {
    this.AddYAxisItem(this.structure.yleftaxisname)

    if(this.structure.yrightaxisname)
    {
      this.AddYAxisItem(this.structure.yrightaxisname)
    }
    this.AddYAxisDefaultInformation()
  }

  AddYAxisItem(name)
  {
    var currentItem:any = {}
    this.trendYaxis.push(currentItem)

    if(!name)
    {
      name = ''
    }

    currentItem.name = name
    currentItem.nameTextStyle = { color: this.ts.theme},
    currentItem.type = 'value',
    currentItem.axisLabel = {formatter:'{value}', color:this.ts.theme}
  }

  AddYAxisDefaultInformation()
  {
    var currentItem:any = {
                            axisLabel: {color: this.ts.theme},
                            type: 'value',
                            boundaryGap: [0, 0.05],
                          }
    this.trendYaxis.push(currentItem)
  }

  GetMidnightTime(time)
  {
    var timemodifier = new Date(time).getTime()
    var tempDate = new Date(timemodifier)

    timemodifier = timemodifier - ((tempDate.getHours() * 60 * 60 * 1000) + (tempDate.getMinutes() * 60 * 1000) + (tempDate.getSeconds()* 1000))

    timemodifier /= 1000;
    timemodifier = Math.trunc(timemodifier);
    timemodifier *= 1000;

    return (new Date(timemodifier));
  }

  Trend()
  {

  
    this.disableChart = false 

    var sites = {} // []

    for(var item of this.structure.components[0].trendinformation)
    {
      if(sites[item.sitename] == undefined)
      {
        sites[item.sitename] = {};

        sites[item.sitename].tags = {};
      }

      sites[item.sitename].tags[item.tagname] = {};
      sites[item.sitename].tags[item.tagname].filterscript = item.filterscript;
      sites[item.sitename].tags[item.tagname].result = [];
    }

    var requestedendtime = new Date(this.GetMidnightTime(this.endtime).getTime() + (23*60*60*1000))
    var requestedstarttime = this.GetMidnightTime(this.starttime)

    this.http.post<any>( "http://" + this.commservice.ipaddressorhostname + ":3004/api/posts",{requesttype:"trend",sites,start:requestedstarttime,end:requestedendtime}).subscribe((res) =>
    {
        for(var item of this.structure.components[0].trendinformation)
        {
          for(var respitem in res)
          {
            if(item.sitename == respitem)
            {
              for(var tagname in res[respitem].tags)
              {
                if(tagname == item.tagname)
                {
                  item.data = res[respitem].tags[tagname].result
                  break;
                }
              }
              break;
            }
          }
        }
      this.disableChart = false;
      }
    )
  }

  options: EChartsOption = 
  { 
    grid: 
    {
      containLabel: true
    },
    toolbox:
    {
      feature: 
      {
        feature: 
        {
          saveAsImage: {}
        }
      }
    },
    dataZoom:
    [
      {
        type: 'slider',
        start: 0,
        end: 100,
        handleSize: 8
      },
      { 
        start: 0,
        end:100
      }
    ],
    
    tooltip: {
      extraCssText: "background-color: var(--form-background-color);",
      textStyle:{color:"var(--res-level-text-color)"},
      trigger: 'axis',
      position: ['10%', '10%'],
      axisPointer:{type:'cross'}
    },      
    legend:
    {
      top:'auto',
      type: 'scroll',
      textStyle: {color:"var(--res-level-text-color)" },
      },
      xAxis: [
        {
          type: 'time',
          splitLine: { show: true },
          axisLabel:{ color : ThemeService.getTheme() }
    },
      ],
   yAxis: [
        {
       type: 'value',
      axisLabel: { color: 'white' }
        }
    ],
    series: 
    [
      {
        name:'unknown',
        type:'line',
        data:[['2023/10/26',1],['2023/10/27',2]]
      }
    ]
    }
}
