import { Component, OnInit, HostBinding, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute } from '@angular/router';
import { api } from '../../../models/API';
import { User } from '../../../models/User';
import { AnnotationsService } from '../../../services/annotations.service';

// const URL = '/api/image/';

@Component({
  selector: 'app-images-form',
  templateUrl: './images-form.component.html',
  styleUrls: ['./images-form.component.css']
})
export class ImagesFormComponent implements OnInit{

  @HostBinding('class') classes ='row';

id: string = this.activatedRoute.snapshot.params.id;
@ViewChild("fileInput") fileInputVariable: any;

base64textString: string;
  imagesFiles: any = [];
  fileName:string = "";
  user: User = {
    name: '',
    uuid: ''
  };
  upload: any = {
    base64: '',
    format: ''
  }

  available: boolean = false;
  loading:boolean = false;
  now_user:Account;

  constructor(private facesService: FacesService,  private activatedRoute: ActivatedRoute, private annserv: AnnotationsService) {
  const params = this.activatedRoute.snapshot.params;
  this.facesService.getUser(params.id)
  .subscribe(
    res => {
      this.user = res['data'];
          },
    err => console.error(err)
  )
  }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
       this.getImagesFiles();
  }

  change(){
    this.fileName = ''
    if(this.fileInputVariable.nativeElement.files.length != 0){
      this.available = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]['name']
    }else{
      this.available = false;
    }
  }

  uploa(){
    this.loading = true;
    const files = this.fileInputVariable.nativeElement.files[0];
    this.upload.format = this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1]
    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(files);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           this.base64textString= btoa(binaryString);
           this.base64textString = ';base64,' + this.base64textString
           this.upload.base64 = this.base64textString
           this.annserv.postImage(this.upload,this.id).subscribe(
             res =>{
               this.getImagesFiles();
               this.loading = false;
               this.fileInputVariable.nativeElement.value = '';
               this.fileName = '';
               this.available = false;
             },
             err => console.error(err)
           )
           
   }

  size:any;
  name:any;
  delImages:any = [];


getImagesFiles(){
  const hola = this.activatedRoute.snapshot.params.id;
  this.annserv.getImages(hola).subscribe(
    res => {
      this.imagesFiles = res['data'];
      for(var a of this.imagesFiles){
        a['location'] = api + "/pictures/" + this.now_user['id_account']+'/' + this.now_user['id_branch']+'/pictures/' + hola + '/' + a['name']
      }
    },
    err => console.log(err)
  )
}

  deleteImage(name:string){
    if(confirm('Do you want to delete this image?')){
      let del = {
        user_id : this.id,
        imageName: name
      }
    this.annserv.deleteImage(del).subscribe(
      res =>{
      this.getImagesFiles();
      },
      err => console.error(err)
      )
  }
}

}
