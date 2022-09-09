import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  now_user: any = null;
  date:any;
  dateMessage: string;
  remaining:  any = {
    cameras: 0,
    analytics: 0
  }
  constructor(private AccountService:AccountService) { }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    let currentDate = new Date();
    this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();

    this.date = setInterval(()=>{
      let currentDate = new Date();
      this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    }, 1000);
    if(this.now_user.role != 'user' && this.now_user.role != 'admin'){
      this.AccountService.remaining().subscribe(
        res=>{
          this.remaining = res['data']
        }
      )
    }
    }


  ngOnDestroy(){
    if(this.date){
      clearInterval(this.date);
    }
  }
}
