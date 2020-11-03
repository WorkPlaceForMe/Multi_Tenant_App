import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';
import { NbWindowRef } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  @Input() type: string;
  @Input() id: string;
  @Input() assigned: string;
  @Input() reviewed: string;
  @Input() date: string;
  now_user: Account;
  users: Array<Account>;
  user: string = '';
  show: boolean = false;
  timezone: any;

  constructor(private accountserv: AccountService, protected windowRef: NbWindowRef,public router: Router) { }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0];
    if(this.type === 'assign'){
      this.getUsers()
    }
  }

  assign(){
    if(this.user == ''){
      return this.show = true;
    }else{
      this.show = false;
      let some = {
        assigned: this.user,
        assignedBy: this.now_user.username
      }
      this.accountserv.assignTick(this.id,some).subscribe(
        res=>{
          this.windowRef.close();
          this.router.navigate(['/pages/tickets'])
        }
      )
    }
  }

  close(){
    this.windowRef.close();
  }

  update(){
    let a = {
      user: this.now_user.username
    }
    this.accountserv.checkTick(this.id,a).subscribe(
      res=>{
        this.windowRef.close();
        this.router.navigate(['/pages/tickets'])
      })
  }

  Nupdate(){
    let a = {
      user: null,
      date: this.date,
      timezone: this.timezone
    }
    this.accountserv.checkTick(this.id,a).subscribe(
      res=>{
        this.windowRef.close();
        this.router.navigate(['/pages/tickets'])
      })
  }

  getUsers(){
    let rol = this.now_user.role
    if(this.now_user.role === 'client' && this.now_user.id_branch != '0000'){
      rol = 'branch'
    }
    this.accountserv.getAccount(rol).subscribe(
      res => {
        this.users = res['data']
        if(this.assigned != null){
          this.user = this.assigned
        }
      },
      err => console.error(err)
    );
  }
}
