import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarRange, NbComponentStatus, NbDateService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Account } from '../../../../models/Account';
import { NbPopoverDirective } from '@nebular/theme';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'ngx-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit, OnDestroy {

  @ViewChild(NbPopoverDirective) rangeSelector: NbPopoverDirective;

  @Input() analytic;
  @Input() cameras;
  @Input() rel;
  max: Date;
  fin: Date;
  range: NbCalendarRange<Date>;
  camera: string = '';
  // camera = {
  //   name: ''
  // }
  location: string = '';
  reTime: number = 5;
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
  items = [
    {
      title: 'Cameras',
      icon: 'video-outline',
      link:  '/pages/camerasList',
      children: [
        {
          title: 'Add Camera',
          link: '/pages/cameras/add_camera',
          home: true,
        },
        {
          title: 'Cameras List',
          link: '/pages/camerasList',
          home: true,
        },
      ],
    },
    {
      title: 'Tickets',
      icon: 'done-all-outline',
      link: '/pages/tickets',
    },
    {
      title: 'Stored Videos',
      icon: 'film-outline',
      link: '/pages/search/list',
      children: [
        {
          title: 'Video List',
          link: '/pages/search/list',
        },
        {
          title: 'Add Video',
          link: '/pages/search/upload',
        },
      ],
    },
  ];


  constructor(
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>,
    private authService: AuthService,
  ) {
    if (authService.isAdmin){
        this.items = [
          {
            title: 'Accounts',
            icon: 'people-outline',
            link: '/pages/accounts',
          },
        ];
    }


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
      let start = this.selectedDate;
      // Add one data and minus 1 sec to set time to end of the day
      let end = this.dateService.addDay(start, 1);
      end = new Date(end.getTime() - 1000);
      if(new Date(end).getTimezoneOffset() == -530){
        let off = new Date(end).getTimezoneOffset() + 30
        off = off / 60
        end = new Date(end.setHours(end.getHours() - off))
        end = new Date(end.setMinutes(end.getMinutes() + 30));
        start = new Date(start.setHours(start.getHours() - off))
        start = new Date(start.setMinutes(start.getMinutes() + 30));
      }else{
        let off = new Date(end).getTimezoneOffset()
        off = off / 60
        end = new Date(end.setHours(end.getHours() - off))
        start = new Date(start.setHours(start.getHours() - off))
      }
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.cam(this.camera);
      this.showRangeSelector(false);
    }
  }

  setMonth(){
    if (this.selectedMonth){
      let start = this.selectedMonth;
      // Add one month and minus 1 second to go to the end of the month
      let end = this.dateService.addMonth(start, 1);
      end = new Date(end.getTime() - 1000);
      if(new Date(end).getTimezoneOffset() == -530){
        let off = new Date(end).getTimezoneOffset() + 30
        off = off / 60
        end = new Date(end.setHours(end.getHours() - off))
        end = new Date(end.setMinutes(end.getMinutes() + 30));
        start = new Date(start.setHours(start.getHours() - off))
        start = new Date(start.setMinutes(start.getMinutes() + 30));
      }else{
        let off = new Date(end).getTimezoneOffset()
        off = off / 60
        end = new Date(end.setHours(end.getHours() - off))
        start = new Date(start.setHours(start.getHours() - off))
      }
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.cam(this.camera);
      this.showRangeSelector(false);

    }

  }

  changeRange(event){
    if (event.end !== undefined){
      this.showRange = false;
      event.end = new Date(event.end.setHours(event.end.getHours() + 23));
      event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 59));
      event.end = new Date(event.end.setSeconds(event.end.getSeconds() + 59));
      if(new Date(event.end).getTimezoneOffset() == -530){
        let off = new Date(event.end).getTimezoneOffset() + 30
        off = off / 60
        event.end = new Date(event.end.setHours(event.end.getHours() - off))
        event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 30));
        event.start = new Date(event.start.setHours(event.start.getHours() - off))
        event.start = new Date(event.start.setMinutes(event.start.getMinutes() + 30));
      }else{
        let off = new Date(event.end).getTimezoneOffset()
        off = off / 60
        event.end = new Date(event.end.setHours(event.end.getHours() - off))
        event.start = new Date(event.start.setHours(event.start.getHours() - off))
      }
      this.range = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      this.cam(this.camera);
      this.showRangeSelector(false);
    }else{
      this.showRange = true;
    }
  }

  set(event){
    if (this.renew){
      clearInterval(this.renew);
    }
    this.refresh = event * 1000;
    if (event !== 0){
      this.cam(this.camera);
      this.renew = setInterval(() => {
        this.cam(this.camera);
      }, this.refresh);
    }
  }
  info: any;
  cam(event){
    this.cameraSel.emit(event);
    setTimeout(() => {
      if (this.rel !== false){
        if (event === ''){
          // if (this.camera === ''){

          //   return this.showToast('Please choose a camera.', 'info');
          // }
        }else{
          if (this.range.end === undefined){
            return;
          }
          for(const cam of this.cameras){
            if(cam.id == event){
              this.info = cam
            }
          }
          const algo_id = this.analytic.algo_id;
          this.analytic.algo_id = -1;
          setTimeout(() => {
            this.camera = event;    
            this.analytic.algo_id = algo_id;
          }, 50);
        }
      }
    }, 50);
  }

  reload(){
    this.cam(this.camera);
  }

  paths:Number = -1

  reloadPath(num){
    this.paths = num
    this.cam(this.camera);
  }


  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    // if(this.now_user.id_branch == '0000'){
    //   this.camera = this.now_user.id_account
    //   this.analytic.algo_id = -2;
    // }
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    if(new Date(this.max).getTimezoneOffset() == -530){
      let off = new Date(this.max).getTimezoneOffset() + 30
      off = off / 60
      this.max = new Date(this.max.setHours(this.max.getHours() - off))
      this.max = new Date(this.max.setMinutes(this.max.getMinutes() + 30));
    }else{
      let off = new Date(this.max).getTimezoneOffset()
      off = off / 60
      this.max = new Date(this.max.setHours(this.max.getHours() - off))
    }
    const a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 58));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    if(new Date(this.fin).getTimezoneOffset() == -530){
      let off = new Date(this.fin).getTimezoneOffset() + 30
      off = off / 60
      this.fin = new Date(this.fin.setHours(this.fin.getHours() - off))
      this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 30));
    }else{
      let off = new Date(this.fin).getTimezoneOffset()
      off = off / 60
      this.fin = new Date(this.fin.setHours(this.fin.getHours() - off))
    }
    this.range = {
      start: new Date(this.max),
      end: new Date(this.fin),
    };
    this.initMonths();
    this.selectedDate =  this.dateService.addDay(this.dateService.today(), 0);
    this.set(this.reTime)
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
