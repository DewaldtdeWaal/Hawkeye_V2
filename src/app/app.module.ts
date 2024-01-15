import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {HeaderComponent} from 'src/app/header/header.component'
import { AppComponent } from './app.component';
import { ContainerComponent } from './Pages/dynamic-site-page/Sub Components/container/container.component';
import { BooleanScanComponent } from './Pages/dynamic-site-page/Sub Components/boolean-scan/boolean-scan.component';
import { RealScanComponent } from './Pages/dynamic-site-page/Sub Components/real-scan/real-scan.component';
import { LevelDisplayComponent } from './Pages/dynamic-site-page/Sub Components/level-display/level-display.component';
import { StringScanComponent } from './Pages/dynamic-site-page/Sub Components/string-scan/string-scan.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MainPageComponent } from './Pages/main-page/main-page.component'
import { DynamicSitePageComponent } from './Pages/dynamic-site-page/dynamic-site-page.component';
import { AppRoutingModule } from './app-routing.component';
import { DeveloperPageComponent } from './Pages/developer-page/developer-page.component';
import { CreationPageComponent } from './Pages/creation-page/creation-page.component';
import { CreationPageRootEditorComponent } from './Pages/creation-page/creation-page-root-editor/creation-page-root-editor.component';
import { CreationPageContainerEditorComponent } from './Pages/creation-page/creation-page-container-editor/creation-page-container-editor.component';
import { BooleanScanCreationComponent } from './Creation Components/boolean-scan-creation/boolean-scan-creation.component';
import { StringScanCreationComponent } from './Creation Components/string-scan-creation/string-scan-creation.component';
import { LevelDisplayCreationComponent } from './Creation Components/level-display-creation/level-display-creation.component';
import { RealScanCreationComponent } from './Creation Components/real-scan-creation/real-scan-creation.component';
import { BoreholePumpComponent } from './Pages/dynamic-site-page/Sub Components/borehole-pump/borehole-pump.component';
import { BoreholePumpCreationComponent } from './Creation Components/borehole-pump-creation/borehole-pump-creation.component';
import { DriverCreationComponent } from './Pages/driver-creation/driver-creation.component';
import { ListBoxComponent } from './Controls/list-box/list-box.component';
import { DropDownComponent } from './Controls/drop-down/drop-down.component';
import { TagEditorComponent } from './Pages/driver-creation/tag-editor/tag-editor.component';
import { NewDropDownComponent } from './Controls/new-drop-down/new-drop-down.component';
import { ReservoirComponent } from './Pages/dynamic-site-page/Sub Components/reservoir/reservoir.component';
import { TemplateFormComponent } from './Examples/template-form/template-form.component';
import { ReactiveFormComponent } from './Examples/reactive-form/reactive-form.component';
//import { LoginComponent } from './Pages/login/Old_Login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { AppMainComponent } from './app-main/app-main.component';
import { LoginPageComponent } from './Pages/login/login-page/login-page.component';
import { UserAuthenticationService } from './user-authentication.service';
import { RouteGuard } from './route-guard.service';
import { HeaderInterceptor } from './header-interceptor';
import { SiteStorageService } from './site-storage.service';
import {  NgxEchartsModule, provideEcharts } from 'ngx-echarts';
import { ChartComponent } from './Pages/dynamic-site-page/Sub Components/chart/chart.component';
import { ChartCreationComponent } from './Creation Components/chart-creation/chart-creation.component';
import { ReservoirCreationComponent } from './Creation Components/reservoir-creation/reservoir-creation.component';
import { PageAssignerComponent } from './Pages/page-assigner/page-assigner.component';
import { EmbeddedDropDownComponent } from './Controls/embedded-drop-down/embedded-drop-down.component';
import { UserManagementComponent } from './Pages/user-management/user-management.component';
import { CommunicationService } from './communication.service';
import { DropDownDirective } from './Controls/dropdown.directive';
import { SvgDrawingComponent } from './Pages/svg-drawing/svg-drawing.component';
import { UserSettingsComponent } from './Pages/user-settings/user-settings.component';
import { HeirarchyEditor } from './heirarchy-editor.service';
import { MarshalComponent } from './Pages/dynamic-site-page/Sub Components/marshal/marshal.component';
import { MarshalCreationComponent } from './Creation Components/marshal-creation/marshal-creation.component';
import { StringlistComponent } from './Pages/dynamic-site-page/Sub Components/stringlist/stringlist.component';
import { StringlistCreationComponent } from './Creation Components/stringlist-creation/stringlist-creation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    BooleanScanComponent,
    RealScanComponent,
    LevelDisplayComponent,
    StringScanComponent,
    DynamicSitePageComponent,
    MainPageComponent,
    DeveloperPageComponent,
    CreationPageComponent,
    CreationPageRootEditorComponent,
    CreationPageContainerEditorComponent,
    BooleanScanCreationComponent,
    StringScanCreationComponent,
    LevelDisplayCreationComponent,
    RealScanCreationComponent,
    BoreholePumpComponent,
    BoreholePumpCreationComponent,
    DriverCreationComponent,
    ListBoxComponent,
    DropDownComponent,
    TagEditorComponent,
    NewDropDownComponent,
    ReservoirComponent,
    TemplateFormComponent,
    ReactiveFormComponent,
   // LoginComponent,
    SignupComponent,
    AppMainComponent,
    LoginPageComponent,
    ChartComponent,
    ChartCreationComponent,
    ReservoirCreationComponent,
    PageAssignerComponent,
    EmbeddedDropDownComponent,
    UserManagementComponent,
    DropDownDirective,
    SvgDrawingComponent,
    UserSettingsComponent,
    MarshalComponent,
    MarshalCreationComponent,
    StringlistComponent,
    StringlistCreationComponent,
    HeaderComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [UserAuthenticationService, HeirarchyEditor,CommunicationService, RouteGuard, SiteStorageService,{provide: HTTP_INTERCEPTORS,useClass: HeaderInterceptor, multi:true},provideEcharts()],
  bootstrap: [AppComponent]
})
export class AppModule { }
