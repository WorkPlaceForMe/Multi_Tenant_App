import { Component, Input, OnInit } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';

@Component({
  selector: 'ngx-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  
  constructor() { }

  ngOnInit(): void {
  }

}
