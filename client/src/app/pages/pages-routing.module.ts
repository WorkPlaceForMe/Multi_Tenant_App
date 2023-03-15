import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";

import { FaceFormComponent } from "./facial_recognition/face-form/face-form.component";
import { ImagesFormComponent } from "./facial_recognition/images-form/images-form.component";
import { ScheduleComponent } from "./facial_recognition/schedule/schedule.component";
import { LiveComponent } from "./cameras_conf/livestream/live.component";
import { FaceListComponent } from "./facial_recognition/face-list/face-list.component";
import { VidComponent } from "./cameras_conf/add_camera/vid.component";
import { ROIComponent } from "./cameras_conf/roi/roi.component";
import { AlgorithmsComponent } from "./cameras_conf/algorithms/algorithms.component";
import { LivestreamComponent } from "./cameras_conf/camera_list/livestream.component";
import { HeatmapComponent } from "./cameras_conf/heatmap/heatmap.component";
import { LogInComponent } from "./online/log-in/log-in.component";
import { SecureInnerPagesGuard } from "../guard/secure-inner-pages.guard";
import { DashboardComponent } from "./online/dashboard/dashboard.component";
import { AuthGuard } from "../guard/auth.guard";
import { AdminComponent } from "./online/admin/admin.component";
import { AdminGuard } from "../guard/admin.guard";
import { SetUpComponent } from "./online/set-up/set-up.component";
import { ChangePassComponent } from "./online/change-pass/change-pass.component";
import { OtherGuard } from "../guard/other.guard";
import { TicketComponent } from "./online/ticket/ticket.component";
import { CenterComponent } from "./online/graphs/center/center.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { GenerateHelpDeskTicketComponent } from "./helpdesk/generate-helpdesk-ticket/generate-helpdesk-ticket.component";
import { HelpdeskTicketListingComponent } from "./helpdesk/helpdesk-ticket -listing/helpdesk-ticket-listing.component";
import { IncidentLogsComponent } from "./search/incident-logs/incident-logs.component";
import { StreamComponent } from "./online/stream/stream.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "sign-in",
        component: LogInComponent,
        canActivate: [SecureInnerPagesGuard],
      },
      {
        path: "accounts/add",
        component: SetUpComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "accounts/edit/:id",
        component: SetUpComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "accounts/changePass/:id",
        component: ChangePassComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "accounts",
        component: AdminComponent,
        canActivate: [AdminGuard],
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "management",
        component: FaceListComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "cameras/heatmap/:uuid",
        component: HeatmapComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "user/schedule/:id",
        component: ScheduleComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "user/edit/:uuid",
        component: FaceFormComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "user/add",
        component: FaceFormComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "user/images/:id",
        component: ImagesFormComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "cameras/live/:id",
        component: LiveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "cameras/algorithms/:uuid/:id/:atr",
        component: ROIComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "camerasList",
        component: LivestreamComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "cameras/edit/:uuid",
        component: VidComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "cameras/add_camera",
        component: VidComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "cameras/algorithms/:uuid",
        component: AlgorithmsComponent,
        canActivate: [OtherGuard],
      },
      {
        path: "tickets",
        component: TicketComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "helpdesk",
        component: GenerateHelpDeskTicketComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "helpdesk-listing",
        component: HelpdeskTicketListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "incident-logs",
        component: IncidentLogsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "graphs",
        component: CenterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "stream",
        component: StreamComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "search",
        loadChildren: () =>
          import("./search/search.module").then((m) => m.SearchModule),
      },
      { path: "", redirectTo: "sign-in", pathMatch: "full" },
      {
        path: "**",
        component: PagenotfoundComponent,
      },
    ],
  },

  // {
  // path: '',
  // component: PagesComponent,
  // children: [
  //   {
  //     path: 'dashboard',
  //     component: ECommerceComponent,
  //   },
  //   {
  //     path: 'iot-dashboard',
  //     component: DashboardComponent,
  //   },
  //   {
  //     path: 'layout',
  //     loadChildren: () => import('./layout/layout.module')
  //       .then(m => m.LayoutModule),
  //   },
  //   {
  //     path: 'forms',
  //     loadChildren: () => import('./forms/forms.module')
  //       .then(m => m.FormsModule),
  //   },
  //   {
  //     path: 'ui-features',
  //     loadChildren: () => import('./ui-features/ui-features.module')
  //       .then(m => m.UiFeaturesModule),
  //   },
  //   {
  //     path: 'modal-overlays',
  //     loadChildren: () => import('./modal-overlays/modal-overlays.module')
  //       .then(m => m.ModalOverlaysModule),
  //   },
  //   {
  //     path: 'extra-components',
  //     loadChildren: () => import('./extra-components/extra-components.module')
  //       .then(m => m.ExtraComponentsModule),
  //   },
  //   {
  //     path: 'maps',
  //     loadChildren: () => import('./maps/maps.module')
  //       .then(m => m.MapsModule),
  //   },
  //   {
  //     path: 'charts',
  //     loadChildren: () => import('./charts/charts.module')
  //       .then(m => m.ChartsModule),
  //   },
  //   {
  //     path: 'editors',
  //     loadChildren: () => import('./editors/editors.module')
  //       .then(m => m.EditorsModule),
  //   },
  //   {
  //     path: 'tables',
  //     loadChildren: () => import('./tables/tables.module')
  //       .then(m => m.TablesModule),
  //   },
  //   {
  //     path: 'miscellaneous',
  //     loadChildren: () => import('./miscellaneous/miscellaneous.module')
  //       .then(m => m.MiscellaneousModule),
  //   },
  //   {
  //     path: '',
  //     redirectTo: 'dashboard',
  //     pathMatch: 'full',
  //   },
  //   {
  //     path: '**',
  //     component: NotFoundComponent,
  //   },
  //   ],
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
