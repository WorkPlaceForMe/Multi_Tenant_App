import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor() { }
  fileName: string;
  up:boolean = false;
  load:boolean = false;
  @ViewChild("fileInput", {static:false}) fileInputVariable: any;
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

}
