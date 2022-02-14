import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
  animations: [
  trigger('flyInOut', [
    transition('void => *', [
      style({ transform: 'translateX(100%)' }),
      animate(400)
    ])
  ])
]
})
export class LivestreamComponent implements OnInit, OnDestroy {

  relations: Array<any> =[];
  dateMessage: string;
  cams: Array<any> = [];
  algos: Array<any> = [];
  rois: Array<any> = [];
  date:any;
  heatmap: Boolean = false;
  remaining:  any = {
    cameras: 0
  }
  now_user: Account;
  constructor(private facesService: FacesService, private AccountService:AccountService) {}

    ngOnDestroy(){
      // if(this.date){
      //   clearInterval(this.date);
      // }
    }

    remain(){
      if(this.now_user.role != 'user'){
        this.AccountService.remaining().subscribe(
          res=>{
            this.remaining['cameras'] = res['data']['cameras']
          }
        )
      }
    }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    // let currentDate = new Date();
    // this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString('en-US',{ hour12: true });
    // this.date = setInterval(()=>{
    //   let currentDate = new Date();
    //   this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString('en-US',{ hour12: true });
    // }, 1000);
    this.remain()

      this.facesService.getLiveCameras().subscribe(
        res => {
          this.cams = res['data'];
          this.facesService.getAllRelations().subscribe(
            res => {
              this.relations = res['data'];
              this.facesService.getAlgos().subscribe(
                res => {
                  this.algos = res['data'];
                  for(let i = 0; i < this.algos.length; i++){
                    if(this.algos[i]['name'] == 'Heatmap' && this.algos[i]['available'] == 1){
                      this.heatmap = true;
                    }
                  }
                  for(let u = 0; u < this.algos.length; u++){
                    for(let i = 0; i < this.cams.length; i++){
                      for(let e = 0; e < this.relations.length; e++){
                         if(this.algos[u]['name'] == 'Heatmap' && this.algos[u]['id'] == this.relations[e]['algo_id'] && this.relations[e]['camera_id'] == this.cams[i]['id']){
                            this.cams[i].hm = true;
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
        err => console.error(err)
      );             
  }

  getCameras(){
    this.facesService.getCameras().subscribe(
      res => {
        this.cams = res['data'];
        // console.log(this.cams)
      },
      err => console.error(err)
    );
  }


  deleteCamera(id: string){
    if(confirm('Do you want to delete this camera?')){
      this.facesService.deleteCamera(id).subscribe(
        res =>{
          // console.log(res);
          this.getCameras();
          this.remain();
        },
        err => console.log(err)
      )
      }
}

}
