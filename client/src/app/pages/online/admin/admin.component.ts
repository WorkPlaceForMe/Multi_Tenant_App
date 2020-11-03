import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Ng2SmartTableModule, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { Account } from '../../../models/Account';
import { ButtonComponent } from '../button/button.component';
import { NbWindowService } from '@nebular/theme';
import { ChangePassComponent } from '../change-pass/change-pass.component';

@Component({
  selector: 'ngx-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  
  @HostBinding('class') classes ='row';
  constructor(private accountserv: AccountService,private router: Router) { }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.getUsers()
  }

  now_user:Account;
  source:any = new LocalDataSource();
  source1:any = new LocalDataSource();
  

  stat:string = 'success'
  searchStr:string = ''
  searchFields = [
  {
    value: 'username',
    show: 'User Name'
  },
  {
    value: 'email',
    show: 'Email'
  },
  {
    value: 'role',
    show: 'Role'
  },
];
  searchWr:string = '';
  show:boolean = false;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      //custom: [{ name: 'routeToAPage', title: `<img src="/icon.png">` }]
      columnTitle: 'Add User',
    //   add: true,
    //   edit: true,
    //   delete: true,
    //   custom: [
    //   { name: 'viewrecord', title: '<button nbButton [status]="stat">aaaa<button>'},
    // ],
    },
    pager : {
      display : true,
      perPage:5
      },
    add: {
      addButtonContent: '<button nbButton (click)="hola2()" [status]="stat"><i class="nb-plus"></i></button>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    noDataMessage: "No users found",
    columns: {
      username: {
        title: 'User Name',
        type: 'string',
        filter: false
      },
      email: {
        title: 'Email',
        type: 'string',
        filter: false
      },
      role: {
        title: 'Role',
        type: 'string',
        filter: false
      },
      changePs: {
        title: 'Change Password',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
      disabled: {
        title: 'Active',
        type: 'custom',
        filter: false,
        renderComponent: ButtonComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
    },
  };

  check(){
    this.show = false;
    if(this.searchStr != ''){
      this.search(this.searchStr)
    }
  }

  search(query: string){
    if(this.searchWr == ''){
      return this.show = true;
    }else{
      this.show = false;
    }
    this.source = this.source1.filter(data => data[this.searchWr].includes(query))
    if(query == ''){
      this.source = this.source1;
    }
  }

  getUsers(){
    let rol = this.now_user.role
    if(this.now_user.role === 'client' && this.now_user.id_branch != '0000'){
      rol = 'branch'
    }
    this.accountserv.getAccount(rol).subscribe(
      res => {
        let cli = res
        this.source = cli['data'];
        this.source1 = this.source;
      },
      err => console.error(err)
    );
  }

  hola2():void{
    this.router.navigateByUrl('/pages/accounts/add')
  }
  hola1(event): void{
    this.router.navigateByUrl('/pages/accounts/edit/' + event.data.id)
  }
  
  hola3(event): void{
    if(confirm("Do you want to delete "+ event.data.username +" account?")){
    this.accountserv.deleteAccount(event.data.id,event.data.role).subscribe(
      res => {
        console.log(res)
        this.getUsers()
      },
      err => console.error(err)
    );
  }
}
}

@Component({
  selector: 'button-view',
  template: `
    <button class='btn btn-primary btn-block' (click)="openWindowForm()"><i class="fas fa-key"></i></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(private windowService: NbWindowService){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openWindowForm() {
    this.windowService.open(ChangePassComponent, { title: `Change Password for ${this.rowData.username}`, context: { id: this.rowData.id}});
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}
