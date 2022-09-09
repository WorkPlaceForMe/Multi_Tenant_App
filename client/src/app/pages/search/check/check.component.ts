import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements ViewCell, OnInit {

  constructor(
    private face: FacesService,
    ) {
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  change(){
    this.save.emit(this.rowData.added)
    // this.face.disableEnable(this.rowData.id,this.rowData.enabled).subscribe(
    //   res => {
    //   },
    //   err => {
    //     console.error(err);
    //   },
    // );
  }


}