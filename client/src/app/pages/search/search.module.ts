import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { UploadComponent } from './upload/upload.component';
import { BarComponent } from './bar/bar.component';
import { FileUploadModule } from "ng2-file-upload";


@NgModule({
  declarations: [SearchComponent, UploadComponent, BarComponent ],
  imports: [
    FileUploadModule,
    CommonModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
