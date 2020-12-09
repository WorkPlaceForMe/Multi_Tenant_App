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

<<<<<<< HEAD
  vault(id:string,dates){
    return this.http.post(`${this.API_URL}vault/${id}`, dates);
  }
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

  constructor(private http: HttpClient) { }
}
