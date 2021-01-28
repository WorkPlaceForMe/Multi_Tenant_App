import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private facesService: FacesService, 
    private activatedRoute: ActivatedRoute
    ) { }

  param = this.activatedRoute.snapshot.params.uuid;
  setting: Object = {};

  algos: any = [
    { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false }, { activated: false },{ activated: false }
  ];
  Aalgos: any = [];
  Balgos: any = [];
  Calgos: any = [];
  actA: number;
  actB: number;
  actC: number;

  ngOnInit(): void {
    this.facesService.getAlgos()
    .subscribe(
      res => {
        for (let i = 0; i < this.algos.length; i++) {
          for (let t = 0; t < res['data'].length; t++) {
            this.algos[i]['available'] = 0;
            if (res['data'][t].id === i) {
              this.algos[i].name = res['data'][t].name;
              this.algos[i].available = res['data'][t].available;
              this.algos[i].id = res['data'][t].id;
            }
            this.algos[i].conf = 95;
            if (this.algos[i]['available'] === 1) {
              if (this.algos[i]['id'] <= 3 || this.algos[i]['id'] === 12 || this.algos[i]['id'] === 14 || this.algos[i]['id'] === 15 || this.algos[i]['id'] === 16 || this.algos[i]['id'] === 17 || this.algos[i]['id'] === 18 || this.algos[i]['id'] === 19 || this.algos[i]['id'] === 20 || this.algos[i]['id'] === 21 || this.algos[i]['id'] === 22 || this.algos[i]['id'] === 23 || this.algos[i]['id'] === 24) {
                this.Calgos.push(this.algos[i]);
              } else if (this.algos[i]['id'] > 3 && this.algos[i]['id'] <= 8 || this.algos[i]['id'] === 13 || this.algos[i]['id'] === 25 || this.algos[i]['id'] === 26 || this.algos[i]['id'] === 27 || this.algos[i]['id'] >= 28 || this.algos[i]['id'] === 29 || this.algos[i]['id'] === 30 || this.algos[i]['id'] === 31 || this.algos[i]['id'] === 32) {
                this.Balgos.push(this.algos[i]);
              } else if (this.algos[i]['id'] > 8 && this.algos[i]['id'] <= 11) { // || this.algos[i]['id'] === 27
              this.Aalgos.push(this.algos[i]);
              }
            }
          }
        }
        this.actA = this.getNbOccur(true, this.Aalgos);
        this.actB = this.getNbOccur(true, this.Balgos);
        this.actC = this.getNbOccur(true, this.Calgos);
      },
      err => console.error(err)
    )
  }

  getNbOccur(boolean: boolean, arr) {
    let occurs = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['activated'] === boolean)
        occurs++;
    }
    return occurs;
  }

}
