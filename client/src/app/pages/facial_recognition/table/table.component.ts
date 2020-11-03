import { Component, OnInit, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { ColorsService } from '../../../services/colors';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  logs: Array<log>;
  users:any;
  people: any = [
    [],
    []
  ];

  constructor(private facesService: FacesService, private colo:ColorsService) { }

  displayedColumns: string[] = ['time', 'name', 'zone', 'role'];
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: any;

  // doughnutChartLabels: Label[] = [];
  // doughnutChartData: MultiDataSet = [
  //   []
  // ];
  doughnutChartType: ChartType = 'doughnut';

  ngOnInit() {
    this.facesService.getUsers().subscribe(
      res => {
        this.users = res;
        this.facesService.getFaces().subscribe(
          (res:log[]) => {
            this.logs = res;
              for(let a = 0; a < this.users.length; a ++){
                this.facesService.getAllSchedule(this.users[a].uuid).subscribe(
                  res => {
                    this.users[a]['sched'] = res;
                    for(let e = 0; e < this.users[a]['sched'].length; e ++){
                      delete this.users[a]['sched'][e]['user_id'];
                      delete this.users[a]['sched'][e]['id'];
                    }
                    if(a == this.users.length - 1){
                   console.log(this.users)
                      var whichday;
                      var dat =[];
                      var each = [];
                      var other = [];
                      for(let n = this.logs.length - 1; n >= 0 ; n --){
                        var cont = false;
                        for(let l = 0; l < this.users.length; l++){
                          if(this.logs[n].name == this.users[l].name && this.users[l]['sched'].length != 0){
                            cont = true;
                          }
                        }
                        // if(cont == true){
                        var h = new Date(this.logs[n].time).getDay()
                        const date = new Date(this.logs[n].time).getFullYear() + "/" + new Date(this.logs[n].time).getMonth() + "/" + new Date(this.logs[n].time).getDate();
                        if(h == 0){
                          h = 6
                        }else if(h != 0){
                          h = h - 1;
                        }
                        this.logs[n]['day'] = h;
                        if(date != whichday){
                          whichday = date
                          for(let p = 0; p < this.logs.length; p++){
                            const Ndate = new Date(this.logs[p].time).getFullYear() + "/" + new Date(this.logs[p].time).getMonth() + "/" + new Date(this.logs[p].time).getDate();
                            if(whichday == Ndate){
                              if(each.length == 0){
                                for(let l = 0; l < this.users.length; l++){
                                  if(this.logs[p].name == this.users[l].name && this.users[l]['sched'].length != 0){
                                    each.push({'usr':this.logs[p].name})
                                    var min = JSON.stringify(new Date(this.logs[p].time).getMinutes());
                                    if(min.length == 1){
                                      min = '0' + min;
                                    }
                                    const time = new Date(this.logs[p].time).getHours() + ":" + min;
                                    for(let r = 0; r < this.users[l]['sched'].length; r ++){
                                      if(time >= this.users[l]['sched'][r].leave_time){
                                        this.logs[p].late = 3
                                      }else if (time < this.users[l]['sched'][r].leave_time){
                                        this.logs[p].late = 4
                                      }
                                    }
                                  }else if(this.logs[p].name == this.users[l].name && this.users[l]['sched'].length == 0){                                  
                                    each.push({'usr':this.logs[p].name})
                                        this.logs[p].late = 5
                                  }
                                }
                              }else if(each.length != 0){
                                let alone = 0;
                                for(let x = 0; x < each.length; x ++){
                                  if(this.logs[p].name != each[x]['usr']){
                                    // console.log(this.logs[p].name,each)
                                    alone ++;
                                  }
                                  // console.log(alone, each.length)
                                if(alone == each.length){
                                  for(let l = 0; l < this.users.length; l++){
                                    if(this.logs[p].name == this.users[l].name && this.users[l]['sched'].length != 0){
                                      each.push({'usr':this.logs[p].name})
                                      var min = JSON.stringify(new Date(this.logs[p].time).getMinutes());
                                      if(min.length == 1){
                                        min = '0' + min;
                                      }
                                      const time = new Date(this.logs[p].time).getHours() + ":" + min;
                                      for(let r = 0; r < this.users[l]['sched'].length; r ++){
                                        if(time >= this.users[l]['sched'][r].leave_time){
                                          this.logs[p].late = 3
                                        }else if (time < this.users[l]['sched'][r].leave_time){
                                          this.logs[p].late = 4
                                        }
                                      }
                                    }else if(this.logs[p].name == this.users[l].name && this.users[l]['sched'].length == 0){                                  
                                      each.push({'usr':this.logs[p].name})
                                          this.logs[p].late = 5
                                    }
                                  }
                                }
                              }
                              }
                            }
                        }
                        each = []
                        other = []
                        dat = []
                        }
                        for(let s = 0; s < this.users.length; s ++){
                          if(this.logs[n].name == this.users[s].name && this.users[s]['sched'].length != 0){
                            for(let r = 0; r < this.users[s]['sched'].length; r ++){
                              if(this.logs[n]['day'] == this.users[s]['sched'][r].day){
                                var min = JSON.stringify(new Date(this.logs[n].time).getMinutes());
                                if(min.length == 1){
                                  min = '0' + min;
                                }
                                if(this.logs[n].late == undefined){
                                  if(dat.length == 0){
                                    dat.push({'usr':this.logs[n].name})
                                    var entr = this.users[s]['sched'][r].entrance.split(':')
                                    if(new Date(this.logs[n].time).getHours() <= Number(entr[0])){
                                      this.logs[n].late = 0;
                                    }else if(new Date(this.logs[n].time).getHours() == Number(entr[0]) && new Date(this.logs[n].time).getMinutes() <= Number(entr[1])){
                                      this.logs[n].late = 0;
                                    }else {
                                      this.logs[n].late = 1; 
                                      // console.log(n)
                                    }
                                  }else if(dat.length != 0){
                                    let alone = 0;
                                    for(let x = 0; x < dat.length; x ++){
                                      if(this.logs[n].name != dat[x]['usr']){
                                        alone ++;
                                      }
                                    // if(x == dat.length -1 && alone == dat.length){
                                    //   dat.push({'usr':this.logs[n].name})
                                    //   var entr = this.users[s]['sched'][r].entrance.split(':')
                                    //   if(new Date(this.logs[n].time).getHours() <= Number(entr[0])){
                                    //     this.logs[n].late = 0;
                                    //   }else if(new Date(this.logs[n].time).getHours() == Number(entr[0]) && new Date(this.logs[n].time).getMinutes() <= Number(entr[1])){
                                    //     this.logs[n].late = 0;
                                    //   }else {
                                    //     this.logs[n].late = 1; 
                                    //   }
                                    // }
                                    // if(x == dat.length -1 && alone != dat.length){
                                    //   this.logs[n].late = 2;
                                    // }
                                    if(x == dat.length -1){
                                      if (alone != dat.length){
                                        this.logs[n].late = 2;
                                      }else if(alone == dat.length){
                                        dat.push({'usr':this.logs[n].name})
                                        var entr = this.users[s]['sched'][r].entrance.split(':')
                                        if(new Date(this.logs[n].time).getHours() <= Number(entr[0])){
                                          this.logs[n].late = 0;
                                        }else if(new Date(this.logs[n].time).getHours() == Number(entr[0]) && new Date(this.logs[n].time).getMinutes() <= Number(entr[1])){
                                          this.logs[n].late = 0;
                                        }else {
                                          this.logs[n].late = 1; 
                                        }
                                        x = other.length;
                                      }
                                    }
                                  }
                                  }
                              }
                            }
                          }
                        }else if(this.logs[n].name == this.users[s].name && this.users[s]['sched'].length == 0){
                          // console.log(other,n)
                          if(this.logs[n].late == undefined){
                            if(other.length == 0){
                              this.logs[n].late = 6;
                              other.push({'usr':this.logs[n].name})
                            }else if (other.length != 0){
                              let alone = 0;
                              for(let t =0; t < other.length; t ++){
                                if(this.logs[n].name != other[t]['usr']){
                                  alone ++;
                                }
                                if(t == other.length -1){
                                  if (alone != other.length){
                                    this.logs[n].late = 2;
                                  }else if(alone == other.length){
                                    other.push({'usr':this.logs[n].name})
                                    t = other.length;
                                    this.logs[n].late = 6;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    // }
                  }
                  }                  
                  },
                  err => console.log(err)
                )
              }
              this.countPeople(this.logs)
              for(let w = 0; w < this.people[0].length; w++){
                var rgb = this.colo.ran_col(w,this.users.length)
                    this.donutColors[0].backgroundColor.push('rgba('+ rgb +',1)')
              }
            //  this.dataSource = new MatTableDataSource<log>(this.logs);
            //  this.dataSource.paginator = this.paginator;
            //  this.dataSource.sort = this.sort;
            console.log(this.logs)
          },
          err => console.log(err)
        )
      },
      err => console.log(err)
    )
  }

  public donutColors=[
    {
      backgroundColor: [
        // 'rgba(110, 114, 20, 1)',
        // 'rgba(118, 183, 172, 1)',
        // 'rgba(0, 148, 97, 1)',
        // 'rgba(129, 78, 40, 1)',
        // 'rgba(129, 199, 111, 1)'
    ]
    }
  ];

  countPeople(arr){
    this.people[0] = [];
    this.people[1] = [];
    for(let a = 0; a < arr.length; a ++){
      if(this.people[0].length == 0){
        this.people[0].push(arr[a].name)
      }else if(this.people[0].length != 0){
        let alone = 0;
        for(let e = 0; e < this.people[0].length; e ++){
          if(arr[a].name != this.people[0][e]){
            alone ++
          }
          if(alone == this.people[0].length){
            this.people[0].push(arr[a].name)
          }
        }
      }
    }
    for(let w = 0; w < this.people[0].length; w ++){
      this.people[1][w] = 0;
      for(let a = 0; a < arr.length; a ++){
        if(this.people[0][w] == arr[a].name){
          this.people[1][w] ++;
        }
      }
      this.people[1][w] = this.people[1][w]*100/arr.length;
    }
    // this.doughnutChartLabels = this.people[0];
    // this.doughnutChartData = this.people[1];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.countPeople(this.dataSource.filteredData)
  }

  comparatortime(a,b){
    if(a.time < b.time) return -1;
    if(a.time > b.time) return 1;
    return 0;
  }

}

export interface log {
    time: string;
    name: string;
    zone: string;
    gender: string;
    age_group: string;
    role: string;
    confidence: number;
    late?:number;
    day?:any;
}