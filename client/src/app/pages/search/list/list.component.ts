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

  deleteVideo(name: string, id) {
    let split_rtsp = name.split('/');
    const body = {
      vidName: split_rtsp[split_rtsp.length - 1],
    };
    if (confirm('Do you want to delete this camera?')) {
      this.face.delVid(id, body).subscribe(
        res => {
          // console.log(res);
          this.getVids();
        });
      }

/*     let body = {
      vidName: name
    }
    this.face.delVid(body).subscribe(
      res =>{
        this.getVids();
      },
      err => {
        console.error(err)
      }
    ) */
  }

}
