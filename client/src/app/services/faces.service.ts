import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { User } from "../models/User";
import { Image } from "../models/Image";
import { Camera } from "../models/Camera";
import { api } from "../models/API";
import { Observable } from "rxjs";
import { Day } from "../models/Day";
import { Relation } from "../models/Relation";

@Injectable({
  providedIn: "root",
})
export class FacesService {
  API_URI = api;
  // API_URI = '/api';
  // API_URI = 'http://'+ ip +':3300/api';
  API_FR = "/api";
  // API_FR = 'http://'+ ip +':3330/api';
  constructor(private http: HttpClient) {}
  sendAlgs(id: string, settings: any) {
    return this.http.post(`${this.API_URI}/camConf/${id}`, settings);
  }
  sendRois(id: string, settings: any) {
    return this.http.post(`${this.API_URI}/roiConf/${id}`, settings);
  }
  info(info: any) {
    return this.http.post(`${this.API_URI}/getInfo`, info);
  }
  doOneImage(camera_id: any) {
    return this.http.post(`${this.API_URI}/cameraImages/`, camera_id);
  }
  doAllImages() {
    return this.http.get(`${this.API_URI}/cameraImages/all`);
  }
  getFaces() {
    return this.http.get(`${this.API_URI}/face`);
  }
  getCount(age: string) {
    return this.http.get(`${this.API_URI}/face/${age}`);
  }
  getCountAge() {
    return this.http.get(`${this.API_URI}/count`);
  }
  getCountEmotion() {
    return this.http.get(`${this.API_URI}/emotion`);
  }
  getSome(uuid: string) {
    return this.http.get(`${this.API_URI}/images/${uuid}`);
  }
  getUsers() {
    return this.http.get(`${this.API_URI}/fr/viewAll`);
  }
  searchUsers(search: string) {
    return this.http.get(`${this.API_URI}/users/search/${search}`);
  }
  getAlgos() {
    return this.http.get(`${this.API_URI}/algorithms`);
  }
  getUser(uuid: string) {
    return this.http.get(`${this.API_URI}/fr/viewOne/${uuid}`);
  }
  deleteUser(uuid: string) {
    return this.http.delete(`${this.API_URI}/fr/delete/${uuid}`);
  }
  deleteImage(id: number) {
    return this.http.delete(`${this.API_URI}/images/${id}`);
  }
  saveUser(user: User) {
    return this.http.post(`${this.API_URI}/fr`, user);
  }
  saveImage(image: Image) {
    return this.http.post(`${this.API_URI}/images`, image);
  }
  updateUser(updateUser: User): Observable<User> {
    return this.http.put(`${this.API_URI}/fr/edit`, updateUser);
  }
  getCameras() {
    return this.http.get(`${this.API_URI}/camera/viewAll`);
  }
  getLiveCameras() {
    return this.http.get(`${this.API_URI}/camera/viewLiveCams`);
  }
  getCamera(uuid: string) {
    return this.http.get(`${this.API_URI}/camera/viewOne/${uuid}`);
  }
  deleteCamera(id: string) {
    return this.http.delete(`${this.API_URI}/camera/delete/${id}`);
  }
  saveCamera(camera: Camera) {
    return this.http.post(`${this.API_URI}/camera`, camera);
  }
  updateCamera(id: string | number, updateCamera: Camera): Observable<Camera> {
    return this.http.put(`${this.API_URI}/camera/edit/${id}`, updateCamera);
  }
  getRelations(uuid: string) {
    return this.http.get(`${this.API_URI}/relations/cam/${uuid}`);
  }
  getAllRelations() {
    return this.http.get(`${this.API_URI}/relations/all`);
  }
  getDashboard() {
    return this.http.get(`${this.API_URI}/relations/dashboards`);
  }
  saveRelation(relation: Relation) {
    return this.http.post(`${this.API_URI}/relations/create`, relation);
  }
  deleteRelation(algo_id: number) {
    return this.http.delete(`${this.API_URI}/relations/del/${algo_id}`);
  }
  updateRelation(id: string, updateRelation: Relation): Observable<Relation> {
    return this.http.put(
      `${this.API_URI}/relations/edit/${id}`,
      updateRelation
    );
  }
  gethm1(start: string, end: string, camera_id: string) {
    return this.http.get(
      `${this.API_URI}/heatmap/date/${start}/${end}/${camera_id}`
    );
  }
  getallhm1(camera_id: string) {
    return this.http.get(`${this.API_URI}/heatmap/all/${camera_id}`);
  }
  getPath(start: string, end: string, camera_id: string) {
    return this.http.get(
      `${this.API_URI}/path/date/${start}/${end}/${camera_id}`
    );
  }
  getallPath(camera_id: string) {
    return this.http.get(`${this.API_URI}/path/all/${camera_id}`);
  }
  saveSchedule(day: Day) {
    return this.http.post(`${this.API_URI}/schedule/`, day);
  }
  updateSchedule(day: Day) {
    return this.http.put(`${this.API_URI}/schedule/${day.user_id}`, day);
  }
  getSchedule(day: Day) {
    return this.http.get(`${this.API_URI}/schedule/${day.user_id}/${day.day}`);
  }
  getAllSchedule(user_id: number) {
    return this.http.get(`${this.API_URI}/schedule/${user_id}`);
  }
  deleteSchedule(user_id: number) {
    return this.http.delete(`${this.API_URI}/schedule/${user_id}`);
  }
  deleteSomeImages(images: any, user_id: string) {
    return this.http.delete(`${this.API_URI}/deleteSome/${user_id}/`, images);
  }
  status() {
    return this.http.get(`${this.API_URI}/readStatus/`);
  }
  killwsstreamffmpeg(ffmpeg_pid: number, number_port_use: number) {
    return this.http.get(
      `${this.API_URI}/KillStreamingFFMPEG/${ffmpeg_pid}/${number_port_use}`
    );
  }
  killwsstreamws(ws_pid: number, port: number, server: boolean) {
    return this.http.get(
      `${this.API_URI}/KillWsStreaming/${ws_pid}/${port}/${server}`
    );
  }
  getPorts() {
    return this.http.get(`${this.API_URI}/getPorts`);
  }
  updtCams(id: string, cam: any) {
    return this.http.put(`${this.API_URI}/cameras/newRt/${id}`, cam);
  }
  getSet(id: string) {
    return this.http.get(`${this.API_URI}/readSet/${id}`);
  }
  sendSet(id: string, settings: any) {
    return this.http.post(`${this.API_URI}/saveSet/${id}`, settings);
  }
  checkFaces(root) {
    return this.http.get(`${this.API_URI}/chkFcs/${root}`);
  }
  readErr(root) {
    return this.http.get(`${this.API_URI}/readErr/${root}`);
  }
  initiateSys() {
    return this.http.get(`${this.API_URI}/startCams/`);
  }
  stopSys() {
    return this.http.get(`${this.API_FR}/stopAll/`);
  }
  readStreams() {
    return this.http.get(`${this.API_URI}/getStr/`);
  }
  mess() {
    return this.http.get(`${this.API_URI}/auth/check`);
  }
  camera(id) {
    return this.http.post(`${this.API_URI}/camera/play/`, id);
  }
  cameraStop(id) {
    return this.http.post(`${this.API_URI}/camera/stop/`, id);
  }
  checkRel(id) {
    return this.http.post(`${this.API_URI}/camera/checkRel/`, id);
  }
  checkVideo(id: number, cam: string) {
    return this.http.get(`${this.API_URI}/relations/check/${id}/${cam}`);
  }
  saveElast(query: string) {
    return this.http.get(`${this.API_URI}/elastic/save/${query}`);
  }
  searchElast(params: any) {
    // let params;
    // if(dates){
    //   params = new HttpParams().set('query',query).set('dates',dates)
    // }else {
    //   params = new HttpParams().append('query',query)
    // }
    // console.log(params)
    return this.http.post(`${this.API_URI}/elastic/search/`, params);
  }
  getImagesElast() {
    return this.http.get(`${this.API_URI}/elastic/images/`);
  }
  viewVids() {
    return this.http.get(`${this.API_URI}/elastic/video/list`);
  }
  delVid(data) {
    return this.http.post(`${this.API_URI}/elastic/video/delete/`, data);
  }
}
