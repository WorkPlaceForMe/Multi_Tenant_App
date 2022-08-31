import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../../services/faces.service';
import { Account } from '../../../../models/Account';
import { AccountService } from '../../../../services/account.service';
import { api } from '../../../../models/API'

@Component({
  selector: 'ngx-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss'],
  styles: [ ':host {height: 100% !important}']
})
export class CenterComponent implements OnInit {

  constructor(
    private accountserv: AccountService,
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
  overview ={
    algo_id: -3,
    name: 'Main Dashboard',
    status: "'primary'"
  }

  liveView  = {
    algo_id: -4,
    name: 'Live View',
    status: "'primary'"
  }

pic:string = `${api}/pictures/graymaticsLogo.png`

  aaa(event){
    this.camera = event
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

  dispThreats: boolean = false;
  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.analytic = this.overview
    this.face.getDashboard().subscribe(
      res=>{
        this.info = res['data']
        if(this.info['analyticsT'].length != 0){
          this.dispThreats = true
        }
        if(this.now_user.id_branch != '0000'){
          this.face.getCameras().subscribe(
            res =>{
              this.cameras = res['data']
            },
            err => console.error(err)
          )
        }else{
          this.accountserv.getAccount('client').subscribe(
            res =>{
              this.cameras = res['data']
            },
            err => console.error(err)
          )
        }

      },
      err => console.error(err)
    )
  }

}
