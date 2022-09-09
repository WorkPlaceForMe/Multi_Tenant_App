import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  constructor() { }

  @Input() path: any;
  @Input() data: any;
  @ViewChild('videoPlayer') videoplayer: any;

  ngOnInit(): void {
  }

  playVideo(event) {
    event.toElement.play()
 }

}
