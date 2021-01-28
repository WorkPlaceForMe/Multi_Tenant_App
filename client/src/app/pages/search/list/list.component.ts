import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private face: FacesService,
    ) { }

    videos: Array<any> = [];

  ngOnInit(): void {
    this.face.viewVids().subscribe(
      res => {
        this.videos = res['data']
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )
  }

}
