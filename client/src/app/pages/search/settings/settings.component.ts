import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ColorsService } from '../../../services/colors';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private facesService: FacesService, 
    private activatedRoute: ActivatedRoute,
    private colo: ColorsService,
    private rd: Renderer2,
    private sanitizer: DomSanitizer,
    ) {
      this.link = sanitizer.bypassSecurityTrustStyle('url(' + this.heatmap_pic + ')');
     }

  heatmap_pic: string;
  width: number;
  height: number;
  param = this.activatedRoute.snapshot.params.uuid;
  setting: Object = {};
  link: SafeResourceUrl;
  algos: any = [
    { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false },{ activated: false }
  ];
  Aalgos: any = [];
  Balgos: any = [];
  Calgos: any = [];
  actA: number;
  actB: number;
  actC: number;
  polygons = [];
  perimeter = [];
  complete = false;
  private canvas;
  private ctx;
  @ViewChild('polygon', { static: true }) private polygon: ElementRef;

  ngOnInit(): void {
    this.facesService.getAlgos()
    .subscribe(
      res => {
        for (let i = 0; i < this.algos.length; i++) {
          for (let t = 0; t < res['data'].length; t++) {
            this.algos[i]['available'] = 0;
            if (res['data'][t].id === i) {
              this.algos[i].name = res['data'][t].name;
              this.algos[i].available = res['data'][t].available;
              this.algos[i].id = res['data'][t].id;
            }
            this.algos[i].conf = 95;
            if (this.algos[i]['available'] === 1) {
              if (this.algos[i]['id'] <= 3 || this.algos[i]['id'] === 12 || this.algos[i]['id'] === 14 || this.algos[i]['id'] === 15 || this.algos[i]['id'] === 16 || this.algos[i]['id'] === 17 || this.algos[i]['id'] === 18 || this.algos[i]['id'] === 19 || this.algos[i]['id'] === 20 || this.algos[i]['id'] === 21 || this.algos[i]['id'] === 22 || this.algos[i]['id'] === 23 || this.algos[i]['id'] === 24) {
                this.Calgos.push(this.algos[i]);
              } else if (this.algos[i]['id'] > 3 && this.algos[i]['id'] <= 8 || this.algos[i]['id'] === 13 || this.algos[i]['id'] === 25 || this.algos[i]['id'] === 26 || this.algos[i]['id'] === 27 || this.algos[i]['id'] >= 28 || this.algos[i]['id'] === 29 || this.algos[i]['id'] === 30 || this.algos[i]['id'] === 31 || this.algos[i]['id'] === 32) {
                this.Balgos.push(this.algos[i]);
              } else if (this.algos[i]['id'] > 8 && this.algos[i]['id'] <= 11) { // || this.algos[i]['id'] === 27
              this.Aalgos.push(this.algos[i]);
              }
            }
          }
        }
        this.actA = this.getNbOccur(true, this.Aalgos);
        this.actB = this.getNbOccur(true, this.Balgos);
        this.actC = this.getNbOccur(true, this.Calgos);
      },
      err => console.error(err)
    )
    this.setBcg();
    this.complete = true;
  }

  getNbOccur(boolean: boolean, arr) {
    let occurs = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['activated'] === boolean)
        occurs++;
    }
    return occurs;
  }

  comparator(a, b) {
    if (a[a.length - 1] < b[b.length - 1]) return -1;
    if (a[a.length - 1] > b[b.length - 1]) return 1;
    return 0;
  }

  public onChange(algorithm) {
    if (algorithm.activated === false) {
      for (let i = 0; i < this.polygons.length; i++) {
        if (this.polygons[i][this.polygons[i].length - 1] === algorithm.id) {
          this.polygons[i].push(1);
        } else {
          this.polygons[i].push(0);
        }
      }
      this.polygons.sort(this.comparator);
      for (let i = 0; i < this.polygons.length; i++) {
        if (this.polygons[i][this.polygons[i].length - 1] === 1) {
          this.polygons.pop();
          i--;
        }
      }
      for (let i = 0; i < this.polygons.length; i++) {
        this.polygons[i].pop();
      }
      this.perimeter = [];
      this.complete = true;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else if (algorithm.activated === true) {
      this.complete = true;
    }
    this.actA = this.getNbOccur(true, this.Aalgos);
    this.actB = this.getNbOccur(true, this.Balgos);
    this.actC = this.getNbOccur(true, this.Calgos);
  }
  private setBcg() {
    // this.src = 'assets/heatmap_picture.png';
    this.canvas = this.rd.selectRootElement(this.polygon['nativeElement']);
    this.ctx = this.canvas.getContext('2d');
    // let bcg = new Image();
    // bcg.src = this.src;
    // bcg.onload = () => {
    //   this.ctx.drawImage(bcg, 0, 0, this.canvas.width, this.canvas.height)
    // };
  }

  re_draw(end: boolean) {
    let pred_colour, pred_fill;
    for (let e = 0; e < this.polygons.length; e++) {
      for (let u = 0; u < this.algos.length; u++) {
        if (this.polygons[e][this.polygons[e].length - 1] === u) {
          const rgb = this.colo.ran_col(u, this.algos.length);
          pred_colour = 'rgba(' + rgb + ',1)';
          pred_fill = 'rgba(' + rgb + ',0.3)';
        }
      }
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'yellow';
      this.ctx.lineCap = 'circle';
      this.ctx.beginPath();
      for (let i = 0; i < this.polygons[e].length; i++) {
        if (i === 0) {
          this.ctx.moveTo(this.polygons[e][i]['x'], this.polygons[e][i]['y']);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(this.polygons[e][i]['x'] - 2, this.polygons[e][i]['y'] - 2, 4, 4);
        } else {
          this.ctx.lineTo(this.polygons[e][i]['x'], this.polygons[e][i]['y']);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(this.polygons[e][i]['x'] - 2, this.polygons[e][i]['y'] - 2, 4, 4);
        }
      }
      if (end) {
        this.ctx.lineTo(this.polygons[e][0]['x'], this.polygons[e][0]['y']);
        this.ctx.closePath();
        this.ctx.fillStyle = pred_fill;
        this.ctx.fill();
        this.ctx.strokeStyle = pred_colour;
      }
      this.ctx.stroke();
    }
  }
}
