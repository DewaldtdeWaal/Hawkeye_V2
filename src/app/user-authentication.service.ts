import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { SiteStorageService } from "./site-storage.service";
import { CommunicationService } from "./communication.service";

@Injectable()
export class UserAuthenticationService implements OnDestroy
{
    private loggedIn = false;
    private usertoken:any = null;
    private authListener = new Subject<boolean>()
    private timer:any = null
    email:any = ""

    constructor(private httpClient: HttpClient, private router:Router, private siteStorage:SiteStorageService, private commservice:CommunicationService)
    {
        this.autologin()
    }

    getToken()
    {
        return this.usertoken;
    }

    getAuthListener()
    {
        return this.authListener.asObservable();
    }

    isAuthenticated() {

        if(!this.loggedIn || this.usertoken == null)
        {
            this.autologin()
        }
        


        if(this.usertoken != null && this.loggedIn)
            return this.loggedIn;
        return false;
    }

    login(email, password, navigate){
        var message = {requesttype: "user login", userdata:{email: email, password: password}}
        this.httpClient.post<any>(this.commservice.loginHostName, message).subscribe((resp) =>
        {
           console.log(resp)
            if(resp.token)
            {
                var now = new Date()
                var expDate = new Date( now.getTime() + resp.validperiod )
                this.saveAuthData(resp.token,expDate,email)
                this.setLogin(resp.token, resp.validperiod,email)
                this.router.navigate([navigate])
                this.siteStorage.setStructure(resp.userdata)

                var theme = resp.displaymode

                localStorage.setItem("theme", theme)
            }
        })
    }

    logout(){
        console.log("Log Out!")
        this.clearAuthData()
        this.usertoken = null;
        this.loggedIn = false;
        this.authListener.next(this.loggedIn)
        this.ClearTimer()
    }

    setLogin(token, duration, email)
    {
        this.loggedIn = true
        this.usertoken = token
        this.email = email
        this.SetTimer(duration)
        this.authListener.next(this.loggedIn)
    }

    ngOnDestroy(): void {
        console.log("destroy authservice")
        this.ClearTimer()
    }

    private SetTimer(duration)
    {
        this.ClearTimer()
        this.timer = setTimeout(()=>{
            this.logout()
            },duration)
    }

    private ClearTimer()
    {
        if(this.timer != null)
        {
            clearTimeout(this.timer)
        }
    }

    private saveAuthData(token:string, expirationDate:Date,email:any)
    {
        localStorage.setItem('token',token)
        localStorage.setItem('expirationDate',expirationDate.toISOString())
        localStorage.setItem('email',email)
    }

    private clearAuthData()
    {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('email')
        localStorage.removeItem("theme")
    }

    private getAuthData()
    {
        const token:string = localStorage.getItem('token')
        const date:Date = new Date(localStorage.getItem('expirationDate'))
        const email:any = localStorage.getItem('email')

        if(token != null && token != "null" && date != null && email )
        {
            return {token:token,expirationDate:date,email:email}
        }
        return null;
    }

    private autologin()
    {
        const lsd = this.getAuthData()
        if(lsd != null)
        {
            const date = new Date()
            const expiresin = lsd.expirationDate.getTime() - date.getTime()
            if(expiresin > 0)
            {
                this.setLogin(lsd.token,expiresin,lsd.email)
                this.router.navigate(["/App"])
            }

        }
    }
}