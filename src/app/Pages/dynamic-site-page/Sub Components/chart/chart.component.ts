import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {  EChartsOption, registerPostUpdate } from 'echarts';
import { CommunicationService } from 'src/app/communication.service';

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

  starttime:any
  endtime:any

  trendYaxis:any = [];
  
  constructor(private http:HttpClient, private commservice:CommunicationService)
  {
    
    
  }
  
  ngAfterContentInit(): void {
    this.setparentwidth.emit("100%")
    this.endtime = new Date()
    this.starttime = new Date(this.endtime.getTime() - (60*60*24*7*1000))
    this.Trend()
  }

  ngOnChanges()
  {
    this.trendYaxis = [];
    if(this.structure)
    {
      this.HandleYAxis()
      this.options.yAxis = this.trendYaxis
      this.options.series = this.structure[0].components[0].trendinformation;
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
    currentItem.nameTextStyle = { color: this.theme},
    currentItem.type = 'value',
    currentItem.axisLabel = {formatter:'{value}', color:this.theme}
  }

  AddYAxisDefaultInformation()
  {
    var currentItem:any = {
                            axisLabel: {color: this.theme},
                            type: 'value',
                            boundaryGap: [0, 0.05],
                          }
    this.trendYaxis.push(currentItem)
  }

  GetMidnightTime(time)
  {
    var timemodifier = new Date(time).getTime()
    var tempDate = new Date(timemodifier)

    // timemodifier /= (1000 * 60 * 60 * 24)
    // timemodifier = Math.trunc(timemodifier)

    // var tempDate = new Date(timemodifier)
    // timemodifier *= (1000 * 60 * 60 * 24)

    // timemodifier -= tempDate.getHours() * 60 * 60 * 1000

    timemodifier = timemodifier - ((tempDate.getHours() * 60 * 60 * 1000) + (tempDate.getMinutes() * 60 * 1000) + (tempDate.getSeconds()* 1000))

     timemodifier /= 1000
     timemodifier = Math.trunc(timemodifier)
     timemodifier *= 1000

    return (new Date(timemodifier))
  }

  Trend()
  {

    console.log(this.structure[0].components[0].trendinformation)
    this.disableChart = false //WDNR_ROSE_RES_OUT01

    var sites = {} // []

    for(var item of this.structure[0].components[0].trendinformation)
    {
      if(sites[item.sitename] == undefined)
      {
        sites[item.sitename] = {}// sites.push(item.sitename)

        sites[item.sitename].tags = {}
      }

      sites[item.sitename].tags[item.tagname] = {}
      sites[item.sitename].tags[item.tagname].filterscript = item.filterscript
      sites[item.sitename].tags[item.tagname].result = []
    }

    var requestedendtime = new Date(this.GetMidnightTime(this.endtime).getTime() + (23*60*60*1000))
    var requestedstarttime = this.GetMidnightTime(this.starttime)

    this.http.post<any>( "http://" + this.commservice.ipaddressorhostname + ":3004/api/posts",{requesttype:"trend",sites,start:requestedstarttime,end:requestedendtime}).subscribe((res) =>
    {
      
      console.log(res)
        for(var item of this.structure[0].components[0].trendinformation)
        {
          for(var respitem in res)//var respitem of res)
          {
            if(item.sitename == respitem)
            {
              for(var tagname in res[respitem].tags)
              {
                if(tagname == item.tagname)
                {
                  item.data = res[respitem].tags[tagname].result
                  break
                }
              }
              break
            }
            
            // if(respitem.site == item.sitename)
            // {
            //   item.data = []
            //   var lastvalue:any = undefined
            //   var currentvalue:any = undefined
            //   for(var i = 0; i < respitem.data.length; i++)
            //   {
            //     if(item.ApplyFlowRateCalculations)
            //     {
            //       if(lastvalue != undefined)
            //       {
            //         if(new Date(respitem.data[i].date).getHours() == 0)
            //         {
            //           currentvalue = respitem.data[i][item.tagname]
            //           item.data.push([respitem.data[i].date,currentvalue - lastvalue])
            //           lastvalue = currentvalue
            //         }
            //       }
            //       else
            //       {
            //         if(new Date(respitem.data[i].date).getHours() == 0)
            //         {
            //           lastvalue = respitem.data[i][item.tagname]
            //           //item.data.push([respitem.data[i].date, currentvalue])
            //         }
            //       }
            //     }
            //     else
            //     {
            //       item.data.push([respitem.data[i].date,respitem.data[i][item.tagname]])
            //     }
                
            //   }
            //   break;
            // }
          }
        }
        this.disableChart = false
      }
    )
  }

  /*
  
    {
      yleftaxisname: '',
      yrightaxisname: '',
      trendinformation: 
      [
        {
          name: 'Flow 1',
          data:[['2022-06-27T10:17:00.000+00:00','0'],...],
          type: 'bar',
          yAxisIndex: 1
        },
        {
          ...
        }
      ],
    }

  
  */ 

  options: EChartsOption = 
  { 
    grid: 
    {
      //left: '6%',
      //right: '7%',
      //top:'10%',
      //bottom: '10%',
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
    tooltip: 
    {
      backgroundColor: 'white',
      textStyle:{ color: 'black',},
      axisPointer: {type: 'cross'},
      trigger: 'axis',
      position: ['10%', '10%']
    },      
    legend:
    {
      top:'auto',
      type:'scroll',
      textStyle: {color:this.theme },
    },
    axisPointer:{},
    xAxis: 
    {
      type: 'time'  ,
      axisLabel: {color: this.theme},
      splitLine: {show: true},
    },
    yAxis:
    [
    {
      type:'value'
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
