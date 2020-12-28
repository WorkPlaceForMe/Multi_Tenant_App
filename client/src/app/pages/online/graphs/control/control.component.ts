import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarRange, NbComponentStatus, NbDateService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Account } from '../../../../models/Account';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'ngx-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
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
  location: string = '';
  reTime: number = 0;
  refresh: number = 0;
  showRange: boolean;
  renew: any;
  timezone: string;
  now_user: Account;
  
  currentSelection: string  = "Date";


  constructor(
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>,
  ) { }

  @Output() cameraSel = new EventEmitter<string>();

  selectRangeType(type){
    this.currentSelection = type;
  }

  showRangeSelector(show: boolean){
    if(show){
      this.rangeSelector.show();
    }else{
      this.rangeSelector.hide();
    }
   
  }

  changeRange(event){
    if(event.end != undefined){
      this.showRange = false;
      event.end = new Date(event.end.setHours(event.end.getHours() + 23))
      event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 59))
      event.end = new Date(event.end.setSeconds(event.end.getSeconds() + 59))
      this.range = {
        start: new Date(event.start),
        end: new Date(event.end)
      }
      this.cam(this.camera)
      this.showRangeSelector(false);
    }else{
      this.showRange = true;
    }
  }

  set(event){
    if(this.renew){
      clearInterval(this.renew);
    }
    this.refresh = event * 1000;
    if(event != 0){
      this.cam(this.camera)
      this.renew = setInterval(()=>{
        this.cam(this.camera)
      },this.refresh)
    }
  }

  cam(event){
    this.cameraSel.emit(event);
    setTimeout(()=>{
      if(this.rel != false){
        if(event === ''){
          if(this.camera == ''){
            return this.showToast('Please choose a camera.', 'info');
          }
        }else{
          if(this.range.end == undefined){
            return;
          }
          let algo_id = this.analytic.algo_id;
          this.analytic.algo_id = -1;
          setTimeout(()=>{            
            this.camera = event;
            this.analytic.algo_id = algo_id
          },50)
        }
      }
    },50)
  }

  reload(){
    this.cam(this.camera)
  }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    // if(this.now_user.id_branch == '0000'){
    //   this.camera = this.now_user.id_account
    //   this.analytic.algo_id = -2;
    // }
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    let a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23))
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 59))
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59))
    this.range = {
      start: new Date(this.max),
      end: new Date(this.fin)
    }
  }

  ngOnDestroy(){
    if(this.renew){
      clearInterval(this.renew);
    }
  }


destroyByClick = true;
duration = 4000;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
preventDuplicates = false;

private showToast( body: string, status:NbComponentStatus) {
  const config = {
    status: status,
    destroyByClick: this.destroyByClick,
    duration: this.duration,
    hasIcon: this.hasIcon,
    position: this.position,
    preventDuplicates: this.preventDuplicates,
  };
  var titleContent = 'Look!';

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
}

}
