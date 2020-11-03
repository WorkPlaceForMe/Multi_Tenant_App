import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from '../models/API';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  // API_URL = '/api';
  API_URL = api + "/analytics/";

  loitering(id:string,dates){
    return this.http.post(`${this.API_URL}loitering/${id}`, dates);
  }

  violence(id:string,dates){
    return this.http.post(`${this.API_URL}violence/${id}`, dates);
  }

  intrude(id:string,dates){
    return this.http.post(`${this.API_URL}intrude/${id}`, dates);
  }

  aod(id:string,dates){
    return this.http.post(`${this.API_URL}aod/${id}`, dates);
  }

  covered(id:string,dates){
    return this.http.post(`${this.API_URL}covered/${id}`, dates);
  }

  pc(id:string,dates){
    return this.http.post(`${this.API_URL}pc/${id}`, dates);
  }

  social(id:string,dates){
    return this.http.post(`${this.API_URL}social/${id}`, dates);
  }

  queue(id:string,dates){
    return this.http.post(`${this.API_URL}queue/${id}`, dates);
  }

  helm(id:string,dates){
    return this.http.post(`${this.API_URL}helm/${id}`, dates);
  }


  constructor(private http: HttpClient) { }
}
