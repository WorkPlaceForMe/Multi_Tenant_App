import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { UploadComponent } from './upload/upload.component';
import { BarComponent } from './bar/bar.component';
import { FileUploadModule } from "ng2-file-upload";

import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule, NbButtonModule, NbListModule,NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule, NbUserModule,    NbActionsModule,
  NbCheckboxModule,
  NbRadioModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbSelectModule, NbSpinnerModule,
  NbContextMenuModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { authInterceptorProviders } from '../../_helpers/auth.interceptor';

@NgModule({
  declarations: [SearchComponent, UploadComponent, BarComponent, ListComponent],
  imports: [
    CommonModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbCheckboxModule,
    NbAccordionModule,
    NbCardModule,
    NbButtonModule,
    FormsModule,
    NbInputModule,
    FileUploadModule,
    CommonModule,
    SearchRoutingModule
  ],
    providers: [
    authInterceptorProviders
  ],
})
export class SearchModule { }
