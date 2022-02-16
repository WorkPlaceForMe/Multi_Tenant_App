import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from '../models/API';


@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  // API_URL = '/api';
  API_URL = api + '/analytics/';

  loitering(id: string, dates){
    return this.http.post(`${this.API_URL}loitering/${id}`, dates);
  }

  violence(id: string, dates){
    return this.http.post(`${this.API_URL}violence/${id}`, dates);
  }

  intrude(id: string, dates){
    return this.http.post(`${this.API_URL}intrude/${id}`, dates);
  }

  aod(id: string, dates){
    return this.http.post(`${this.API_URL}aod/${id}`, dates);
  }

  covered(id: string, dates){
    return this.http.post(`${this.API_URL}covered/${id}`, dates);
  }

  pc(id: string, dates){
    return this.http.post(`${this.API_URL}pc/${id}`, dates);
  }

  social(id: string, dates){
    return this.http.post(`${this.API_URL}social/${id}`, dates);
  }

  queue(id: string, dates){
    return this.http.post(`${this.API_URL}queue/${id}`, dates);
  }

  helm(id: string, dates){
    return this.http.post(`${this.API_URL}helm/${id}`, dates);
  }

  vault(id: string, dates){
    return this.http.post(`${this.API_URL}vault/${id}`, dates);
  }

  parking(id: string, dates){
    return this.http.post(`${this.API_URL}parking/${id}`, dates);
  }

  anpr(id: string, dates){
    return this.http.post(`${this.API_URL}anpr/${id}`, dates);
  }

  barrier(id: string, dates){
    return this.http.post(`${this.API_URL}barrier/${id}`, dates);
  }

  vehicle(id: string, dates){
    return this.http.post(`${this.API_URL}vehicle/${id}`, dates);
  }

  tamper(id: string, dates){
    return this.http.post(`${this.API_URL}tamper/${id}`, dates);
  }

  animal(id: string, dates){
    return this.http.post(`${this.API_URL}animal/${id}`, dates);
  }

  accident(id: string, dates){
    return this.http.post(`${this.API_URL}accident/${id}`, dates);
  }

  axle(id: string, dates){
    return this.http.post(`${this.API_URL}axle/${id}`, dates);
  }

  carmake(id: string, dates){
    return this.http.post(`${this.API_URL}carmake/${id}`, dates);
  }

  plate(id: string, dates){
    return this.http.post(`${this.API_URL}plate/${id}`, dates);
  }

  vcount(id: string, dates){
    return this.http.post(`${this.API_URL}vcount/${id}`, dates);
  }

  direction(id: string, dates){
    return this.http.post(`${this.API_URL}direction/${id}`, dates);
  }

  speeding(id: string, dates){
    return this.http.post(`${this.API_URL}speeding/${id}`, dates);
  }
  fr(id: string, dates){
    return this.http.post(`${this.API_URL}fr/${id}`, dates);
  }
  cloth(id: string, dates){
    return this.http.post(`${this.API_URL}cloth/${id}`, dates);
  }
  pcOnView(id: string, dates){
    return this.http.post(`${this.API_URL}pcOnView/${id}`, dates);
  }
  brand(id: string, dates){
    return this.http.post(`${this.API_URL}brand/${id}`, dates);
  }
  fire(id: string, dates){
    return this.http.post(`${this.API_URL}fire/${id}`, dates);
  }
  collapse(id: string, dates){
    return this.http.post(`${this.API_URL}collapse/${id}`, dates);
  }
  weapon(id: string, dates){
    return this.http.post(`${this.API_URL}weapon/${id}`, dates);
  }
  bottle(id: string, dates){
    return this.http.post(`${this.API_URL}bottle/${id}`, dates);
  }
  wavingHands(id: string, dates){
    return this.http.post(`${this.API_URL}wavingHands/${id}`, dates);
  }
  smoking(id: string, dates){
    return this.http.post(`${this.API_URL}smoking/${id}`, dates);
  }
  slapping(id: string, dates){
    return this.http.post(`${this.API_URL}slapping/${id}`, dates);
  }
  running(id: string, dates){
    return this.http.post(`${this.API_URL}running/${id}`, dates);
  }
  pushing(id: string, dates){
    return this.http.post(`${this.API_URL}pushing/${id}`, dates);
  }
  purse(id: string, dates){
    return this.http.post(`${this.API_URL}purse/${id}`, dates);
  }
  pullingHair(id: string, dates){
    return this.http.post(`${this.API_URL}pullingHair/${id}`, dates);
  }
  following(id: string, dates){
    return this.http.post(`${this.API_URL}following/${id}`, dates);
  }
  disrobing(id: string, dates){
    return this.http.post(`${this.API_URL}disrobing/${id}`, dates);
  }
  crowd(id: string, dates){
    return this.http.post(`${this.API_URL}crowd/${id}`, dates);
  }
  blocking(id: string, dates){
    return this.http.post(`${this.API_URL}blocking/${id}`, dates);
  }
  constructor(private http: HttpClient) { }
}
