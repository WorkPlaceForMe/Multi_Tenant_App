import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { SearchComponent } from './search.component';
import { OtherGuard } from '../../guard/other.guard';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path: '',
  component: SearchComponent,
    children: [
      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [OtherGuard]
      },
      { path: '', 
      redirectTo: 'upload',
      pathMatch: 'full',
      },
      {
      path: '**',
      component: PagenotfoundComponent
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
