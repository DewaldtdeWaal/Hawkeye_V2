import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {CommunicationService} from "src/app/communication.service"
 interface themePost{
    theme: string;
    email: string;
}
    
@Injectable({ providedIn: "root" })

    
   
    
export class Theme{

    constructor(private http: HttpClient, private comms:CommunicationService) { }


    public theme: string;

    async GetTheme(email: string) {
        
        console.log("IIDSFlksadfl;adksfjkl;asdflk;asdjfk;lsdflk;skl;fasd");
        const theme: themePost = {
            email: email, 
            theme:null
        }


        console.log(this.comms.postThemeHostName)
         this.http.post(this.comms.postThemeHostName,theme)
    }

    public setTheme(theme: string) {
        
    }

}