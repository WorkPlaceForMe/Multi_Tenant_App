import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from '../models/IpServer';
import { api } from '../models/API';


@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {


  // API_URL = '/api';
  API_URL = api;

  getImages(id:string){
    return this.http.get(`${this.API_URL}/image/${id}`);
  }
  postImage(upload:any,id:string){
    return this.http.post(`${this.API_URL}/image/${id}`, upload);
  }
  deleteImage(data:any){
    return this.http.post(`${this.API_URL}/image/`, data);
  }
  constructor(private http: HttpClient) { }
}
