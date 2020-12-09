import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { Account } from '../../../../models/Account';
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

@Component({
  selector: 'ngx-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  queue: any = [];
  player: any;
  now_user: Account;

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router
  ) { }
  source:any = new LocalDataSource();

  ngOnDestroy(){
    if(this.player != undefined){
      this.player.destroy()
      this.face.cameraStop({id: this.camera}).subscribe(
        res =>{
        },
        err=> console.error(err)
      )
    }
  }

  ngOnInit(): void {
<<<<<<< HEAD
    if(api.length <= 1){
=======
    if(api.length <= 4){
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
      setTimeout(()=>{
        this.face.camera({id: this.camera}).subscribe(
          res =>{
            this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
              canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
            })
          },
          err=> console.error(err)
        )
      },500)
    }
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
<<<<<<< HEAD
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'cam_id';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type
    }
      this.serv.queue(this.camera,l).subscribe(
        res=>{
          this.queue = res['data']
          for(var m of this.queue.raw){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/queue/' + m['cam_id'] + '/' + m['picture'])
=======
      this.serv.queue(this.camera,this.range).subscribe(
        res=>{
          this.queue = res['data']
          for(var m of this.queue.raw){
            m['picture']  = api + "/pictures/" + this.now_user['id_account']+'/' + this.now_user['id_branch']+'/queue/' + this.camera+ '/' + m['picture']
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
          }
          this.source = this.queue.raw.slice().sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time))

        },
        err => {
          console.error(err)
          this.queue = undefined;
        }
      )

  }
  got(id){
<<<<<<< HEAD
    this.route.navigate([`/pages/tickets`])
=======
    this.route.navigateByUrl(`/pages/tickets/view/${id.data.id}`)
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
  }
  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'ACTIONS',
      add: false,
      edit: true,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager : {
      display : true,
      perPage:5
      },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: 'PHOTO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
      track_id: {
        title: 'QUEUE NO.',
        type: 'number',
        filter: false
      },
      wait: {
        title: 'WAIT TIME',
        type: 'string',
        filter: false
      }
    },
  };

}

@Component({
  selector: 'button-view',
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}
