import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy {

  constructor(private facesService: FacesService) { }

  ngOnInit() {

  }

  ngOnDestroy(){
  }

  printVal(){
    this.looking = true;
    this.pres = true;
    this.no_result = false;
    clearTimeout(this.t);
    clearTimeout(this.ti);
    clearTimeout(this.result);
    clearTimeout(this.searching);

    this.searching = setTimeout(() => {
      this.facesService.searchUsers(this.search).subscribe(  
        res =>{  
            this.users = res;
            this.no_result = false;
            clearTimeout(this.no_res);
            if(this.users == null){
              this.users = [];
            }
            this.result = setTimeout(()=>{
              this.looking = false;
            },3000)
            if(this.users.length == 0){
              this.no_res = setTimeout(()=>{
                this.no_result = true;
                this.looking = false;
              },3000)
            }
    }, err => console.log(err)
      );
    }, 500)
 
    if(this.search == ''){
      clearTimeout(this.searching);
      clearTimeout(this.no_res);
      this.users = [];
    this.t = setTimeout(() => {
      this.no_result = true;
      this.looking = false;
    }, 3000)
  }
  }

users:any =[];

hola(){
}

  @Input() search;
  pres:boolean = false;
  looking:boolean = false;
  time:number = 0;
  min:number = 0;
  esa:any;
  t:any;
  ti:any;
  no_res:any;
  result:any;
  searching:any;
  no_result:boolean = false;

  pressed(){
    this.no_result = false;
    this.looking = true;    
    this.pres = true;
    this.ti = setTimeout(() => {
      if(this.users.length == 0){
        this.no_result = true;
      }
      this.looking = false;
    }, 5000)
  }

}
