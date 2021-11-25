import { AfterViewInit, Component, ChangeDetectionStrategy, HostListener, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Camera } from '../../../models/Camera';
import { NbDateService, NbCalendarRange } from '@nebular/theme';
import h337 from '../../../../assets/heatmap.min.js';


// declare const h337: any;

@Component({
selector: 'app-heatmap',
templateUrl: './heatmap.component.html',
styleUrls: ['./heatmap.component.css'],
changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeatmapComponent implements AfterViewInit, OnInit {
    
  camera: Camera;

  constructor(private activatedRoute: ActivatedRoute, private facesService: FacesService, public datepipe: DatePipe,protected dateService: NbDateService<Date>) {
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getCamera(params.uuid).subscribe(
        res =>{
          this.camera = res['data'];
          console.log(this.camera)
          this.size.width = this.camera.cam_width;
          this.size.height = this.camera.cam_height;
          console.log(this.heatmap_size, window.innerWidth)
          if(window.innerWidth >= 1200){
            this.heatmap_size.width = 1050;
            this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
          }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
            this.heatmap_size.width = 870;
            this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
          }else if(window.innerWidth < 992 && window.innerWidth >= 768){
            this.heatmap_size.width = 640;
            this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
          }else if(window.innerWidth < 768 && window.innerWidth >= 576){
            this.heatmap_size.width = 444;
            this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
          }else if(window.innerWidth < 576){
            this.heatmap_size.width = window.innerWidth - 110;
            this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
          }
          // this.heatmap_size = {
          //   width: this.camera.cam_width,
          //   height: this.camera.cam_height
          // }
          console.log(this.heatmap_size)
          // this.heatmap = h337.create({
          //   container: document.getElementById('testNotSameName'),
          //   radius: 50,
          //   maxOpacity: 0.6,
          //   blur: 1,
          // });
           },
        err => console.error(err)
      );
  }

  public innerWidth: any;
  public innerHeight: any;
  max: Date;
  range: NbCalendarRange<Date>;
  heatmap: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth >= 1200){
      this.heatmap_size.width = 1050;
      this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.heatmap_size.width = 870;
      this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.heatmap_size.width = 640;
      this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
    }else if(window.innerWidth < 768 && window.innerWidth >= 576){
      this.heatmap_size.width = 444;
      this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
    }else if(window.innerWidth < 576){
      this.heatmap_size.width = window.innerWidth - 110;
      this.heatmap_size.height = this.heatmap_size.width*(this.size.height/this.size.width);
    }
  }
  
  ngOnInit(){
    this.max = this.dateService.addDay(this.dateService.today(), 0);
  }

  id:string = this.activatedRoute.snapshot.params.uuid;

  dates: any[];
  size: any={
    width: 0,
    height: 0
  }
  heatmap_size: any = {
    width: window.innerWidth - 250,
    height: 768/2
  }
  date: any ={
    start: '',
    end: '',
    dwell: 2,
    size: 0,
    value: 0
  }


  public onChange1(event1): void {
  this.date.dwell = event1;
}

  zones: any =[]; 
  Hms: any = [];
  Datas: any = [];

  ngAfterViewInit() {
  }

  viewStuff(){
    console.log(window.document.querySelector('#testNotSameName'))
  }

  style(){
    let styles = {
      width: this.heatmap_size.width + 'px',
      height:  this.heatmap_size.height + 'px'
    };
    return styles;
  }

  getHms(start:Date, end:Date){
    this.heatmap = h337.create({
      container: document.getElementById('testNotSameName'),
      radius: 50,
      maxOpacity: 0.6,
      blur: 1,
    });
    const camera_id = this.activatedRoute.snapshot.params.uuid;
      this.facesService.gethm1(this.datepipe.transform(start, 'yyyy-M-dd HH:mm'), this.datepipe.transform(end, 'yyyy-M-dd 23:59'), camera_id).subscribe(
        res => {
          this.Hms = res['data'];
          this.date.size = this.Hms.length;
          this.date.value = 280*80000/this.Hms.length;
          if(this.date.value >= 400){
            this.date.value = 400;
          }
          for(var i = 0; i < this.date.size; i++){
            this.Datas[i] = {x: (this.Hms[i].x * this.heatmap_size.width / this.size.width), y: (this.Hms[i].y * this.heatmap_size.height / this.size.height), value: this.date.value};
          }
          this.heatmap.setData({
            max: this.Datas.length,
            min: 1,
            data: this.Datas
        });
        },
        err => console.error(err)
      );
  }

  getAll(){
  this.heatmap = h337.create({
      container: document.getElementById('testNotSameName'),
      radius: 50,
      maxOpacity: 0.6,
      blur: 1,
    });
    const camera_id = this.activatedRoute.snapshot.params.uuid;
    this.facesService.getallhm1(camera_id).subscribe(
      res => {
        this.Hms = res['data'];
        // console.log("aaaaaaaaaaaa")
        this.date.size = this.Hms.length;
        this.date.value = 280*80000/this.Hms.length;
        if(this.date.value >= 400){
          this.date.value = 400;
        }
        this.date.value = 10000
        for(var i = 0; i < this.date.size; i++){
          this.Datas[i] = {x: (this.Hms[i].x * this.heatmap_size.width / this.size.width), y: (this.Hms[i].y * this.heatmap_size.height / this.size.height), value: this.date.value};
        }
          this.heatmap.setData({
            max: this.Datas.length,
            min: 1,
            data: this.Datas
        });
      },
      err => console.error(err)
    );
  }
}
