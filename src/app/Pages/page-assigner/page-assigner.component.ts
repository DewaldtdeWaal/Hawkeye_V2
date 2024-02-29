import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { CommunicationService } from 'src/app/communication.service';
import { HeirarchyEditor } from 'src/app/heirarchy-editor.service';
import { UserAuthenticationService } from 'src/app/user-authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, startWith,map } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

interface siteElement {
  Site: string;
  Customer: string;
  Position: number
  selected:boolean
}

@Component({
  selector: 'app-page-assigner',
  templateUrl: './page-assigner.component.html',
  styleUrls: ['./page-assigner.component.css']
})
  
export class PageAssignerComponent implements AfterContentInit {

  @Input() customers: any = [];
  @Input() pages: any = null;
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
  options:string[]=[]
  filteredOptions: Observable<string[]>;
  selectedValue: any
    
 ngOnInit() {
  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value || ''))
  );

  }
  
onOptionSelected(event: any): void {
  console.log(event)
  // Additional actions with the selected value can be done here
  }
  


trackFn(index, item) {

  console.log("this.currentEmailSelected")

  this.currentEmailSelected = item;
  
  console.log(this.currentEmailSelected)
  console.log("this.currentEmailSelected")
}



  constructor(private heirarchyeditor: HeirarchyEditor, private http: HttpClient, private userauth: UserAuthenticationService, private commservice: CommunicationService ) {
  }

  private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterContentInit(): void {
    this.GetUserData();

    this.SetStructure();

    this.displayheir = this.heir;
  }

  displayedColumns: string[] = ['select','email',];
  SITE_DATA: siteElement[] = [];
  dataSource: any;
  siteDataSource: MatTableDataSource<any> = new MatTableDataSource();
  siteSelection = new SelectionModel<any>(true, []);
  filterValue: any = "";

  
  email : string;


  displaySiteName = ['select', 'Site', 'Customer']
  

  currentEmailSelected: string;
   GetUserData()
  {
    const message = { requesttype: "get page assignments", customers: this.customers };
    this.http.post<any>(this.commservice.postHostName,message).subscribe((res) => 
    {

      this.pageassignments = res

      for (let i = 0; i < this.pageassignments.length; i++) {
       this.options[i] = this.pageassignments[i].email  
      }
    })
  }


  displayTableBasedOnDropDown($event: any) {
   
    console.log(this.currentEmailSelected)

  let index = 0;
  let userPages:number[] = [];
  for (let i = 0; i < this.pageassignments.length; i++){
    if(this.currentEmailSelected == this.pageassignments[i].email){
      userPages = this.pageassignments[i].pages[$event];
    }
   }
   
   console.log(userPages)

  if ($event === undefined) {
    for (let i = 0; i < this.pages.length; i++) {
      this.SITE_DATA[i] = {
        Site: this.pages[i].pageName,
        Customer: this.pages[i].customer,
        Position: this.pages[i].id,
        selected: false,
      };
    }
  }
  else {
      for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i].customer == $event) {
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

  this.siteDataSource.data = this.SITE_DATA;
  this.siteDataSource.sort = this.sort;
  this.siteDataSource.filter = this.filterValue.trim().toLowerCase();
  this.SITE_DATA = [];
  userPages = [];
}

  
  
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


      public countries = [
    {
      id: 1,
      name: 'Albania',
    },
    {
      id: 2,
      name: 'Belgium',
    },
    {
      id: 3,
      name: 'Denmark',
    },
    {
      id: 4,
      name: 'Montenegro',
    },
    {
      id: 5,
      name: 'Turkey',
    },
    {
      id: 6,
      name: 'Ukraine',
    },
    {
      id: 7,
      name: 'Macedonia',
    },
    {
      id: 8,
      name: 'Slovenia',
    },
    {
      id: 9,
      name: 'Georgia',
    },
    {
      id: 10,
      name: 'India',
    },
    {
      id: 11,
      name: 'Russia',
    },
    {
      id: 12,
      name: 'Switzerland',
    }
  ];
}
