import { AfterViewInit, Component, ChangeDetectionStrategy, HostListener, OnInit, Input, ViewChild, ElementRef  } from '@angular/core';
import { FacesService } from '../../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Camera } from '../../../../models/Camera';
import { NbDateService, NbCalendarRange } from '@nebular/theme';
import * as h337 from '../../../../../assets/heatmap.min.js';

@Component({
  selector: 'ngx-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class Heatmap1Component implements OnInit {

  constructor(
    private facesService: FacesService, 
    public datepipe: DatePipe,
    ) {
     }

  ngOnInit(): void {
    this.facesService.getCamera(this.camera).subscribe(
      res => {
        this.camInfo = res['data']
        this.size.width = this.camInfo.cam_width
        this.size.height = this.camInfo.cam_height
        this.getHms(this.range.start,this.range.end)
      },
      err => console.error(err)
    )
  }
  camInfo: Camera;
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  @Input() info;
  heatmap: any;
  @ViewChild('pic', { static: false }) pic: ElementRef;

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
  zones: any =[]; 
  Hms: any = [];
  Datas: any = [];

  style(){
    let styles = {
      height:  'auto',
      'max-width': '100%',
    };
    return styles;
  }

  getHms(start:Date, end:Date){
      this.facesService.gethm1(this.datepipe.transform(start, 'yyyy-M-dd HH:mm'), this.datepipe.transform(end, 'yyyy-M-dd 23:59'), this.camera).subscribe(
        res => {
          this.Hms = res['data'];
          this.date.size = this.Hms.length;
          this.date.value = 280*80000/this.Hms.length;
          if(this.date.value >= 400){
            this.date.value = 400;
          }
          // console.log(this.pic.nativeElement.offsetParent.clientWidth, this.pic.nativeElement.offsetParent.clientHeight)
          for(var i = 0; i < this.date.size; i++){
            this.Datas[i] = {x: (this.Hms[i].x * this.pic.nativeElement.offsetParent.clientWidth / this.size.width), y: (this.Hms[i].y * this.pic.nativeElement.offsetParent.clientHeight / this.size.height), value: this.date.value};
          }
          this.heatmap = h337.create({
            container: document.getElementById('testNotSameName'),
            radius: 50,
            maxOpacity: 0.6,
            blur: 1,
          });
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
    this.facesService.getallhm1(this.camera).subscribe(
      res => {
        this.Hms = res['data'];
        this.date.size = this.Hms.length;
        this.date.value = 280*80000/this.Hms.length;
        if(this.date.value >= 400){
          this.date.value = 400;
        }
        this.date.value = 10000
        for(var i = 0; i < this.date.size; i++){
          this.Datas[i] = {x: (this.Hms[i].x * this.heatmap_size.width / this.size.width), y: (this.Hms[i].y * this.heatmap_size.height / this.size.height), value: this.date.value};
        }
        const parentPage = document.getElementById('testNotSameName')
          this.heatmap = h337.create({
            container: parentPage,
            radius: 50,
            maxOpacity: 0.6,
            blur: .9,
          });
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
