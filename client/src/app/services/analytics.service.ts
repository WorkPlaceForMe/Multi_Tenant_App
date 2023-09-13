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
    return this.http.post(`${this.API_URL}2/${id}`, dates);
  }

  violence(id: string, dates){
    return this.http.post(`${this.API_URL}19/${id}`, dates);
  }

  intrude(id: string, dates){
    return this.http.post(`${this.API_URL}17/${id}`, dates);
  }

  aod(id: string, dates){
    return this.http.post(`${this.API_URL}16/${id}`, dates);
  }

  covered(id: string, dates){
    return this.http.post(`${this.API_URL}20/${id}`, dates);
  }

  pc(id: string, dates){
    return this.http.post(`${this.API_URL}12/${id}`, dates);
  }

  social(id: string, dates){
    return this.http.post(`${this.API_URL}21/${id}`, dates);
  }

  queue(id: string, dates){
    return this.http.post(`${this.API_URL}22/${id}`, dates);
  }

  helm(id: string, dates){
    return this.http.post(`${this.API_URL}6/${id}`, dates);
  }

  vault(id: string, dates){
    return this.http.post(`${this.API_URL}24/${id}`, dates);
  }

  parking(id: string, dates){
    return this.http.post(`${this.API_URL}4/${id}`, dates);
  }

  anpr(id: string, dates){
    return this.http.post(`${this.API_URL}13/${id}`, dates);
  }

  barrier(id: string, dates){
    return this.http.post(`${this.API_URL}25/${id}`, dates);
  }

  vehicle(id: string, dates){
    return this.http.post(`${this.API_URL}26/${id}`, dates);
  }

  tamper(id: string, dates){
    return this.http.post(`${this.API_URL}27/${id}`, dates);
  }

  animal(id: string, dates){
    return this.http.post(`${this.API_URL}28/${id}`, dates);
  }

  accident(id: string, dates){
    return this.http.post(`${this.API_URL}29/${id}`, dates);
  }

  axle(id: string, dates){
    return this.http.post(`${this.API_URL}30/${id}`, dates);
  }

  carmake(id: string, dates){
    return this.http.post(`${this.API_URL}31/${id}`, dates);
  }

  plate(id: string, dates){
    return this.http.post(`${this.API_URL}plate/${id}`, dates);
  }

  vcount(id: string, dates){
    return this.http.post(`${this.API_URL}33/${id}`, dates);
  }

  direction(id: string, dates){
    return this.http.post(`${this.API_URL}8/${id}`, dates);
  }

  speeding(id: string, dates){
    return this.http.post(`${this.API_URL}5/${id}`, dates);
  }
  fr(id: string, dates){
    return this.http.post(`${this.API_URL}0/${id}`, dates);
  }
  cloth(id: string, dates){
    return this.http.post(`${this.API_URL}32/${id}`, dates);
  }
  pcOnView(id: string, dates){
    return this.http.post(`${this.API_URL}pcOnView/${id}`, dates);
  }
  brand(id: string, dates){
    return this.http.post(`${this.API_URL}34/${id}`, dates);
  }
  fire(id: string, dates){
    return this.http.post(`${this.API_URL}39/${id}`, dates);
  }
  collapse(id: string, dates){
    return this.http.post(`${this.API_URL}38/${id}`, dates);
  }
  weapon(id: string, dates){
    return this.http.post(`${this.API_URL}35/${id}`, dates);
  }
  bottle(id: string, dates){
    return this.http.post(`${this.API_URL}36/${id}`, dates);
  }
  wavingHands(id: string, dates){
    return this.http.post(`${this.API_URL}41/${id}`, dates);
  }
  smoking(id: string, dates){
    return this.http.post(`${this.API_URL}42/${id}`, dates);
  }
  slapping(id: string, dates){
    return this.http.post(`${this.API_URL}44/${id}`, dates);
  }
  running(id: string, dates){
    return this.http.post(`${this.API_URL}46/${id}`, dates);
  }
  pushing(id: string, dates){
    return this.http.post(`${this.API_URL}50/${id}`, dates);
  }
  purse(id: string, dates){
    return this.http.post(`${this.API_URL}48/${id}`, dates);
  }
  pullingHair(id: string, dates){
    return this.http.post(`${this.API_URL}40/${id}`, dates);
  }
  following(id: string, dates){
    return this.http.post(`${this.API_URL}49/${id}`, dates);
  }
  disrobing(id: string, dates){
    return this.http.post(`${this.API_URL}47/${id}`, dates);
  }
  crowd(id: string, dates){
    return this.http.post(`${this.API_URL}43/${id}`, dates);
  }
  blocking(id: string, dates){
    return this.http.post(`${this.API_URL}45/${id}`, dates);
  }
  transpassing(id: string, dates){
    return this.http.post(`${this.API_URL}52/${id}`, dates);
  }
  cameraDefocused(id: string, dates){
    return this.http.post(`${this.API_URL}53/${id}`, dates);
  }
  cameraBlinded(id: string, dates){
    return this.http.post(`${this.API_URL}54/${id}`, dates);
  }
  sceneChange(id: string, dates){
    return this.http.post(`${this.API_URL}55/${id}`, dates);
  }
  objectRemoval(id: string, dates){
    return this.http.post(`${this.API_URL}56/${id}`, dates);
  }
  smokeDetection(id: string, dates){
    return this.http.post(`${this.API_URL}57/${id}`, dates);
  }
  velocity(id: string, dates){
    return this.http.post(`${this.API_URL}58/${id}`, dates);
  }
  exit(id: string, dates){
    return this.http.post(`${this.API_URL}60/${id}`, dates);
  }
  carnesProcesadas(id: string, dates){
    return this.http.post(`${this.API_URL}72/${id}`, dates);
  }
  conteo(id: string, dates){
    return this.http.post(`${this.API_URL}73/${id}`, dates);
  }
  tiempo(id: string, dates){
    return this.http.post(`${this.API_URL}73/${id}`, dates);
  }
  enterExit(id: string, dates){
    return this.http.post(`${this.API_URL}59/${id}`, dates);
  }
  harrasment(id: string, dates){
    return this.http.post(`${this.API_URL}61/${id}`, dates);
  }
  abduction(id: string, dates){
    return this.http.post(`${this.API_URL}62/${id}`, dates);
  }
  dir(id: string, dates){
    return this.http.post(`${this.API_URL}63/${id}`, dates);
  }
  signalLost(id: string, dates){
    return this.http.post(`${this.API_URL}64/${id}`, dates);
  }
  enterExitV(id: string, dates){
    return this.http.post(`${this.API_URL}65/${id}`, dates);
  }
  availability(id: string, dates){
    return this.http.post(`${this.API_URL}69/${id}`, dates);
  }
  temperature(id: string, dates){
    return this.http.post(`${this.API_URL}70/${id}`, dates);
  }
  scc(id: string, dates){
    return this.http.post(`${this.API_URL}71/${id}`, dates);
  }
  async report(algo_id:number, cam_id:string, dates){
    return await this.http.post(`${api}/report/${algo_id}/${cam_id}`, dates ,{
      responseType: 'blob'
    });
  }

  report1(algo_id:number, cam_id:string, dates){
    return this.http.post(`${api}/report/${algo_id}/${cam_id}`, dates);
  }

  // async downloadLargeFile(url:string): Promise<ArrayBuffer> {
  //   return await this.http.get(url, {
  //       responseType: "arraybuffer",
  //     }).pipe(map((file:ArrayBuffer) => {
  //   return file;
  //   })).toPromise
  //   }
  constructor(private http: HttpClient) { }
}
