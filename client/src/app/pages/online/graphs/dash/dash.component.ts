import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbDateService, NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { AccountService } from '../../../../services/account.service';
import { SeverityComponent } from '../../severity/severity.component';

@Component({
  selector: 'ngx-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss', '../smart-table.scss'],
  providers: [DatePipe]
})
export class DashComponent implements OnInit , OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  tickets: any = [];
  player: any;
  now_user: Account;
  queue: any = {}
  pc: any = {}
  counts = {
    aod: {type: "", count: 0},
    loit: {type: "", count: 0},
    vault: {type: "", count: 0},
    violence: {type: "", count: 0},
    helm: {type: "", count: 0},
    noMask: {type: "", count: 0},
    social: {type: "", count: 0},
    intr: {type: "", count: 0}
  }

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AccountService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
    protected dateService: NbDateService<Date>,
  ) { }
  source:any = new LocalDataSource();
  max: Date;
  fin: Date;

  themeSubscription: any;
  dataPre: any;
  optionsPre: any;
  dataThr: any;
  optionsThr: any;
  dataBPre: any;
  optionsBPre: any;
  dataBThr: any;
  optionsBThr: any;
  premises: any;
  threats: any;

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
    var type;
    if(this.now_user.id_branch != '0000'){
      type = 'id_branch';
    }else{
      type = 'id_account'
    }
    // var l = {
    //   start: this.range.start,
    //   end: this.range.end,
    //   type: type
    // }
    const a = {
      type: 'id_branch',
      id: this.now_user.id_branch,
      cam: this.camera,
      range: {},
      order : 'DESC'
    };
    
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const b = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(b.setHours(b.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 58));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    
    if(this.range.end.getTime() === this.fin.getTime() && this.range.start.getTime() === this.max.getTime() && this.camera === ''){
      this.source = this.serv.tickets(a)
    }else if(this.range.end.getTime() === this.fin.getTime() && this.range.start.getTime() === this.max.getTime()){
      a.cam = this.camera
      this.source = this.serv.tickets(a)
    }else {
      a.cam = this.camera
      a.range = this.range
      this.source = this.serv.tickets(a)
    }
    // this.serv.ticketsGet(l).subscribe(res=>{
    //   // this.source = res['data']['raw']
    // },err=> console.error(err))
    //   this.serv.ticketsCount(l).subscribe(
    //     res=>{
    //       this.tickets = res['data']
    //       this.counts.aod = this.tickets.count.find(element => element.type === 'aod');
    //       this.counts.loit = this.tickets.count.find(element => element.type === 'loitering');
    //       this.counts.vault = this.tickets.count.find(element => element.type === 'vault');
    //       this.counts.violence = this.tickets.count.find(element => element.type === 'violence');
    //       this.counts.helm = this.tickets.count.find(element => element.type === 'helm');
    //       this.counts.noMask = this.tickets.count.find(element => element.type === 'noMask');
    //       this.counts.social = this.tickets.count.find(element => element.type === 'sociald');
    //       this.counts.intr = this.tickets.count.find(element => element.type === 'intrusion');

    //       if(this.now_user.id_branch != '0000'){
    //         type = 'cam_id';
    //       }else{
    //         type = 'id_branch'
    //       }
    //       l = {
    //         start: this.range.start,
    //         end: this.range.end,
    //         type: type
    //       }
    //       this.serv.queueLite(l,this.camera).subscribe(
    //         res=>{
    //           this.queue = res['data']
    //           this.serv.pcLite(l,this.camera).subscribe(
    //             res=>{
    //               this.pc = res['data']
    //               this.serv.premises(l,this.camera).subscribe(
    //                 res=>{
    //                   this.premises = res['data']
    //                   this.serv.threats(l,this.camera).subscribe(
    //                     res=>{
    //                       this.threats = res['data']

    //       this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            
    //         const colors: any = config.variables;
    //         const chartjs: any = config.variables.chartjs;
      
    //         this.optionsBPre = {
    //           maintainAspectRatio: false,
    //           responsive: true,
    //           legend: {
    //             labels: {
    //               fontColor: chartjs.textColor,
    //             },
    //           },
    //           scales: {
    //             xAxes: [
    //               {
    //                 stacked: true,
    //                 gridLines: {
    //                   display: false,
    //                   color: chartjs.axisLineColor,
    //                 },
    //                 ticks: {
    //                   fontColor: chartjs.textColor,
    //                 },
    //               },
    //             ],
    //             yAxes: [
    //               {
    //                 stacked: true,
    //                 gridLines: {
    //                   display: true,
    //                   color: chartjs.axisLineColor,
    //                 },
    //                 ticks: {
    //                   fontColor: chartjs.textColor,
    //                 },
    //               },
    //             ],
    //           },
    //         };

    //         this.dataPre = {
    //           labels: Object.keys(this.premises.loit),
    //           datasets: [{
    //             label: 'People Count',
    //             data: Object.values(this.premises.pcount),
    //             borderColor: colors.primary,
    //             backgroundColor: colors.primary,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Queue Management',
    //             data: Object.values(this.premises.queue),
    //             borderColor: colors.success,
    //             backgroundColor: colors.success,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Loitering',
    //             data: Object.values(this.premises.loit),
    //             borderColor: colors.danger,
    //             backgroundColor: colors.danger,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Vault Door',
    //             data: Object.values(this.premises.vault),
    //             borderColor: colors.warning,
    //             backgroundColor: colors.warning,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           }
    //         ],
    //         };
      
    //         this.optionsPre = {
    //           responsive: true,
    //           maintainAspectRatio: false,
    //           legend: {
    //             display: true,
    //             position: 'bottom',
    //             labels: {
    //               fontColor: chartjs.textColor,
    //             },
    //           },
    //           hover: {
    //             mode: 'index',
    //           },
    //           scales: {
    //             xAxes: [
    //               {
    //                 display: false,
    //                 scaleLabel: {
    //                   display: false,
    //                   labelString: 'Month',
    //                 },
    //                 gridLines: {
    //                   display: true,
    //                   color: chartjs.axisLineColor,
    //                 },
    //                 ticks: {
    //                   fontColor: chartjs.textColor,
    //                 },
    //               },
    //             ],
    //             yAxes: [
    //               {
    //                 display: true,
    //                 scaleLabel: {
    //                   display: false,
    //                   labelString: 'Value',
    //                 },
    //                 gridLines: {
    //                   display: true,
    //                   color: chartjs.axisLineColor,
    //                 },
    //                 ticks: {
    //                   fontColor: chartjs.textColor,
    //                 },
    //               },
    //             ],
    //           },
    //         };


    //         this.dataThr = {
    //           labels: Object.keys(this.threats.violence),
    //           datasets: [{
    //             label: 'Violence',
    //             data: Object.values(this.threats.violence),
    //             borderColor: colors.primary,
    //             backgroundColor: colors.primary,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Helmet',
    //             data: Object.values(this.threats.helmet),
    //             borderColor: colors.success,
    //             backgroundColor: colors.success,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Covered Face',
    //             data: Object.values(this.threats.covered),
    //             borderColor: colors.danger,
    //             backgroundColor: colors.danger,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Unattended Object',
    //             data: Object.values(this.threats.aod),
    //             borderColor: colors.warning,
    //             backgroundColor: colors.warning,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Social Distancing',
    //             data: Object.values(this.threats.social),
    //             borderColor: colors.info,
    //             backgroundColor: colors.info,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           },{
    //             label: 'Intrusions',
    //             data: Object.values(this.threats.intr),
    //             borderColor: colors.warning,
    //             backgroundColor: colors.warning,
    //             fill: false,
    //             pointRadius: 2,
    //             pointHoverRadius: 5,
    //           }
    //         ],
    //         };
      
    //       })            
    //                     },
    //                     err =>{
    //                       console.error(err)
    //                     }
    //                   )
    //                 },
    //                 err =>{
    //                   console.error(err)
    //                 }
    //               )
    //             },
    //             err =>{
    //               console.error(err)
    //             }
    //           )
    //         },
    //         err =>{
    //           console.error(err)
    //         }
    //       )
    //     },
    //     err => {
    //       console.error(err)
    //       this.tickets = undefined;
    //     }
    //   )

  }
  

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  videoFile:string = "";
  
  pass(vid:string){
    this.videoplayer.nativeElement.src = vid    
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }

  got(id){
    this.route.navigate([`/pages/tickets`])
  }
  
  settings = {
    mode: 'external',
    actions: false,
    pager: {
      perPage: 50
    },
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    noDataMessage: "No se a encontrado data",
    columns: {
      type: {
        title: 'Tipo de incidente',
        type: 'string',
        filter: false
      },
      createdAt: {
        title: 'Hora',
        type: 'string',
        filter: false,
        valuePrepareFunction: (createdAt) => {
          return this.datepipe.transform(new Date(createdAt), 'yyyy-M-dd HH:mm','-0300');
        }
      },
      cam_name: {
        title: 'Camara',
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
    },  

  };

}