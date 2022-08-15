import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'ngx-window-opener',
  template: `<button class='btn btn-warning btn-block' (click)="openWindowForm()"><i class="fas fa-play"></i></button>`,
})
export class WindowOpenerComponent implements OnInit {
  renderValue: string;

  constructor(private windowService: NbWindowService){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openWindowForm() {
    this.windowService.open(VideoComponent, { title: `Play Incident of ${this.rowData.camera_name || this.rowData.cam_name}`, context: { data: this.rowData}});
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}