import { Component, OnInit, HostBinding } from '@angular/core';
import { Camera } from '../../../models/Camera';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-vid',
  templateUrl: './vid.component.html',
  styleUrls: ['./vid.component.css']
})
export class VidComponent implements OnInit {
  @HostBinding('class') classes ='row';

  camera: Camera = {
    id: '',
    name: '',
    rtsp_in: ''
  };
  values: any = {
    rtsp: 'primary',
    name: 'primary'
  }

  edit : boolean = false;
  submitted: boolean = false;
  is_saving : boolean = false;

  constructor(private facesService: FacesService, private router: Router, private activatedRoute: ActivatedRoute, private toastrService: NbToastrService) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if(params.uuid){
      this.facesService.getCamera(params.uuid)
      .subscribe(
        res =>{
          this.camera = res['data'];
          this.edit = true;
        },
        err => console.error(err)
      )
    }
  }

  saveCamera(){
    this.submitted = true;
    this.values = {
      rtsp: 'primary',
      name: 'primary'
    }
    if(this.camera.name != ''){
      if(this.camera.rtsp_in != ''){
    this.is_saving = true;
    this.facesService.saveCamera(this.camera)
    .subscribe(
      res=>{
        // console.log(res);
        let response = {
          cam_id: res['id']
        };
        this.facesService.doOneImage(response).subscribe(
          res => {
            // console.log(res)
            this.router.navigate(['/pages/cameras/algorithms/'+response['cam_id']]);
          },
          err => {
            // console.error(err)
          this.router.navigate(['/pages/cameras/algorithms/'+response['cam_id']]);
          }
        )
      },
      err => {
        // console.error(err)
        this.is_saving = false;
        if(err.error.type == 'rtsp'){
          this.values.rtsp = 'warning'
        }
        if(err.error.type == 'camera'){
          this.showToast(err.error.message)
        }
      }
    )
  }else{
    this.values.rtsp = 'danger'
  }
  }else{
    this.values.name = 'danger'
  };
}


destroyByClick = true;
duration = 10000;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
preventDuplicates = false;
status: NbComponentStatus = 'warning';

private showToast( body: string) {
  const config = {
    status: this.status,
    destroyByClick: this.destroyByClick,
    duration: this.duration,
    hasIcon: this.hasIcon,
    position: this.position,
    preventDuplicates: this.preventDuplicates,
  };
  const titleContent = 'Warning';

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
}

updateCamera(){
  this.is_saving = true;
  this.facesService.updateCamera(this.camera.id, this.camera)
  .subscribe(
  res => {
    this.router.navigate(['/pages/camerasList']);
  },
  err => console.log(err)
);
}
}
