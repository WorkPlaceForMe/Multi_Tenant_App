import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../../services/faces.service';
import { Account } from '../../../../models/Account';

@Component({
  selector: 'ngx-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  constructor(
    private facesService: FacesService,
    private face: FacesService,
    ) { }

  info: any = []
  cameras;
  camera = '';
  rel:boolean = false;
  reCache: number;
  now_user: Account;
  analytic ={
    algo_id: -1,
    name: ''
  }


  aaa(event){
    this.camera = event
    let id;
    id = this.analytic.algo_id
    if(this.reCache != undefined){
      id = this.reCache
    }
    this.face.checkRel({id: this.camera, algo_id: id}).subscribe(res=>{
      if(this.analytic.algo_id != -1 && this.analytic.algo_id != -2){
        this.reCache = this.analytic.algo_id
      }
      let p = false;
      if(res['message']){
        p = false
      }else {
        p = res['fact']
      }
      this.rel = p;
      if(this.rel == false){
        this.analytic.algo_id = -2;
      }else{
        this.analytic.algo_id = this.reCache
      }
    },err => console.error(err))
  }

  reload(alg){
    if(this.camera != ''){
      let id,type;
      id = this.analytic.algo_id
      if(this.reCache != undefined){
        id = this.reCache
      }
      if(this.now_user.id_branch == '0000'){
        type = 'show'
      }
      this.face.checkRel({id: this.camera, algo_id: id, type: type}).subscribe(res=>{
        if(this.analytic.algo_id != -1 && this.analytic.algo_id != -2){
          this.reCache = this.analytic.algo_id
        }
        let p = false;
        if(res['message']){
          p = false
        }else {
          p = res['fact']
        }
        this.rel = p;
        if(this.rel == false){
          this.analytic.algo_id = -2;
        }else{
            this.analytic.algo_id = this.reCache;
        }
      },err => console.error(err))
    }
  }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    if(this.now_user.id_branch == '0000'){
      this.camera = this.now_user.id_account
      this.analytic.algo_id = -2;
    }
    this.facesService.getDashboard().subscribe(
      res=>{
        this.info = res['data']
        this.facesService.getCameras().subscribe(
          res =>{
            this.cameras = res['data']
          },
          err => console.error(err)
        )
      },
      err => console.error(err)
    )
  }

}
