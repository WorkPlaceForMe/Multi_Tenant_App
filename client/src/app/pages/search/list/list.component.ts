import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  constructor(
    private face: FacesService,
    ) { }

    videos: Array<any> = [];

  ngOnInit(): void {
    this.getVids();
  }

  getVids(){
    this.face.viewVids().subscribe(
      res => {
        this.videos = res['data'];
      },
      err => {
        console.error(err);
      },
    );
  }


  deleteVideo(name: string, id, where) {
    /* if(name.split('/')[10]) {
      name = name.split('/')[10];
    } */
    let split_rtsp = name.split('/');
    const body = {
      vidName: split_rtsp[split_rtsp.length - 1],
      uuid: id,
      which: where
    };
    if (confirm('Do you want to delete this camera?')) {
      this.face.delVid(body).subscribe(
        res => {
          this.getVids();
        });
      }
  }

}
