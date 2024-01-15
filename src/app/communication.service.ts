export class CommunicationService
{

    
    public num:any = 0;
    public ipaddressorhostname:string;
    public loginHostName:string;
    public postHostName: string;
    
    constructor(){
        if(this.num == 0){
        this.ipaddressorhostname = "http://155.93.192.206:3004/api/";
        }
        else {
            this.ipaddressorhostname='http://localhost:3004/api/';
        }
    

        this.loginHostName = this.ipaddressorhostname + "login";

        this.postHostName = this.ipaddressorhostname+"posts";
}


 
    postDataToBackend() {
        
    }
}