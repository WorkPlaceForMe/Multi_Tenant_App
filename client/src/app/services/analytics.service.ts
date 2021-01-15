import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from '../models/API';
import { ServerDataSource } from 'ng2-smart-table';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  // API_URL = '/api';
  API_URL = api + '/analytics/';

  loitering(id: string, dates) {
    return this.http.post(`${this.API_URL}loitering/${id}`, dates);
  }

  loiteringAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}loitering/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }

  violence(id: string, dates) {
    return this.http.post(`${this.API_URL}violence/${id}`, dates);
  }

  intrude(id: string, dates) {
    return this.http.post(`${this.API_URL}intrude/${id}`, dates);
  }

  intrudeAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}intrude/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }

  aod(id: string, dates){
    return this.http.post(`${this.API_URL}aod/${id}`, dates);
  }

  aodAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}aod/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }

  covered(id: string, dates){
    return this.http.post(`${this.API_URL}covered/${id}`, dates);
  }

  coveredAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}covered/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }

  pc(id: string, dates){
    return this.http.post(`${this.API_URL}pc/${id}`, dates);
  }

  social(id: string, dates){
    return this.http.post(`${this.API_URL}social/${id}`, dates);
  }

  socialAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}social/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }

  queue(id: string, dates){
    return this.http.post(`${this.API_URL}queue/${id}`, dates);
  }

  queueAlerts(id: string, data) {
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URL}queue/alerts?type=${data.type}&id=${id}&start=${data.start}&end=${data.end}&_sort=start_time&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
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

  constructor(private http: HttpClient) { }
}
