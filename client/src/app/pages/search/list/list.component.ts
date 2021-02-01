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
    const body = {
      vidName: name,
    };
    if (confirm('Do you want to delete this camera?')) {
      this.face.delVid(id).subscribe(
        res => {
          // console.log(res);
          this.getVids();
        },
        err => console.log(err);
      )
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
