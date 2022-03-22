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
      relations: Array<any> =[];
        algos: Array<any> =[];
          heatmap: Boolean = false;

  ngOnInit(): void {
    this.getVids();
  }

  getVids(){
    this.face.viewVids().subscribe(
      res => {
        this.videos = res['data'];
          this.face.getAllRelations().subscribe(
            res => {
              this.relations = res['data'];
              this.face.getAlgos().subscribe(
                res => {
                  this.algos = res['data'];
                  for(let i = 0; i < this.algos.length; i++){
                    if(this.algos[i]['name'] == 'Heatmap' && this.algos[i]['available'] == 1){
                      this.heatmap = true;
                    }
                  }
                  for(let u = 0; u < this.algos.length; u++){
                    for(let i = 0; i < this.videos.length; i++){
                      for(let e = 0; e < this.relations.length; e++){
                         if(this.algos[u]['name'] == 'Heatmap' && this.algos[u]['id'] == this.relations[e]['algo_id'] && this.relations[e]['camera_id'] == this.videos[i]['id']){
                            this.videos[i].hm = true;
                        }
                      }
                    }
                  }
                },
                err => console.error(err)
              );
            },
            err => console.error(err)
          );
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
