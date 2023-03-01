import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-severity',
  templateUrl: './severity.component.html',
  styleUrls: ['./severity.component.scss']
})
export class SeverityComponent implements OnInit {

  constructor() { }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  val: string;

  ngOnInit() {
    if(this.rowData.severity == undefined){
      this.val = this.rowData.level
    }else if(this.rowData.level == undefined){
      this.val = this.rowData.severity
    }
    if(this.rowData.alert_type !== undefined){
      this.val = JSON.stringify(this.rowData.alert_type - 1)
    }
  }
}
