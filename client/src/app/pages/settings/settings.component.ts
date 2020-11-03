import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacesService } from '../../services/faces.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  rels:any = [];
  check:any;
  no_algo: boolean = false;

  constructor(private facesService: FacesService, public appcomponent: AppComponent) { }
  loadStart:boolean = false;
  loadStop:boolean = false;
  initiated:boolean = false;
started: number = 0;
status:any = {
  fr:0,
  people:0,
  aod:0,
  vehicle:0,
  broadcasting:0,
  system:0
}

ini:string;
sto:string;
fr:string;
people:string;
aod:string;
vehicle:string;

  ngOnInit() {
    this.getStatus();
this.check = setInterval(()=>{
  this.getStatus();
},3000)
    this.getAlgo();
  }

  ngOnDestroy(){
    clearInterval(this.check);
  }

  getStatus(){
    this.facesService.status().subscribe(
      (res)=> {
        this.status = res
        if(this.status.system == 0){
          this.ini = 'success'
          this.sto = 'danger'
        }else if(this.status.system == 1){
          this.ini = 'warning'
          this.sto = 'danger'
        }else if(this.status.system == 2){
          this.ini = 'danger'
          this.sto = 'success'
        }else if(this.status.system == 3){
          this.ini = 'danger'
          this.sto = 'warning'
        }
        console.log(this.status)
      },
      err => console.log(err)
    )
  }

  getAlgo(){
    this.facesService.getAllRelations().subscribe(
      res => {
        this.rels = res
        if(this.rels.length == 0){
          this.no_algo = true;
        }
      },
      err => console.log(err)
    )
  }

  start(){
    this.initiated = true;
    this.loadStart = true;
    this.status.system = 1;
    this.facesService.initiateSys().subscribe(
      (res)=> {
        console.log(res)
        this.status.system = 2;
        this.loadStart = false;
      },
      err => console.log(err)
    )
  }

  stop(){
    this.initiated = false;
    this.loadStop = true;
    this.status.system = 3;
    this.facesService.stopSys().subscribe(
      (res)=> {
        console.log(res)
        this.loadStop = false;
        this.status.system = 0;
        this.getStatus()
      },
      err => console.log(err)
    )
  }

}
