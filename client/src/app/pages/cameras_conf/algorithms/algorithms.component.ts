import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, HostListener } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { ColorsService } from '../../../services/colors';
import { Relation } from '../../../models/Relation';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera } from '../../../models/Camera';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.css'],
})
export class AlgorithmsComponent implements OnInit {

  link: SafeResourceUrl;
  previousUrl: string;

  constructor(private rd: Renderer2, private facesService: FacesService, private activatedRoute: ActivatedRoute, sanitizer: DomSanitizer, private colo: ColorsService, private router: Router, private AccountService: AccountService) {
    // this.router.events
    // .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    // .subscribe((events: RoutesRecognized[]) => {
    //   console.log('previous url', events[0].urlAfterRedirects);
    //   console.log('current url', events[1].urlAfterRedirects);
    // });
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getCamera(params.uuid).subscribe(
      res => {
        this.camera = res['data'];
        this.res_width = this.camera.cam_width;
        this.res_height = this.camera.cam_height;
        this.resRelation = this.res_height / this.res_width;
        if (window.innerWidth >= 1200) {
          this.width = 525;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
          this.width = 435;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
          this.width = 315;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
          this.width = 485;
          this.height = this.width * this.resRelation;
        }
        this.link = sanitizer.bypassSecurityTrustStyle('url(' + this.camera.heatmap_pic + ')');
      },
      err => console.error(err),
    );
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
              this.algos[i].conf = 95
              if (this.algos[i]['available'] === 1) {
                if (this.algos[i]['id'] <= 3 || this.algos[i]['id'] === 12 || this.algos[i]['id'] === 14 || this.algos[i]['id'] === 15 || this.algos[i]['id'] === 16 || this.algos[i]['id'] === 17 || this.algos[i]['id'] === 18 || this.algos[i]['id'] === 19 || this.algos[i]['id'] === 20 || this.algos[i]['id'] === 21 || this.algos[i]['id'] === 22 || this.algos[i]['id'] === 23 || this.algos[i]['id'] === 24 || this.algos[i]['id'] === 32 || this.algos[i]['id'] === 35 || this.algos[i]['id'] === 38 || this.algos[i]['id'] === 36 || this.algos[i]['id'] === 37 || this.algos[i]['id'] === 40 || this.algos[i]['id'] === 41 || this.algos[i]['id'] === 42 || this.algos[i]['id'] === 43 || this.algos[i]['id'] === 44 || this.algos[i]['id'] === 45 || this.algos[i]['id'] === 46 || this.algos[i]['id'] === 47 || this.algos[i]['id'] === 48 || this.algos[i]['id'] === 49 || this.algos[i]['id'] === 50 || this.algos[i]['id'] === 51 || this.algos[i]['id'] === 52  || this.algos[i]['id'] === 57 || this.algos[i]['id'] === 59 || this.algos[i]['id'] === 60 || this.algos[i]['id'] === 61 || this.algos[i]['id'] === 62 || this.algos[i]['id'] === 67 || this.algos[i]['id'] === 68 || this.algos[i]['id'] === 71 || this.algos[i]['id'] === 73 || this.algos[i]['id'] === 74) {
                  this.Calgos.push(this.algos[i]);
                } else if (this.algos[i]['id'] > 3 && this.algos[i]['id'] <= 8 || this.algos[i]['id'] === 5 || this.algos[i]['id'] === 13 || this.algos[i]['id'] === 25 || this.algos[i]['id'] === 26 || this.algos[i]['id'] === 28 || this.algos[i]['id'] === 29 || this.algos[i]['id'] === 30 || this.algos[i]['id'] === 31 || this.algos[i]['id'] === 33 || this.algos[i]['id'] === 58 || this.algos[i]['id'] === 34 || this.algos[i]['id'] === 63 || this.algos[i]['id'] === 65) {
                  this.Balgos.push(this.algos[i]);
                } else if (this.algos[i]['id'] > 8 && this.algos[i]['id'] <= 11 || this.algos[i]['id'] === 27 || this.algos[i]['id'] === 39 || this.algos[i]['id'] === 53 || this.algos[i]['id'] === 54 || this.algos[i]['id'] === 55 || this.algos[i]['id'] === 56 || this.algos[i]['id'] === 66 || this.algos[i]['id'] === 64 || this.algos[i]['id'] === 69 || this.algos[i]['id'] === 70 || this.algos[i]['id'] === 72) {
                this.Aalgos.push(this.algos[i]);
                }
              }
            }
          }
          this.facesService.getRelations(params.uuid).subscribe(
            res => {
              this.relations = res['data'];
              for (let i = 0; i < this.algos.length; i++) {
                for (let e = 0; e < this.relations.length; e++) {
                  if (this.algos[i].id == this.relations[e]['algo_id']) {
                    this.algos[i].activated = true;
                    this.algos[i].conf = this.relations[e]['atributes'][0]['conf'];
                    this.algos[i].save = this.relations[e]['atributes'][0]['save'];
                    this.algos[i].time = this.relations[e]['atributes'][0]['time'];
                    if (this.relations[e]['atributes'].length == 2) {
                      if (this.relations[e]['algo_id'] == 1) {
                        this.climb = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 7) {
                        this.unwanted = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 5) {
                        this.speed = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 2) {
                        this.loiteringTime = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 3) {
                        this.dac = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 12) {
                        this.quantity = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 16) {
                        this.aod = this.relations[e]['atributes'][1];
                      } else if (this.relations[e]['algo_id'] == 32) {
                        this.parkingTime = this.relations[e]['atributes'][1];
                      }
                    }
                  }

                }
                if (this.algos[i].activated === undefined) {
                  this.algos[i].activated = false;
                }
                if (this.algos[i].time === undefined) {
                  this.algos[i].time = 0;
                }
                if (this.algos[i].save === undefined) {
                  this.algos[i].save = false;
                }
              }
              for (let u = 0; u < this.relations.length; u++) {
                if (this.relations[u]['roi_id'] != null) {
                  for (let l = 0; l < this.relations[u]['roi_id'].length; l++) {
                    // these parameters is to scalate it according to RoI resolution
                    this.relations[u]['roi_id'][l]['x'] = this.relations[u]['roi_id'][l]['x'] * this.width / this.res_width;
                    this.relations[u]['roi_id'][l]['y'] = this.relations[u]['roi_id'][l]['y'] * this.height / this.res_height;
                  }

                  this.relations[u]['roi_id'].push(parseInt(this.relations[u]['algo_id']));
                  this.polygons.push(this.relations[u]['roi_id']);
                }
                if (u === this.relations.length - 1 && this.polygons != null) {
                  this.re_draw(true);
                }
              }
              this.actA = this.getNbOccur(true, this.Aalgos);
              this.actB = this.getNbOccur(true, this.Balgos);
              this.actC = this.getNbOccur(true, this.Calgos);
            },
            err => console.error(err),
          );
        },
        err => console.error(err),
      );
  }

  relation: Relation = {
    camera_id: '',
    algo_id: 0,
    roi_id: null,
    atributes: null,
  };

  @Input() private src: string;
  @Output() private created = new EventEmitter();
  @ViewChild('polygon', { static: true }) private polygon: ElementRef;

  public innerWidth: any;
  public innerHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // this.width = window.innerWidth - 600;
    if (window.innerWidth >= 1200) {
      this.width = 525;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      this.width = 435;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.width = 315;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      this.width = 485;
      this.height = this.width * this.resRelation;
    }
  }


  width: number;
  height: number;
  resRelation: number;
  camera: Camera = {
    name: 'Loading',
  };
  polygons = [];
  perimeter = [];
  relations: any = [];
  algos: any = [
    { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false },{ activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false },{ activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false },{ activated: false }, { activated: false },
  ];
  Aalgos: any = [];
  Balgos: any = [];
  Calgos: any = [];
  colour: string = '';
  fill: string = '';
  complete = false;
  param = this.activatedRoute.snapshot.params.uuid;
  actA: number;
  actB: number;
  actC: number;
  climb: any = {};
  loiteringTime: any = {
    time: 60,
  };
  parkingTime: any = {
    time: 60,
  };
  aod: any = {
    time: 1,
  };
  speed: any = {};
  unwanted: any = {};
  dac: any = {};
  quantity: any = {
    crowd: 50,
  };
  queue: any = {
    peopleAlert: 5
  }
  hamAndCheese: any = {
    low: 1,
    med: 3,
    high: 5
  }
  showL: boolean;
  showS: boolean;
  showU0: boolean;
  showU1: boolean;
  showU2: boolean;
  res_width: number;
  res_height: number;
  private canvas;
  private ctx;
  remaining: any = {
    analytics: 0,
  };

  reTakeVals: any = {
    show: false,
    error: false
  }
  reTake(){
    this.reTakeVals.show = true
    this.reTakeVals.error = false
    let response = {
      cameraId: this.camera.id,
      id_account: this.camera['id_account'],
      id_branch: this.camera['id_branch']
    };

    this.facesService.doOneImage(response).subscribe(
      (res) => {
        this.reTakeVals.show = false
        window.location.reload();
        // console.log(res)
      },
      (err) => {
        this.reTakeVals.show = false
        this.reTakeVals.error = true
        // console.error(err)
      }
    );
  }

  back(which){
    if (which === 'Yes'){
      this.router.navigateByUrl('/pages/search/list');
    } else {
      this.router.navigateByUrl('/pages/camerasList');
    }
  }

  ngOnInit() {
    this.setBcg();
    this.complete = true;
    this.AccountService.remaining().subscribe(
      res => {
        this.remaining['analytics'] = res['data']['analytics'];
      },
    );
  }

  getNbOccur(boolean: boolean, arr) {
    let occurs = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['activated'] === boolean)
        occurs++;
    }
    return occurs;
  }

  checkTime(input) {
    if (input === undefined || input === '') {
      this.showL = true;
    }
    else if (input !== undefined) {
      this.showL = false;
    }
  }

  checkTimeRangeS(input0, input1) {
    if (input0 === undefined || input0 === '' || input1 === undefined || input1 === '') {
      this.showS = true;
    }
    else if (input0 !== undefined && input1 !== undefined) {
      this.showS = false;
    }
  }

  checkTimeRangeU0(input0, input1) {
    if (input0 === undefined || input0 === '' || input1 === undefined || input1 === '') {
      this.showU0 = true;
    }
    else if (input0 !== undefined && input1 !== undefined) {
      this.showU0 = false;
    }
  }

  checkTimeRangeU1(input0, input1) {
    if (input0 === undefined || input0 === '' || input1 === undefined || input1 === '') {
      this.showU1 = true;
    }
    else if (input0 !== undefined && input1 !== undefined) {
      this.showU1 = false;
    }
  }

  checkTimeRangeU2(input0, input1) {
    if (input0 === undefined || input0 === '' || input1 === undefined || input1 === '') {
      this.showU2 = true;
    }
    else if (input0 !== undefined && input1 !== undefined) {
      this.showU2 = false;
    }
  }

  resetTimeUc() {
    this.unwanted['car.rangeB'] = 0;
    this.unwanted['car.rangeE'] = 0;
  }

  resetTimeUt() {
    this.unwanted['truck.rangeB'] = 0;
    this.unwanted['truck.rangeE'] = 0;
  }
  resetTimeUtwo() {
    this.unwanted['two_wheeler.rangeB'] = 0;
    this.unwanted['two_wheeler.rangeE'] = 0;
  }

  resetTimeS() {
    this.speed['rangeB'] = '';
    this.speed['rangeE'] = '';
  }

  resetTime() {
    this.loiteringTime = '';
    this.parkingTime = '';
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

  public showMyMessage = false;

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

  info() {
    // console.log(this.algos, this.relations, this.polygons);
  }

  saveAndBack(which) {
    this.nSave();
    if (which === 'Yes'){
      this.router.navigateByUrl('/pages/search/list');
    } else {
      this.router.navigateByUrl('/pages/camerasList');
    }
    //this.router.navigateByUrl('/pages/camerasList');
  }
  saave() {
    const data = [];
    const id = this.activatedRoute.snapshot.params.uuid;
    data.push(this.algos, this.climb, this.loiteringTime, this.aod, this.speed, this.unwanted, this.dac, this.quantity, this.parkingTime,this.queue, this.hamAndCheese);
    this.facesService.sendAlgs(id, data).subscribe(
      res => {
        // this.router.navigateByUrl(`/pages/cameras/algorithms/${id}`)
        window.location.reload();
      },
      err => {
        // console.log(err);
        // this.router.navigateByUrl(`/pages/cameras/algorithms/${id}`)
        window.location.reload();
      },
    );
  }

  nSave() {
    const data = [];
    const id = this.activatedRoute.snapshot.params.uuid;
    data.push(this.algos, this.climb, this.loiteringTime, this.aod, this.speed, this.unwanted, this.dac, this.quantity, this.parkingTime, this.queue, this.hamAndCheese);
    this.facesService.sendAlgs(id, data).subscribe(
      res => {},
      err => console.log(err),
    );
  }

}

