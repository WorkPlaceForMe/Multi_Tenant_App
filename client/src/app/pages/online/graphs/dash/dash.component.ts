import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'ngx-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit , OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  tickets: any = [];
  player: any;
  now_user: Account;

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AccountService,
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
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'id_branch';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type
    }
      this.serv.ticketsPeriod(l).subscribe(
        res=>{
          this.tickets = res['data']
          console.log(res)
          // for(var m of this.tickets.raw){
          //   m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/tickets/' + m['cam_id'] + '/' + m['picture'])
          // }
          // this.source = this.tickets.raw.slice().sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time))

        },
        err => {
          console.error(err)
          this.tickets = undefined;
        }
      )

  }
  got(id){
    this.route.navigate([`/pages/tickets`])
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
