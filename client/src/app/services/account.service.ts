import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from '../models/API';
import { Account } from '../models/Account';
import { ServerDataSource } from 'ng2-smart-table';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
API_URI = api;
    constructor(private http: HttpClient) { }

  getAccount(role: string) {
    return this.http.get(`${this.API_URI}/users/${role}`);
  }
  addAccount(acc: Account, un_role: string) {
    return this.http.post(`${this.API_URI}/auth/signup/${un_role}`, acc);
  }
  getAlg() {
    return this.http.get(`${this.API_URI}/algorithms/every`);
  }
  editAlgo(id: string, algos: any) {
    return this.http.put(`${this.API_URI}/algorithms/edit/${id}`, algos);
  }
  editAccount(acc: Account, id: string, un_role: string){
    return this.http.put(`${this.API_URI}/edit/${un_role}/${id}`, acc);
  }
  deleteAccount(id: string, un_role: string) {
    return this.http.delete(`${this.API_URI}/delete/${un_role}/${id}`);
  }
  getOneAd(id: string) {
    return this.http.get(`${this.API_URI}/users/getOneAd/${id}`);
  }
  getOne(id: string) {
    return this.http.get(`${this.API_URI}/users/getOne/${id}`);
  }
  changePs(psw: any, id: string) {
    return this.http.put(`${this.API_URI}/changeP/${id}`, psw);
  }
  remaining() {
    return this.http.get(`${this.API_URI}/users/remaining`);
  }
  tickets(some: any) {
    // return this.http.post(`${this.API_URI}/ticket/all`, some);
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URI}/ticket/all?type=${some.type}&id=${some.id}&_sort=createdAt&_order=DESC`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }
  alertsOverview(some: any) {
    return this.http.get(`${this.API_URI}/ticket/alerts/overview?type=${some.type}&id=${some.id}`);
  }
  searchTickets(some: any) {
    // return this.http.post(`${this.API_URI}/ticket/all`, some);
    return new ServerDataSource(this.http, {
      endPoint: `${this.API_URI}/ticket/search/all?type=${some.type}&id=${some.id}&_sort=createdAt
      &_order=DESC&searchField=${some.searchField}&searchStr=${some.searchStr}`,
      dataKey: 'data',
      totalKey: 'total',
    });
  }
  ticketsPeriod(some: any) {
    return this.http.post(`${this.API_URI}/ticket/some/`, some);
  }
  checkTick(id: string, some: any) {
    return this.http.put(`${this.API_URI}/ticket/check/${id}`, some);
  }
  assignTick(id: string, some: any) {
    return this.http.put(`${this.API_URI}/ticket/assign/${id}`, some);
  }
  ticketsCount(some: any) {
    return this.http.post(`${this.API_URI}/ticket/counts/`, some);
  }
  ticketsGet(some: any) {
    return this.http.post(`${this.API_URI}/ticket/some/`, some);
  }
  queueLite(some: any, id: string) {
    return this.http.post(`${this.API_URI}/analytics/queueLite/${id}`, some);
  }
  pcLite(some: any, id: string) {
    return this.http.post(`${this.API_URI}/analytics/pcLite/${id}`, some);
  }
  premises(some: any, id: string) {
    return this.http.post(`${this.API_URI}/analytics/premises/${id}`, some);
  }
  threats(some: any, id: string) {
    return this.http.post(`${this.API_URI}/analytics/threats/${id}`, some);
  }
}
