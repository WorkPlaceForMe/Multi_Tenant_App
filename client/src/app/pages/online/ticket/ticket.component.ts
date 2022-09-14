import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Account } from '../../../models/Account';
import { StatusComponent } from '../status/status.component';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { ReviewComponent } from '../review/review.component';
import { DatePipe } from '@angular/common';
import { SeverityComponent } from '../severity/severity.component';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit, OnDestroy {

  @HostBinding('class') classes = 'row';
  constructor(private accountserv: AccountService, private router: Router, private windowService: NbWindowService, public datepipe: DatePipe,
    private toastrService: NbToastrService, private http: HttpClient) {
      this.router.routeReuseStrategy.shouldReuseRoute = function (){
        return false;
      };
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.router.navigated = false;
        }
      });
    }

    mySubscription: any;

    ngOnDestroy() {
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
      }
    }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    const time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0, 3);
    // this.timezone = parseInt(this.timezone) * 2;
    let p = '';
    if (this.timezone > 0) {
      p = '+';
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
    const a = {
      type: 'id_branch',
      id: this.now_user.id_branch,
    };
    let rol = this.now_user.role;
    if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000') {
      rol = 'branch';
    }
    if (rol === 'branch' || rol === 'user') {
      this.a = {
        type: 'id_branch',
        id: this.now_user.id_branch,
      };
    }else if (rol === 'client') {
      this.a = {
        type: 'id_account',
        id: this.now_user.id_account,
      };
    }
    this.getTickets();
    this.alertsOverview();
  }

  a: object = {};
  timezone: any;
  now_user: Account;
  data: any = [];
  source: ServerDataSource;
  tempSource: ServerDataSource;
  pageSize = 25;
  source1: ServerDataSource; // = new LocalDataSource();
  count: any = {
    st0: 0,  // st0 - Total Alerts remaining
    st1: 0,  // st1 - Total Alerts solved
    l0: 0,   // l0 - low level alerts
    l0r: 0,  // l0r - low level alerts remaining
    l1: 0,   // l1 - Medium level
    l1r: 0,  // l1r - Medium rem
    l2: 0,   // l2 - high level
    l2r: 0,
  };

  stat: string = 'success';
  searchStr: string = '';
  searchFields = [
  {
    value: 'type',
    show: 'Tipo de alerta',
  },
  {
    value: 'assigned',
    show: 'Usuario asignado',
  },
];
  searchWr: string = '';
  show: boolean = false;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      // custom: [{ name: 'routeToAPage', title: `<img src="/icon.png">` }]
      columnTitle: 'Asignar / Actualizar',
      add: false,
    //   edit: true,
    //   delete: true,
    //   custom: [
    //   { name: 'viewrecord', title: '<button nbButton [status]="stat">aaaa<button>'},
    // ],
    },
    pager : {
      display : true,
      perPage: 5,
    },
    edit: {
      editButtonContent: '<i class="fas fa-child"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="far fa-file"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No se han encontrado tickets',
    columns: {
      createdAt: {
        title: 'Ocurrencia',
        type: 'string',
        filter: false,
      },
      updatedAt: {
        title: 'Finalizado',
        type: 'string',
        filter: false,
      },
      type: {
        title: 'Tipo de alerta',
        type: 'string',
        filter: false,
      },
      assigned: {
        title: 'Usuario asignado',
        type: 'string',
        filter: false,
      },
      assignedBy: {
        title: 'Asignado por',
        type: 'string',
        filter: false,
      },
      level: {
        title: 'Severidad',
        type: 'custom',
        filter: false,
        renderComponent: SeverityComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
      status: {
        title: 'Revisado',
        type: 'custom',
        filter: false,
        renderComponent: StatusComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
    },
  };

  check(event) {
    this.show = false;
    if (this.searchStr !== '') {
      this.search(this.searchStr, event);
    }
  }

  search(query: string, searchField: string) {
    if (this.searchWr === '') {
      return this.show = true;
    }else {
      this.show = false;
    }
    this.a['searchField'] = searchField;
    this.a['searchStr'] = this.searchStr;
    // this.source = this.source1.filter(data => data[this.searchWr].includes(query))
    this.source = this.accountserv.searchTickets(this.a);
    if (query === '') {
      // this.source = this.source1;
      this.source = this.accountserv.tickets(this.a);
    }
  }

  getTickets() {
    this.source = this.accountserv.tickets(this.a);
  }

  alertsOverview() {
    this.accountserv.alertsOverview(this.a).subscribe(res => {
      this.count = res['data'];
    });
  }

  /* getTickets() {
    let rol = this.now_user.role;
    let a;
    if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000'){
      rol = 'branch';
    }
    if (rol === 'branch' || rol === 'user'){
      a = {
        type: 'id_branch',
        id: this.now_user.id_branch,
      };
    }else if (rol === 'client'){
      a = {
        type: 'id_account',
        id: this.now_user.id_account,
      };
    }
    this.accountserv.tickets(a).subscribe(
      res => {
        const cli = res;
        for (const a of cli['data']){
          a['createdAt'] = this.datepipe.transform(a['createdAt'], 'yyyy-M-dd HH:mm:ss', this.timezone);
          a['updatedAt'] = this.datepipe.transform(a['updatedAt'], 'yyyy-M-dd HH:mm:ss', this.timezone);
          if (a['createdAt'] === a['updatedAt']){
            a['status'] = 0;
            a['updatedAt'] = '';
          }else{
            a['status'] = 1;
          }
          switch (a['type']){
            case 'loitering': {
              a['type'] = 'Loitering Detection';
              break;
            }
            case 'intrusion': {
              a['type'] = 'Intrusion Detection';
              break;
            }
            case 'aod': {
              a['type'] = 'Abandoned Object Detection';
              break;
            }
          }
          if (a['status'] === 0){
            ++this.count.st0;
          }else if (a['status'] === 1){
            ++this.count.st1;
          }
          if (a['level'] === 0){
            ++this.count.l0;
            if (a['status'] === 0){
              ++this.count.l0r;
            }
          }else if (a['level'] === 1){
            ++this.count.l1;
            if (a['status'] === 0){
              ++this.count.l1r;
            }
          }else if (a['level'] === 2){
            ++this.count.l2;
            if (a['status'] === 0){
              ++this.count.l2r;
            }
          }
        }
        // this.source = cli['data'];
        this.source = cli['data'].slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        this.source1 = this.source;
      },
      err => console.error(err),
    );
  } */

  selected(event): void {
    this.router.navigateByUrl(`pages/tickets/view/${event.data.id}`);
}

  hola1(event): void {
    if (event.data.assigned != null && this.now_user.role === 'user'){
      return this.showToast('Usuario a sido asignado anteriormente.', 'warning');
    }else {
      this.windowService.open(ReviewComponent, { title: `Assign for ${event.data.type}`, context: { type: 'assign', id: event.data.id, assigned: event.data.assigned}});
    }
  }

  hola3(event): void {
    if (event.data.assigned != null && this.now_user.role === 'user'){
     return this.showToast(`Esta tarea a sido finalizada por: ${event.data.reviewed}.`, 'danger');
  }else {
    this.windowService.open(ReviewComponent, { title: `Actualizar ${event.data.type}`, context: { type: 'update' , id: event.data.id, reviewed: event.data.reviewed, date: event.data.createdAt}});
  }
}

destroyByClick = true;
duration = 10000;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
preventDuplicates = false;

private showToast( body: string, status: NbComponentStatus) {
  const config = {
    status: status,
    destroyByClick: this.destroyByClick,
    duration: this.duration,
    hasIcon: this.hasIcon,
    position: this.position,
    preventDuplicates: this.preventDuplicates,
  };
  let titleContent;
  if (status === 'warning') {
    titleContent = 'Warning';
  }else {
    titleContent = 'Danger';
  }

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
}

}
