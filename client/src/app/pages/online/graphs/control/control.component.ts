import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarRange, NbComponentStatus, NbDateService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Account } from '../../../../models/Account';
import { NbPopoverDirective } from '@nebular/theme';
import { AuthService } from '../../../../services/auth.service';
import { FacesService } from '../../../../services/faces.service';

@Component({
  selector: 'ngx-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild(NbPopoverDirective) rangeSelector: NbPopoverDirective;

  @Input() analytic;
  @Input() cameraId;
  @Input() rel;
  max: Date;
  fin: Date;
  range: NbCalendarRange<Date>;
  camera: string = '';
  // camera = {
  //   name: ''
  // }
  location: string = '';
  reTime: number = 0;
  refresh: number = 0;
  showRange: boolean;
  renew: any;
  timezone: string;
  now_user: Account;
  calMonths: string[] = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  selectedDate: Date;
  selectedMonth: Date;
  lastMonths: Date[] = [];

  currentSelection: string  = 'Date';
  relations: any;
  
  constructor(
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>,
    private authService: AuthService,
    private facesService: FacesService
  ) {
  }

  signOff(){
   const us = JSON.parse(localStorage.getItem('now_user'))['username']
   this.authService.signOut(us).subscribe(
    res=>{
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload()
      // this.router.navigate(['/'])
    }, err =>{ 
      console.error(err)
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload()
      // this.router.navigate(['/'])
    }
)
  }

  @Output() cameraSel = new EventEmitter<string>();

  selectRangeType(type){
    this.currentSelection = type;
  }

  showRangeSelector(show: boolean){
    if (show){
      this.rangeSelector.show();
    }else{
      this.rangeSelector.hide();
    }
  }

  setDate(event){
    this.selectedDate = event
    if (this.selectedDate){
      const start = this.selectedDate;
      // Add one data and minus 1 sec to set time to end of the day
      let end = this.dateService.addDay(start, 1);
      end = new Date(end.getTime() - 1000);
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.showRangeSelector(false);
    }
  }

  setMonth(){
    if (this.selectedMonth){
      const start = this.selectedMonth;
      // Add one month and minus 1 second to go to the end of the month
      let end = this.dateService.addMonth(start, 1);
      end = new Date(end.getTime() - 1000);
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.showRangeSelector(false);

    }

  }

  changeRange(event){
    if (event.end !== undefined){
      this.showRange = false;
      event.end = new Date(event.end.setHours(event.end.getHours() + 23));
      event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 59));
      event.end = new Date(event.end.setSeconds(event.end.getSeconds() + 59));
      this.range = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      this.showRangeSelector(false);
    }else{
      this.showRange = true;
    }
  }

  info: any;


  paths:Number = -1

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    // if(this.now_user.id_branch == '0000'){
    //   this.camera = this.now_user.id_account
    //   this.analytic.algo_id = -2;
    // }
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 59));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    this.range = {
      start: new Date(this.max),
      end: new Date(this.fin),
    };
    this.initMonths();
    this.selectedDate =  this.dateService.addDay(this.dateService.today(), 0);

  }

  initMonths(){
    let t = this.dateService.today();

    // Go to start of the month
    let daysToMinus = t.getDate() - 1;
    daysToMinus *= -1;
    t = this.dateService.addDay(t, daysToMinus);


    this.lastMonths.push(t);
    for (let i = 1; i <= 12; i++){
        const a = -1 * i;
        this.lastMonths.push(this.dateService.addMonth(t, a));
    }

  }

  ngOnDestroy(){
    if (this.renew){
      clearInterval(this.renew);
    }
  }

  ngOnChanges(){
    this.facesService.getRelations(this.cameraId).subscribe(
      res => {
        console.log(res);
        this.relations = res['data'];
      },
      err => console.error(err)
    );
  }


destroyByClick = true;
duration = 4000;
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
  const titleContent = 'Look!';

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
}

}