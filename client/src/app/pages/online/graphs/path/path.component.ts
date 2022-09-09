import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbCalendarRange } from '@nebular/theme';
import { Camera } from '../../../../models/Camera';
import { ColorsService } from '../../../../services/colors';
import { FacesService } from '../../../../services/faces.service';

@Component({
  selector: 'ngx-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent implements OnInit {

  constructor(
    private facesService: FacesService,
    public datepipe: DatePipe,
    private rd: Renderer2,
    private colo: ColorsService
    ) { }

  ngOnInit(): void {
    this.setBcg();
    this.facesService.getCamera(this.camera).subscribe(
      res => {
        this.camInfo = res['data']
        this.getPath(this.range.start,this.range.end)
      },
      err => console.error(err)
    )
  }

  style(){
    let styles = {
      height:  'auto',
      'max-width': '100%',
    };
    return styles;
  }

  link: SafeResourceUrl;
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  @Input() paths: Number;
  camInfo: Camera;
  private ctx;
  private canvas;
  @ViewChild('polygon', { static: true }) private polygon: ElementRef;
  obj: Object = {}
  total: Number = 0
  max: Number;
  @Output() refresh = new EventEmitter<string>();

  private setBcg() {
    this.canvas = this.rd.selectRootElement(this.polygon['nativeElement']);
    this.canvas.width = 1022
    this.canvas.height = 511
    this.ctx = this.canvas.getContext('2d');
  }

    getPath(start:Date, end:Date){
      this.facesService.getPath(this.datepipe.transform(start, 'yyyy-M-dd HH:mm'), this.datepipe.transform(end, 'yyyy-M-dd 23:59'), this.camera).subscribe(
        res => {
          let data = []
          for (const data of res['data']) {
            if (this.obj[data.id] == null) {
              this.obj[data.id] = []
            }
            this.obj[data.id].push({x: data.x * this.polygon.nativeElement.offsetParent.clientWidth / this.camInfo.cam_width, y: data.y * this.polygon.nativeElement.offsetParent.clientHeight / this.camInfo.cam_height})
          }
          for(const ids of Object.keys(this.obj)){
            this.obj[ids].push(parseInt(ids))
            data.push(this.obj[ids])
          }
          this.max = data.length
          if(this.paths != -1){
            this.total = this.paths
            return this.re_draw(true,this.paths,data)
          }
          this.total = data.length
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.re_draw(true,data.length,data)
        },
        err => console.error(err)
      );
    }

    refreshButtom(num){
      this.refresh.emit(num);
    }

    re_draw(end: boolean, total:Number, data: Array<any>) {
    let pred_colour, pred_fill;
    for (let e = 0; e < total; e++) {
      for (let u = 0; u < total; u++) {
        if (data[e][data[e].length - 1] === u) {
          const rgb = this.colo.ran_col(u, total);
          pred_colour = 'rgba(' + rgb + ',1)';
          pred_fill = 'rgba(' + rgb + ',0.3)';
        }
      }
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = pred_colour;
      this.ctx.lineCap = 'circle';
      this.ctx.beginPath();
      for (let i = 0; i < data[e].length - 1; i++) {
        if (i === 0) {
          this.ctx.moveTo(data[e][i]['x'], data[e][i]['y']);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(data[e][i]['x'] - 1, data[e][i]['y'] - 1, 2, 2);
        } else {
          this.ctx.lineTo(data[e][i]['x'], data[e][i]['y']);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(data[e][i]['x'] - 1, data[e][i]['y'] - 1, 2, 2);
        }
      }
      if (end) {
        this.ctx.strokeStyle = pred_colour;
      }
      this.ctx.stroke();
    }
  }

}
