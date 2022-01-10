import { NgModule } from "@angular/core";
import {
  NbMenuModule,
  NbPopoverModule,
  NbTimepickerModule,
  NbWindowModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";

import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { FacesService } from "../services/faces.service";
import { AnnotationsService } from "../services/annotations.service";
import { ColorsService } from "../services/colors";
import { StrService } from "../services/strArray";
import { FaceFormComponent } from "./facial_recognition/face-form/face-form.component";
import { FaceListComponent } from "./facial_recognition/face-list/face-list.component";
import { ImagesFormComponent } from "./facial_recognition/images-form/images-form.component";
import { TrustedUrlPipe } from "../pipes/trusted-url.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { UrlPipe } from "../pipes/url.pipe";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { ScheduleComponent } from "./facial_recognition/schedule/schedule.component";
import { SettingsComponent } from "./settings/settings.component";
import { LiveComponent } from "./cameras_conf/livestream/live.component";
import { VidComponent } from "./cameras_conf/add_camera/vid.component";
import { LivestreamComponent } from "./cameras_conf/camera_list/livestream.component";
import { ROIComponent } from "./cameras_conf/roi/roi.component";
import { AlgorithmsComponent } from "./cameras_conf/algorithms/algorithms.component";
import { TrustedStylePipe } from "../pipes/trusted-style.pipe";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { SearchComponent } from "./facial_recognition/search/search.component";
import { FormsModule as ngFormsModule } from "@angular/forms";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbAccordionModule,
  NbButtonModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule,
  NbUserModule,
  NbActionsModule,
  NbCheckboxModule,
  NbRadioModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbSelectModule,
  NbSpinnerModule,
  NbContextMenuModule,
} from "@nebular/theme";

// import { TableComponent } from './facial_recognition/table/table.component';
import { HeatmapComponent } from "./cameras_conf/heatmap/heatmap.component";

import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { GridComponent } from "./cameras_conf/grid/grid.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { LogInComponent } from "./online/log-in/log-in.component";
import { DashboardComponent } from "./online/dashboard/dashboard.component";
import { AdminComponent } from "./online/admin/admin.component";
import { SetUpComponent } from "./online/set-up/set-up.component";
import { ChangePassComponent } from "./online/change-pass/change-pass.component";
import { authInterceptorProviders } from "../_helpers/auth.interceptor";
import { ButtonComponent } from "./online/button/button.component";
import { TicketComponent } from "./online/ticket/ticket.component";
import { StatusComponent } from "./online/status/status.component";
import { SeverityComponent } from "./online/severity/severity.component";
import { ReviewComponent } from "./online/review/review.component";
import { CenterComponent } from "./online/graphs/center/center.component";
import { PcComponent } from "./online/graphs/pc/pc.component";
import { LoitComponent } from "./online/graphs/loit/loit.component";
import { ChartModule } from "angular2-chartjs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ControlComponent } from "./online/graphs/control/control.component";
import { IntrComponent } from "./online/graphs/intr/intr.component";
import { NgxEchartsModule } from "ngx-echarts";
import { ViolComponent } from "./online/graphs/viol/viol.component";
import { VideoComponent } from "./online/graphs/video/video.component";
import { AodComponent } from "./online/graphs/aod/aod.component";
import { CFaceComponent } from "./online/graphs/c-face/c-face.component";
import { SocialComponent } from "./online/graphs/social/social.component";
import { QueueComponent } from "./online/graphs/queue/queue.component";
import { HelmComponent } from "./online/graphs/helm/helm.component";
import { VaultComponent } from "./online/graphs/vault/vault.component";
import { ParkingComponent } from "./online/graphs/parking/parking.component";
import { AnprComponent } from "./online/graphs/anpr/anpr.component";
import { BarrierComponent } from "./online/graphs/barrier/barrier.component";
import { VehicleComponent } from "./online/graphs/vehicle/vehicle.component";
import { DashComponent } from "./online/graphs/dash/dash.component";
import { TamperComponent } from "./online/graphs/tamper/tamper.component";
import { AnimalsOnRoadComponent } from "./online/graphs/animals-on-road/animals-on-road.component";
import { AccidentComponent } from "./online/graphs/accident/accident.component";
import { AxleComponent } from "./online/graphs/axle/axle.component";
import { CarmakeComponent } from "./online/graphs/carmake/carmake.component";
import { IllegalParkingComponent } from "./online/graphs/illegal-parking/illegal-parking.component";
import { VehicleCountComponent } from "./online/graphs/vehicle-count/vehicle-count.component";
import { WrongTurnComponent } from "./online/graphs/wrong-turn/wrong-turn.component";
import { SpeedingComponent } from "./online/graphs/speeding/speeding.component";
import { FrComponent } from "./online/graphs/fr/fr.component";
import { ClothComponent } from "./online/graphs/cloth/cloth.component";
import { PcCameraComponent } from "./online/graphs/pc-camera/pc-camera.component";
import { BrandCarComponent } from "./online/graphs/brand-car/brand-car.component";
import { GoogleLoginProvider, SocialLoginModule } from "angularx-social-login";
import { MsalModule } from "@azure/msal-angular";
import { PublicClientApplication } from "@azure/msal-browser";
import { Heatmap1Component } from "./online/graphs/heatmap/heatmap.component";
import { PathComponent } from "./online/graphs/path/path.component";
import { FireComponent } from "./online/graphs/fire/fire.component";
import { CollapseComponent } from "./online/graphs/collapse/collapse.component";
import { GenerateHelpDeskTicketComponent } from "./helpdesk/generate-helpdesk-ticket/generate-helpdesk-ticket.component";
import { HelpdeskTicketListingComponent } from "./helpdesk/helpdesk-ticket -listing/helpdesk-ticket-listing.component";
import { HelpdeskReplyComponent } from "./helpdesk/helpdesk-reply/helpdesk-reply.component";
import { HelpdeskDetailsComponent } from "./helpdesk/helpdesk-details/helpdesk-details.component";
import { AddIncidentComponent } from "./search/add-incident/add-incident.component";
import { MemoComponent } from "./search/memo/memo.component";

@NgModule({
  imports: [
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbSelectModule,
    ngFormsModule,
    NbAccordionModule,
    NbButtonModule,
    NbListModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbFormFieldModule,
    NbTabsetModule,
    NbUserModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    NbPopoverModule,
    SocialLoginModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "e1486010-fe9f-499f-92c3-c813ea490cb8", // This is your client ID
          authority: "https://login.microsoftonline.com" + "/" + "common",
          redirectUri: "http://localhost:4200", // This is your redirect URI
        },
        cache: {
          cacheLocation: "localStorage",
        },
      }),
      null,
      null
    ),
  ],
  declarations: [
    PagesComponent,
    FaceFormComponent,
    ImagesFormComponent,
    TrustedUrlPipe,
    UrlPipe,
    PagenotfoundComponent,
    FaceListComponent,
    ScheduleComponent,
    SettingsComponent,
    LiveComponent,
    VidComponent,
    LivestreamComponent,
    ROIComponent,
    AlgorithmsComponent,
    TrustedStylePipe,
    AnalyticsComponent,
    SearchComponent,
    // TableComponent,
    GridComponent,
    // OverallComponent,
    HeatmapComponent,
    LogInComponent,
    DashboardComponent,
    AdminComponent,
    SetUpComponent,
    ChangePassComponent,
    ButtonComponent,
    TicketComponent,
    StatusComponent,
    SeverityComponent,
    ReviewComponent,
    CenterComponent,
    PcComponent,
    LoitComponent,
    ControlComponent,
    IntrComponent,
    ViolComponent,
    VideoComponent,
    AodComponent,
    CFaceComponent,
    SocialComponent,
    QueueComponent,
    HelmComponent,
    VaultComponent,
    ParkingComponent,
    AnprComponent,
    BarrierComponent,
    VehicleComponent,
    DashComponent,
    TamperComponent,
    AnimalsOnRoadComponent,
    AccidentComponent,
    AxleComponent,
    CarmakeComponent,
    IllegalParkingComponent,
    VehicleCountComponent,
    WrongTurnComponent,
    SpeedingComponent,
    FrComponent,
    ClothComponent,
    PcCameraComponent,
    BrandCarComponent,
    Heatmap1Component,
    PathComponent,
    FireComponent,
    CollapseComponent,
    GenerateHelpDeskTicketComponent,
    HelpdeskTicketListingComponent,
    HelpdeskReplyComponent,
    HelpdeskDetailsComponent,
    AddIncidentComponent,
    MemoComponent,
  ],
  providers: [
    FacesService,
    DatePipe,
    ColorsService,
    StrService,
    AnnotationsService,
    authInterceptorProviders,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "177947832755-0kqanmd36fjt3v3lbr7nqs1aghevs56e.apps.googleusercontent.com"
            ), // your client id
          },
        ],
      },
    },
  ],
})
export class PagesModule {}
