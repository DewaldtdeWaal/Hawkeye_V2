import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { CommunicationService } from 'src/app/communication.service';
import { HeirarchyEditor } from 'src/app/heirarchy-editor.service';
import { UserAuthenticationService } from 'src/app/user-authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith,map, of } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { SiteStorageService } from 'src/app/site-storage.service';
interface siteElement {
  Site: string;
  Customer: string;
  Position: number
  selected:boolean
}

interface option{
  name: any;
  id:number
}

interface heirarchicalDropDown{
  siteName: string;
  children ?: heirarchicalDropDown[];
  siteValue ?: string;
}

@Component({
  selector: 'app-page-assigner',
  templateUrl: './page-assigner.component.html',
  styleUrls: ['./page-assigner.component.css']
})
  
export class PageAssignerComponent implements AfterContentInit {


  @Input() customers: any = [];
  @Input() pages: any = null;

  //heir
  heir: any = {};
  displayheir: any = {};
  pageassignments:any = null
  currentuser: any = "";
  disableuserchange:any = false
  saveable:any = false
   @ViewChild(MatSort) sort: MatSort;

  clickedRows = new Set<siteElement>();
  adminArray: string[] = ["Test", "NMBM", "Beyers Naude"];
  arrayControl = new FormControl(this.adminArray);
  selectedSitesNumber: number[] = [];
  myControl = new FormControl('')
  options:option[]=[]
  filteredOptions: Observable<string[]>;
  selectedValue: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
    
  ngOnInit() {

  }
  
  onOptionSelected(event: any): void {
  
}
  

  changeSelectedValue(newValue: any) {
    this.arrayControl = newValue;
}

trackFn(index, item) {

  this.currentEmailSelected = item;
  

}


  constructor(private heirarchyeditor: HeirarchyEditor, private http: HttpClient, private userauth: UserAuthenticationService, private commservice: CommunicationService,private siteStorage:SiteStorageService ) {
  }



  ngAfterContentInit(): void {
    this.GetUserData();

    this.SetStructure();

    
    

  
  }


  SITE_DATA: siteElement[] = [];
  dataSource: any;
  siteDataSource: MatTableDataSource<any> = new MatTableDataSource();
  siteSelection = new SelectionModel<any>(true, []);
  filterValue: any = "";

  
  email : string;


  displaySiteName = ['select', 'Site', 'Customer']
  

  currentEmailSelected: string;


    


  dropDownPage: any;

  pageheirarchy: any;
    userdata:any = {}

   GetUserData()
   {
     
     this.userdata = this.siteStorage.getStructure()
    
     
    const message = { requesttype: "get page assignments", customers: this.customers };
    this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
    {

      this.pageassignments = res

     

      for (let i = 0; i < this.pageassignments.length; i++) {
        this.options[i] = {
          name: this.pageassignments[i].email,
          id:i+1
        }
      }
      this.sortEmail();
    })
     
     const secondMessage = { requesttype: "user data", user: this.userauth.email }
     
     this.http.post<any>(this.commservice.postHostName, secondMessage).subscribe((res) => {
         
       this.dropDownPage = res

       this.pageheirarchy = this.heirarchyeditor.GetStructure(this.dropDownPage.userdata.pages);
       
      // console.log(this.dropDownPage.userdata.pages)
      let groupBy = this.groupByCustomer(this.dropDownPage.userdata.pages)

       const groupedByHierarchy = this.loopThroug(groupBy);
       
       console.log(groupedByHierarchy)
    
     })
    
  }


  loopThroug(data: any) {
    for (let property in data) {
      data[property] = this.groupByHierarchy(Object.values(data[property]))
    }
    return data  
  }

 groupByHierarchy(data: any[]): Record<string, any[]> {
    const groupBy = (array: any[], prop: string): Record<string, any[]> => {
        return array.reduce((groups: Record<string, any>, item: any) => {
            let currentGroup = groups;
            const keys = item[prop];
            keys.forEach((key: string) => {
                currentGroup[key] = currentGroup[key] || {};
                currentGroup = currentGroup[key];
            });
            (currentGroup['items'] = currentGroup['items'] || []).push(item);
            return groups;
        }, {});
    };
    return groupBy(data, 'pageheirarchy');
}




  
  




 groupByCustomer(array) {
  return array.reduce((groups, item) => {
    const customer = item.customer;
    if (!groups[customer]) {
      groups[customer] = [];
    }
    groups[customer].push(item);
    return groups;
  }, {});
}


  
 
  onAddAllCheckboxChange(row:siteElement){
    
  }

  onCheckboxChange(row: siteElement) {
    this.addOrRemoveSite(row.Position);
  }

  dropDownValue: any;
  displayTableBasedOnDropDown($event: any) {




    this.dropDownValue = $event;
  this.renderTable()
  }

addOrRemoveSite(row: any) {
  let addOrNot = false;
  for (let i = 0; i < this.pageassignments.length; i++) {
    if (this.pageassignments[i].email == this.currentEmailSelected) {
      let myArray = this.pageassignments[i].pages[this.dropDownValue];

      if (myArray) {
        for (let j = 0; j < myArray.length; j++) {
          if (row == myArray[j]) {
            addOrNot = true;
            myArray.splice(j, 1);
            break; 
          }
        }

        if (!addOrNot) {
          myArray.push(row);
        }

        this.pageassignments[i].pages[this.dropDownValue] = myArray;
      } else {
        this.pageassignments[i].pages[this.dropDownValue] = [row];
      }

      break; 
    }
  }
}

  renderTable() {
  let index = 0;
    let userPages: any[] = [];
    


  for (let i = 0; i < this.pageassignments.length; i++){
    if (this.currentEmailSelected == this.pageassignments[i].email) {

      if (this.pageassignments[i].pages[this.dropDownValue] == undefined) {
        userPages = [];
      }
      else {
        userPages = this.pageassignments[i].pages[this.dropDownValue];
      }
    }
   }
   
    if (this.dropDownValue === undefined || userPages == undefined) {
      this.SITE_DATA = null;
  }
  else
  {
      for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i].customer == this.dropDownValue) {
        if (userPages.includes(this.pages[i].id)) {
          this.SITE_DATA[index] = {
          Site: this.pages[i].pageName,
          Customer: this.pages[i].customer,
          Position: this.pages[i].id,
          selected: true,
          };
        }
        else
        {
          this.SITE_DATA[index] = {
          Site: this.pages[i].pageName,
          Customer: this.pages[i].customer,
          Position: this.pages[i].id,
          selected: false,
          };
        }
             
        index++;
      }
    }
    }
    
    this.sortSite()

  this.siteDataSource.data = this.SITE_DATA;
  this.siteDataSource.sort = this.sort;
    this.siteDataSource.filter = this.filterValue.trim().toLowerCase();
    this.siteDataSource.paginator = this.paginator;
  this.SITE_DATA = [];
  userPages = [];
  }

  sortEmail() {
    this.options.sort((a, b) => {
  // Convert both 'Site' properties to lowercase for case-insensitive sorting
  const siteA = a.name.toLowerCase();
  const siteB = b.name.toLowerCase();

  // Compare the 'Site' properties
  if (siteA < siteB) {
    return -1;
  }
  if (siteA > siteB) {
    return 1;
  }
  // 'Site' properties are equal
  return 0;
});
  }

  sortSite() {
    // Assuming SITE_DATA is an array of objects with 'Site' property
    if(this.SITE_DATA != null){
this.SITE_DATA.sort((a, b) => {
  // Convert both 'Site' properties to lowercase for case-insensitive sorting
  const siteA = a.Site.toLowerCase();
  const siteB = b.Site.toLowerCase();

  // Compare the 'Site' properties
  if (siteA < siteB) {
    return -1;
  }
  if (siteA > siteB) {
    return 1;
  }
  // 'Site' properties are equal
  return 0;
});
}
  }
  
     menuItems$ = ([
    {
      title: 'Test',
      children: [
        {
          title: 'Test1',
          children: [
            {
              title: 'Test1.1',
              children: [
                {
                  title: 'Test1.1.1',
                  route: '/',
                },
                {
                  title: 'Test1.1.2',
                  route: '/',
                },
              ],
            },
            {
              title: 'Test1.2',
              route: '/',
            },
          ],
        },
        {
          title: 'Test2',
          children: [
            {
              title: 'Test2.1',
              route: '/',
            },
          ],
        },
        {
          title: 'Test3',
          route: '/',
        },
      ],
    },
  ]);
  
  SetStructure()
  {
    this.heir = this.heirarchyeditor.GetStructure(this.pages);



   
  }
 

  HeirarchyValueChanged()
  {
    if(this.currentuser != "")
    {
      this.disableuserchange = true;
      this.saveable = false;
    }
  }

applyFilter(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value;
 this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  

applyFilter2(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value;
 this.siteDataSource.filter = this.filterValue.trim().toLowerCase();
  }




      selectEvent(item) {
        this.renderTable();

        this.currentEmailSelected = item.name;


        this.changeSelectedValue(null);

        this.siteDataSource.data = [];
        this.siteDataSource.sort = this.sort;
        this.siteDataSource.filter = this.filterValue.trim().toLowerCase();
        this.siteDataSource.paginator = this.paginator;
  }

  onChangeSearch(search: string) {

  }

  onFocused(e) {
  }

}
