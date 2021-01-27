import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  constructor(private face: FacesService,) { }

  ngOnInit(): void {
  }
  results: any;
  query: string;

  search(inp){
    this.face.searchElast(inp).subscribe(
      res =>{
        this.results = JSON.stringify(res)
      },
      err =>{
        console.error(err)
      }
    )
  }

}
