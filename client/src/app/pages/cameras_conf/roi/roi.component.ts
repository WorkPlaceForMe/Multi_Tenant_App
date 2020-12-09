import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, HostListener } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { ColorsService } from '../../../services/colors';
import { Algorithm } from '../../../models/Algorithm';
import { Relation } from '../../../models/Relation';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Camera } from '../../../models/Camera';
import { Roi } from '../../../models/Roi';

@Component({
  selector: 'app-roi',
  templateUrl: './roi.component.html',
  styleUrls: ['./roi.component.css']
})

export class ROIComponent implements OnInit {
  link: SafeResourceUrl;
  open:boolean;
  constructor(private rd: Renderer2, private facesService: FacesService, private activatedRoute: ActivatedRoute,sanitizer: DomSanitizer, private colo:ColorsService, private router: Router) {
    const params = this.activatedRoute.snapshot.params;
    this.wrong['dir'] = 'beggining';
    // this.wrong['of'] = 1;
    this.complete = false;
    this.start(false);
    const a = params.atr.split('-')
    this.atr['conf'] = Number(a[0])
    if(a[1] == 'true'){
      a[1] = true
    }else{
      a[1] = false
    }
    this.atr['save'] = a[1]
    this.atr['time'] = Number(a[2])
    this.facesService.getAlgos()
    .subscribe(
      res =>{
        for(let i = 0; i < this.algos.length; i++){
          if(res['data'][i] != undefined){
            this.algos[i].name = res['data'][i].name
            this.algos[i].available = res['data'][i].available
            this.algos[i].id = res['data'][i].id
          }
          if(this.algos[i]['id'] == this.id){
            this.algorithm = this.algos[i];
        }
        }
      },
      err => console.error(err)
    )
    this.facesService.getCamera(params.uuid).subscribe(
      res =>{
        this.camera = res['data'];
        this.facesService.getRelations(params.uuid).subscribe(
          res =>{
            this.relations = res['data'];
          for(let u = 0; u < this.relations.length; u++){
            if(this.relations[u]['algo_id'] == 13){
              this.algos[13].activated = true;
            }else{
              this.algos[13].activated = false;
            }
            if(this.relations[u]['roi_id'] != null &&  this.relations[u]['algo_id'] == params.id){
              for(let l = 0; l < this.relations[u]['roi_id'].length; l++){
                //these parameters is to scalate it according to RoI resolution
                this.relations[u]['roi_id'][l]['x'] = this.relations[u]['roi_id'][l]['x']*this.width/this.res_width;
                this.relations[u]['roi_id'][l]['y'] = this.relations[u]['roi_id'][l]['y']*this.height/this.res_height;
              }
              if(this.relations[u]['atributes'][1] != null){
                this.relations[u]['roi_id'].push(this.relations[u]['atributes'][1]);
              }
              this.relations[u]['roi_id'].push(this.relations[u]['algo_id']);
              this.polygons.push(this.relations[u]['roi_id']);
             }
             if(u == this.relations.length -1 && this.polygons != null){
              this.re_draw(true);
             }            
          }
          this.wrong['of'] = this.polygons.length + 1;
          },
          err => console.error(err)
        );
        this.link = sanitizer.bypassSecurityTrustStyle("url("+this.camera.heatmap_pic+")");
      },
      err => console.error(err)
    );    
  }
 
  algorithm: Algorithm = {
    id: -1,
    name: "Loading"
  };
  relation: Relation ={
    camera_id: '',
    algo_id: 0,
    roi_id: null,
    atributes: null
  };

  atr: any = {conf: 0, save: false,time: 0}

  @Input() private src: string;
  @Output() private created = new EventEmitter();
  @ViewChild('polygon', { static: true }) private polygon:ElementRef;

  public innerWidth: any;
  public innerHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let a;
    clearTimeout(a);
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    let rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = this.width*this.resRelation;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    a = setTimeout(()=>{
      this.re_draw(true);
    }, 100);    
  }

  x:number;
  y:number;
  width:number;
  height:number;
  resRelation:number;
  res_width:number;
  res_height:number;
  camera: Camera;
  polygons = [];
  perimeter = [];
  relations: any = [];
  algos: any = [
    {activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false},{activated:false}
  ];
  colour: string = '';
  fill: string ='';
  parking:any={};
  wrong:any={};
  wrong0:any={};
  atrCache:any;
  roi:Roi={
    id:'',
    coords: '',
    camera_id: ''
  };
  rois: any=[];
  complete = false;
  param:string = this.activatedRoute.snapshot.params.uuid;
  id:number = this.activatedRoute.snapshot.params.id;
  selected:number;
  different:boolean = false;
  public showMyMessage = false;
  public showMyMessage1 = false;
  public showMyMessage2 = false;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  private canvas;
  private ctx;

  scale(){
    for(let u = 0; u < this.polygons.length; u++){
      for(let l = 0; l < this.polygons[u].length - 2; l++){
        //these parameters is to scalate it according to RoI resolution
        this.polygons[u][l]['x'] = this.polygons[u][l]['x']*this.width/this.res_width;
        this.polygons[u][l]['y'] = this.polygons[u][l]['y']*this.height/this.res_height;
      }
    }
  }

<<<<<<< HEAD
=======
  vieww(){
    console.log(this.polygons)
  }
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
  
  ngOnInit() {
    this.setBcg();
    var rect = this.canvas.getBoundingClientRect();
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getCamera(params.uuid).subscribe(
      res =>{
        this.camera = res['data'];
        this.res_width =this.camera.cam_width;
        this.res_height =this.camera.cam_height;
        this.resRelation = this.res_height / this.res_width;
        this.width = rect.width;
        this.height = this.width*this.resRelation;
      },
      err =>{console.error(err)})
    if(rect.x == 316){
      this.open = true;
    }else if(rect.x == 116){
      this.open = false
    }
  }

  private static line_intersects(p0, p1, p2, p3) {
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['x'] - p0['x'];
    s1_y = p1['y'] - p0['y'];
    s2_x = p3['x'] - p2['x'];
    s2_y = p3['y'] - p2['y'];

    let s, t;
    s = (-s1_y * (p0['x'] - p2['x']) + s1_x * (p0['y'] - p2['y'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['y'] - p2['y']) - s2_y * (p0['x'] - p2['x'])) / (-s2_x * s1_y + s1_x * s2_y);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    // No collision
  }

  private point(x,y,ind){
    this.ctx.fillStyle="white";
    this.ctx.strokeStyle = "white";
    if(this.perimeter.length == 1 || ind == true){
      this.ctx.fillRect(x-4,y-4,8,8);
  }else {
    this.ctx.fillRect(x-2,y-2,4,4);    
    }
    this.ctx.moveTo(x,y);
   }

  private draw(end){
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "white";
    this.ctx.lineCap = "circle";
    this.ctx.beginPath();
    for(let i = 0; i < this.perimeter.length; i++){      
      if( i == 0 ){
        this.ctx.moveTo(this.perimeter[i]['x'],this.perimeter[i]['y']);
        end || this.point(this.perimeter[i]['x'],this.perimeter[i]['y'],true);
      } else {
        this.ctx.lineTo(this.perimeter[i]['x'],this.perimeter[i]['y']);
        end || this.point(this.perimeter[i]['x'],this.perimeter[i]['y'],false);
      }
    }
    if(end){
      this.ctx.lineTo(this.perimeter[0]['x'],this.perimeter[0]['y']);
      this.ctx.closePath();
      var rgb = this.colo.ran_col(this.id,this.algos.length);
      this.colour = 'rgba('+ rgb +',1)';
      if(this.id == 8){
        this.ctx.font = '40px Georgia';
        this.getMid(this.perimeter,false);
        this.ctx.fillStyle = this.colour;
        this.ctx.fillText(this.polygons.length,this.x,this.y);
      }
      this.ctx.fillStyle = this.fill + '0.3)';
      this.ctx.fill();
      this.ctx.strokeStyle = this.colour;
      for(let i = 0; i< this.perimeter.length; i++){
        this.ctx.fillStyle = this.colour;
        this.ctx.fillRect(this.perimeter[i]['x']-2,this.perimeter[i]['y']-2,4,4);
      }
      this.complete = false;
      this.created.emit(this.perimeter);
    }
    this.ctx.stroke();
  }

  private check_intersect(x,y){
    if(this.perimeter.length < 4){
      return false;
    }
    let p0 = [];
    let p1 = [];
    let p2 = [];
    let p3 = [];

    p2['x'] = this.perimeter[this.perimeter.length-1]['x'];
    p2['y'] = this.perimeter[this.perimeter.length-1]['y'];
    p3['x'] = x;
    p3['y'] = y;

    for(let i=0; i<this.perimeter.length-1; i++){
      p0['x'] = this.perimeter[i]['x'];
      p0['y'] = this.perimeter[i]['y'];
      p1['x'] = this.perimeter[i+1]['x'];
      p1['y'] = this.perimeter[i+1]['y'];
      if(p1['x'] == p2['x'] && p1['y'] == p2['y']){ continue; }
      if(p0['x'] == p3['x'] && p0['y'] == p3['y']){ continue; }
      if(ROIComponent.line_intersects(p0,p1,p2,p3)==true){
        return true;
      }
    }
    return false;
  }

  point_it(event) {
    if(this.complete){
      this.created.emit('already created');
      return false;
    }
    let rect, x, y;
    //  || event.which === 3 || event.button === 2
    if(event.ctrlKey){
      if(this.perimeter.length == 2){
        this.created.emit('at least 3 points required');
        return false;
      }
      x = this.perimeter[0]['x'];
      y = this.perimeter[0]['y'];
      if(this.check_intersect(x,y)){
        this.created.emit('line intersecrion');
        return false;
      }
      this.draw(true);
      event.preventDefault();
      return false;
    } else {
      if(this.id == 4 && this.selected != undefined){
        this.selected = undefined;
        this.parking = {};
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw(true);
      }
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      // x = event.clientX;
      // y = event.clientY;
      if (this.perimeter.length>0 && x == this.perimeter[this.perimeter.length-1]['x'] && y == this.perimeter[this.perimeter.length-1]['y']){
        // same point - double click
        return false;
      }
      if(this.perimeter.length>2 && x > this.perimeter[0]['x'] - 4 && x < this.perimeter[0]['x'] + 4 && y > this.perimeter[0]['y'] - 4 && y < this.perimeter[0]['y'] + 4){
        if(this.id == 8){
          this.close_wrong();
          return false;
        }else if(this.id == 4){
          this.close_park();
          return false;
        }else {
        this.close();
        return false;
        }
      }
      if(this.check_intersect(x,y)){
        this.created.emit('line intersection');
        return false;
      }
      this.perimeter.push({'x':x,'y':y});
      this.draw(false);
      return false;
    }
  }

  private start(with_draw: boolean) {
    const img = new Image();
    img.onload = () => {
      this.ctx = this.canvas.getContext("2d");
      if(with_draw == true){
        this.draw(false);
      }
    }
  }

  private setBcg() {
    this.canvas = this.rd.selectRootElement(this.polygon["nativeElement"]);
    this.ctx = this.canvas.getContext("2d");
  }

close_park(){
if(this.parking.car == true || this.parking.truck == true || this.parking.motorbike == true){
  if(this.parking.time != undefined && this.parking.rangeB != undefined && this.parking.rangeE != undefined){
     if(this.selected != undefined){
      for(let e = 0; e < this.polygons.length; e++){
        if(this.selected == e){
          this.polygons[e][this.polygons[e].length - 2] = this.parking;
        }
      }
      this.selected = undefined;
      this.showMyMessage = false;
    }else if(this.selected == undefined){
      this.close();
    }
  }else{
    this.showMyMessage1 = false
    this.showMyMessage2 = true;
    setTimeout(() => {
      this.showMyMessage2 = false
    }, 5000)
  }
} else{
  this.showMyMessage1 = true;
  setTimeout(() => {
    this.showMyMessage1 = false
  }, 5000)
}
}

addPair(){
  this.showMyMessage3 = false;
  if(this.isOdd(this.polygons.length) == 1 || this.polygons.length == 0){
    this.showMyMessage3 = true;
    setTimeout(() => {
      this.showMyMessage3 = false
    }, 5000)
  }else{
  this.complete = false;
  this.wrong['dir'] = 'beggining';
  this.wrong['of'] = this.polygons.length + 1;
  }
}

getMid(pol,which){
  this.x = 0;
  this.y = 0;
 let sumX = 0, sumY = 0, res;
 for(let i = 0; i < pol.length; i++){
   if(typeof pol[i]['x'] == 'number' && typeof pol[i]['y'] == 'number' ){
    sumX = pol[i]['x'] + sumX;
    sumY = pol[i]['y'] + sumY;
   }
 }
 if(which == true){
  sumX = sumX/(pol.length - 2);
  sumY = sumY/(pol.length - 2);
 }else if(which == false){
  sumX = sumX/(pol.length - 2);
  sumY = sumY/(pol.length - 2);
 }
 this.x = sumX;
 this.y = sumY;
 res = sumX + ',' + sumY
 return res;
}

close_wrong(){
    this.close();
    if(this.isOdd(this.polygons.length) == 0){
      this.complete = true;
      }
      if(this.isOdd(this.polygons.length) == 1){
        this.wrong['dir'] = 'end';
        this.wrong['of'] = this.polygons.length - 1;
        }
}

    close(){
    if(this.perimeter.length > 2){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw(true);
        if(this.id == 8){
          this.perimeter.push(this.wrong);
          this.wrong = {};
        }
        if(this.id == 4){
          this.perimeter.push(this.parking);
          this.parking = {};
        }
        this.perimeter.push(this.id);
        this.polygons.push(this.perimeter);
        var rgb = this.colo.ran_col(this.id,this.algos.length);
        this.colour = 'rgba('+ rgb +',1)';
        this.fill = 'rgba('+ rgb + ',0.3)';
        this.draw(true);
        this.perimeter = [];
        this.showMyMessage = false;
      } else{
          this.showMyMessage = true;
          setTimeout(() => {
            this.showMyMessage = false
          }, 5000)
      }
    }

  undo(){
    this.perimeter.pop();
    this.complete = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw(false);
    this.re_draw(true);
  }

  clear_canvas(){
    this.perimeter = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.re_draw(true);
  }

  remove_last(){
    if(this.perimeter.length == 0){
      this.polygons.pop();
      if(this.id == 8 && this.isOdd(this.polygons.length) == 1){
        this.wrong['of'] = this.polygons.length - 1;
        this.wrong['dir'] = 'end';
      } else if(this.id == 8 && this.isOdd(this.polygons.length) == 0){
        this.wrong['of'] = this.polygons.length + 1;
        this.wrong['dir'] = 'beggining';
      }
      this.complete = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
        }else{
    this.perimeter = [];
    this.complete = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.re_draw(true);
        }
  }

re_draw(end: boolean){
  let pred_colour, pred_fill;
  for(let e = 0; e < this.polygons.length; e++){
    for(let u =0;u<this.algos.length;u++){
    if(this.polygons[e][this.polygons[e].length-1] == u){
      var rgb = this.colo.ran_col(u,this.algos.length);
      pred_colour = 'rgba('+ rgb +',1)';
      pred_fill = 'rgba('+ rgb + ',0.3)';
    }
  }
  this.ctx.lineWidth = 1;
  this.ctx.strokeStyle = "yellow";
  this.ctx.lineCap = "circle";
  this.ctx.beginPath();
  for(let i = 0; i < this.polygons[e].length; i++){
    if( i == 0 ){
      this.ctx.moveTo(this.polygons[e][i]['x'],this.polygons[e][i]['y']);
      end || this.point(this.polygons[e][i]['x'],this.polygons[e][i]['y'],false);
      this.ctx.fillStyle = pred_colour;
      this.ctx.fillRect(this.polygons[e][i]['x']-2,this.polygons[e][i]['y']-2,4,4);
    } else {
      this.ctx.lineTo(this.polygons[e][i]['x'],this.polygons[e][i]['y']);
      end || this.point(this.polygons[e][i]['x'],this.polygons[e][i]['y'],false);
      this.ctx.fillStyle = pred_colour;
      this.ctx.fillRect(this.polygons[e][i]['x']-2,this.polygons[e][i]['y']-2,4,4);
    }
  }
  if(end){
    this.ctx.lineTo(this.polygons[e][0]['x'],this.polygons[e][0]['y']);
    this.ctx.closePath();
    if(this.id == 8){
      this.ctx.font = '40px Georgia';
      this.getMid(this.polygons[e],true);
      this.ctx.strokeStyle = pred_colour;
      this.ctx.fillText(e+1,this.x,this.y);
    } 
    this.ctx.fillStyle = pred_fill;
    this.ctx.fill();
    this.ctx.strokeStyle = pred_colour;
    this.created.emit(this.perimeter);
  }
  this.ctx.stroke();
  }
}

<<<<<<< HEAD
=======
info(){
  console.log(this.polygons);
  }

>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
  isOdd(num){
    return num % 2;
  }

comparator(a,b){
  if(a[a.length-1] < b[b.length-1]) return -1;
  if(a[a.length-1] > b[b.length-1]) return 1;
  return 0;
}

get(t){
  let pred_colour, pred_fill;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for(let e = 0; e < this.polygons.length; e++){
    for(let u =0;u<this.algos.length;u++){
    if(this.polygons[e][this.polygons[e].length-1] == u){
      var rgb = this.colo.ran_col(u,this.algos.length);
      pred_colour = 'rgba('+ rgb +',1)';
      pred_fill = 'rgba('+ rgb + ',0.3)';
    }
  }
  this.ctx.lineWidth = 1;
  this.ctx.beginPath();
  if(t == e){
    this.parking = this.polygons[e][this.polygons[e].length - 2];
    this.selected = t;
    this.perimeter = [];
    pred_colour = 'yellow';
    pred_fill = 'rgba(255, 255, 255, 0.3)';
  }
  for(let i = 0; i < this.polygons[e].length; i++){  
    if( i == 0 ){
      this.ctx.moveTo(this.polygons[e][i]['x'],this.polygons[e][i]['y']);
      this.ctx.fillStyle = pred_colour;
      this.ctx.fillRect(this.polygons[e][i]['x']-2,this.polygons[e][i]['y']-2,4,4);
    } else {
      this.ctx.lineTo(this.polygons[e][i]['x'],this.polygons[e][i]['y']);
      this.ctx.fillStyle = pred_colour;
      this.ctx.fillRect(this.polygons[e][i]['x']-2,this.polygons[e][i]['y']-2,4,4);
    }
  }
    this.ctx.lineTo(this.polygons[e][0]['x'],this.polygons[e][0]['y']);
    this.ctx.closePath();
    this.ctx.fillStyle = pred_fill;
    this.ctx.fill();
    this.ctx.strokeStyle = pred_colour;
    this.created.emit(this.perimeter);

  this.ctx.stroke();
  }
}


get_dir(i){
  for(let t = 0; t < this.polygons.length; t++){
    if(t == i){      
      this.wrong0 = this.polygons[t][this.polygons[t].length - 2];
      this.selected = i;
      this.wrong0['id'] = i;
    }
  }
}

@HostListener('document:mousemove', ['$event'])
onMouseMove(e) {
  let x, y, rect, slope, d;
  // console.log(e.clientX+','+e.clientY, this.click);
  d = 200;
   rect = this.canvas.getBoundingClientRect();
   x = e.clientX - rect.left;
   y = e.clientY - rect.top;
   if(this.count == 1){
    let dista = Math.sqrt((this.xin - x)^2 + (this.yin - y)^2)/2
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath(); 
      this.ctx.moveTo(this.xin,this.yin);
      this.point(this.xin,this.yin,true);
      this.ctx.lineTo(x,y);
      this.point((x + this.xin)/2,(y + this.yin)/2,false);
      this.point(x,y,false);
      this.ctx.moveTo((x + this.xin)/2,(y + this.yin)/2);
      slope = (y - this.yin)/(x - this.xin);
      let x2 = ((dista * slope)/Math.sqrt(2)) + (x + this.xin)/2;
      let y2 = (dista* Math.sqrt(1-((slope^2)/2))) + (y + this.yin)/2;
      // this.point(d, ((-d + ((x + this.xin)/2))/slope) + ((y + this.yin)/2), true)
      this.ctx.lineTo(x2,y2);
      this.point(x2,y2,false);
    console.log(x2,y2)
   this.ctx.stroke();
   }
}

count: number = 0;
xin:number;
yin:number;
pc(event){
  let rect;
  rect = this.canvas.getBoundingClientRect();
  this.count ++;
  if(this.count == 1){
    this.xin = event.clientX - rect.left;
    this.yin = event.clientY - rect.top;
  }else if(this.count == 2){
    this.count = 0;
    this.xin = null
    this.yin = null
    
  }
}

saveWrong(){
  if(this.polygons.length >= 2){
    if(this.isOdd(this.polygons.length) == 0){
      this.nSave();
    } else{
      this.showMyMessage4 = true;
      setTimeout(() => {
        this.showMyMessage4 = false
      }, 5000)
    }
  } else{
    this.showMyMessage4 = true;
    setTimeout(() => {
      this.showMyMessage4 = false
    }, 5000)
  }
}

nSave(){
  let data = {};
  const id = this.activatedRoute.snapshot.params.uuid;
  for(let u = 0; u < this.polygons.length; u++){
    for(let l = 0; l < this.polygons[u].length - 1; l++){
      //these parameters is to scalate it according to RoI resolution
      if(this.polygons[u][l]['x'] != undefined){
        this.polygons[u][l]['x'] = this.polygons[u][l]['x']*this.res_width/this.width;
        this.polygons[u][l]['y'] = this.polygons[u][l]['y']*this.res_height/this.height;
      }
    }
  }
  data = {
    rois: this.polygons,
    id: this.id,
    conf: this.atr
  }
  this.facesService.sendRois(id,data).subscribe(
    res => console.log(res),
    err => console.log(err)
  )
}

}