import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../../services/faces.service';
import { api } from '../../../models/API';
import { Account } from '../../../models/Account';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  constructor(
    private face: FacesService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
        ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
    query: ['', [Validators.required]],
    });
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    const time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
    this.timezone = parseInt(this.timezone) * 2;
    let p = '';
    if(this.timezone > 0){
      p = '+';
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
  }
  registerForm: FormGroup;
  timezone: any;
  results: Array<any> = [];
  query: string;
  touched: boolean = false;
  loading: boolean = false;
  source: any = new LocalDataSource();
  stuff: Array<any> = [];
  now_user: Account;
  video: boolean = false;

  search(){
    let inp = this.registerForm.controls['query'].value
    this.loading = true;
    this.stuff = []
    this.face.searchElast(inp).subscribe(
      res =>{
        this.loading = false;
        this.touched = true;
        this.results = res['data']
        console.log(this.results)
        for(const m of this.results['hits']){
          if(m._source.time){
          let d = new Date(m['_source'].time)
          if (d.getSeconds() < 10) {
            var se: string = '0' + d.getSeconds();
          } else{
            var se = JSON.stringify(d.getSeconds())
          }
          if (d.getMinutes() < 10) {
            var mi: string = '0' + mi;
          }else {
            var mi = JSON.stringify(d.getMinutes())
          }
          if (d.getHours() < 10) {
            var ho: string = '0' + ho;
          }else {
            var ho = JSON.stringify(d.getHours())
          }
          let a = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "_" + ho + ":" + mi + ":" + se;
          m['_source']['clip_path']  = api + '/pictures/' + this.now_user['id_account'] + '/' + m['_source']['id_branch'] + '/violence/' + m['_source']['cam_id'] + '/' + a + '.mp4';
          m['_source']['pic']  = api + '/pictures/' + this.now_user['id_account'] + '/' + m['_source']['id_branch'] + '/violence/' + m['_source']['cam_id'] + '/' + a + '.mp4#t=0.5';
          m['_source']['time'] = this.datepipe.transform(m['_source']['time'], 'yyyy-M-dd HH:mm:ss', this.timezone);
          this.stuff.push(m._source)
          }
        }
        this.source = this.stuff.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
        // this.source = this.stuff
      },
      err =>{
        this.touched = true;
        console.error(err)
      }
    )
  }

  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  videoFile:string = '';
    pass(ev){
    this.video = true;
    console.log(ev)
    ev = ev.data.clip_path
    this.videoplayer.nativeElement.src = ev;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }

    settings = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: true,
      columnTitle: 'ACTIONS',
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="fas fa-play"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager : {
      display : true,
      perPage: 5,
      },
    noDataMessage: 'No data found',
    columns: {
      picture: {
        title: 'Video',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string)  => {
            this.pass(row);
          });
        },
      },
      time: {
        title: 'Time',
        type: 'string',
        filter: false,
      },
      camera_name: {
        title: 'Camera',
        type: 'string',
        filter: false,
      },
    },
  };
}

@Component({
  selector: 'button-view',
  styles: ['.play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}'],
  template: `
    <div >
      <div style = "width:60px; height: 60px">
        <img [src]="rowData.pic" width='60' height='60'>
      </div>
    </div>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openVideo(){
    this.save.emit(this.rowData.clip_path);
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}