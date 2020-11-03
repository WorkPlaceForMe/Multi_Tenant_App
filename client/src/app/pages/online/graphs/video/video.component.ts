import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  constructor() { }

  @Input() path: any;
  @ViewChild('videoPlayer') videoplayer: any;

  ngOnInit(): void {
    console.log(this.path)
  }

  playVideo(event) {
    console.log(event)
    event.toElement.play()
 }

}
