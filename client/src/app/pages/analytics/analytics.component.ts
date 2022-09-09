import { Component, OnInit } from '@angular/core';
import { ip } from '../../models/IpServer'

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor() { }

  // link:string ='http://'+ ip +':3000'
  link:string ='/grafana'

  ngOnInit() {
  }

}
