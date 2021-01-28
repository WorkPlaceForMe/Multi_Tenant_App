import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private facesService: FacesService, 
    private activatedRoute: ActivatedRoute
    ) { }

  param = this.activatedRoute.snapshot.params.uuid;
  setting: Object = {};

  ngOnInit(): void {
    this.facesService.getAlgos()
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.error(err)
    )
  }

}
