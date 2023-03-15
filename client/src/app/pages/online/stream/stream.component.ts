import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  roomId = 123;
  wsUrl = 'http://52.187.107.229:8088/janus';
}
