import { Component, OnInit, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(
    private face: FacesService,
    ) { }
  fileName: string;
  up:boolean = false;
  load:boolean = false;
  @ViewChild("fileInput", {static:false}) fileInputVariable: any;
  upload: any = {
    base64: '',
    format: ''
  }
  ngOnInit(): void {
  }

  change(){
    this.fileName = ''
    if(this.fileInputVariable.nativeElement.files.length != 0){
      this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]['name']
    }else{
      this.up = false;
    }
  }
  uploa(){
    this.up = true;
    this.load = true;
    const files = this.fileInputVariable.nativeElement.files[0];
    this.upload.format = this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1]
    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(files);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           binaryString = btoa(binaryString);
           this.upload.base64 = ';base64,' + binaryString
           this.face.uploadVid(this.upload).subscribe(
             res =>{
              this.up = false;
              this.load = false;
               this.fileInputVariable.nativeElement.value = '';
               this.fileName = '';
             },
             err => console.error(err)
           )
           
   }

}
