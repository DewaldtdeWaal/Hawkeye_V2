import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainPageComponent } from "./Pages/main-page/main-page.component";
import { DynamicSitePageComponent } from "./Pages/dynamic-site-page/dynamic-site-page.component";

import { AppMainComponent } from "./app-main/app-main.component";
import { LoginPageComponent } from "./Pages/login/login-page/login-page.component";
import { RouteGuard } from "./route-guard.service";

const routes: Routes = [
    {path: 'Login', component: LoginPageComponent},
    {path: 'App', canActivate: [RouteGuard], component: AppMainComponent },
    {path: '**', redirectTo:'Login'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule
{

}

