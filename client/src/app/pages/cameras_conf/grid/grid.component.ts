import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FacesService } from '../../../services/faces.service';
import { Camera } from '../../../models/Camera';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

    link: SafeResourceUrl;
    camera: Camera;
    width:number;
    height:number;
    resRelation: number;
    res_width:number;
    res_height:number;
    gr:number;
    stuff:any;

  constructor(sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private facesService: FacesService) {
    const params = this.activatedRoute.snapshot.params;
    
    this.facesService.getSet(params.id).subscribe(
      res => {
        this.stuff = res
        if(this.stuff != "don't exist"){
          this.stuff = JSON.parse(this.stuff)
          this.x = this.stuff.angle;
          this.mx = this.stuff.posX - 25;
          this.my = this.stuff.posY - 6;
        }
        console.log(this.stuff)
      },
      err => console.log(err)
    )

    this.facesService.getCamera(params.id).subscribe(
      res =>{
        this.camera = res;
        this.res_width = this.camera.cam_width;
        this.res_height =this.camera.cam_height;
        this.resRelation = this.res_height / this.res_width;
        if(window.innerWidth >= 1200){
          this.width = 835;
          this.gr = 450;
          this.height = this.width*this.res_height/this.res_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.res_width/this.res_height;
        }
        }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
          this.width = 684;
          this.gr = 400;
          this.height = this.width*this.res_height/this.res_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.res_width/this.res_height;
        }
        }else if(window.innerWidth < 992 && window.innerWidth >= 768){
          this.width = 490;
          this.height = this.width*this.res_height/this.res_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.res_width/this.res_height;
        }
        }else if(window.innerWidth < 768 && window.innerWidth >= 576){
          this.width = 420;
          this.height = this.width*this.res_height/this.res_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.res_width/this.res_height;
        }
        }else if(window.innerWidth < 576){
          this.width = window.innerWidth - 140;
          this.height = this.width*this.res_height/this.res_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.res_width/this.res_height;
        }
        }
        this.link = sanitizer.bypassSecurityTrustUrl(this.camera.heatmap_pic);
      },
      err => console.error(err)
    );
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth >= 1200){
      this.width = 835;
      this.gr = 450;
      this.height = this.width*this.res_height/this.res_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.res_width/this.res_height;
    }
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.width = 684;
      this.gr = 400;
      this.height = this.width*this.res_height/this.res_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.res_width/this.res_height;
    }
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.width = 490;
      this.height = this.width*this.res_height/this.res_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.res_width/this.res_height;
    }
    }else if(window.innerWidth < 768 && window.innerWidth >= 576){
      this.width = 420;
      this.height = this.width*this.res_height/this.res_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.res_width/this.res_height;
    }
    }else if(window.innerWidth < 576){
      this.width = window.innerWidth - 140;
      this.height = this.width*this.res_height/this.res_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.res_width/this.res_height;
    }
  }
  }

save(){
  const params = this.activatedRoute.snapshot.params;
  let thing = {
    'angle': this.x,
    'posX': this.mx + 25,
    'posY': this.my + +6
  }
this.facesService.sendSet(params.id,thing).subscribe(
  res => console.log(res),
  err => console.log(err)
)
}

  x:number = 60;
  y:number = 0;
  z:number = 45;
  mx:number = -25;
  my:number = -6;


  // move(){
  //   let styles = {
  //     'top': '100px',
  //     'border-style': 'solid',
  //     'border-width': '1px',
  //     'border-color': 'black',
  //     'perspective': this.pos +'px',
  //     'transform': 'rotateX(70deg)'
  //   };
  //   console.log(this.pos+"0")
  //   return styles;
  // }

  classe(){
    let newClass ={
      'position': 'relative',
      'width': '400px',
      'height': '400px',
      'top': this.my +'0px',
      'left': this.mx +'0px',
      'transform-style': 'preserve-3d',
      'transition': 'all 500ms ease-in',
      'transform': 'rotateY('+ this.y +'deg) rotateX('+ this.x +'deg) rotateZ('+ this.z +'deg)',
      'cursor': 'pointer',
      'margin-right': '30px',
      'display': 'inline-block',
      'margin-left': '30%',
    }
    return newClass;
  }

  the() {
    let nc ={
    'border-style': 'solid',
    'border-width': '1px',
    'border-color': 'black',
    'position': 'absolute',
    'width': this.gr+'px',
    'height': this.gr+'px',
    'transform': 'translateZ(16px)',
    }
    return nc;
}

  ngOnInit() {
    // setInterval(()=>{
    //   console.log(this.pos)
    // },1000)
  }

}
