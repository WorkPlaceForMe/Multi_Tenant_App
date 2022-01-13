import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../models/API";

@Injectable({
  providedIn: "root",
})
export class IncidentService {
  API_URI = api;
  constructor(private http: HttpClient) {}

  addIncident(incidentDetails: any) {
    const formData = new FormData();
    formData.append("cameraName", incidentDetails.cameraName);
    formData.append("description", incidentDetails.description);
    if (incidentDetails.time) {
      formData.append("time", incidentDetails.time);
    }
    formData.append("file", incidentDetails.image);

    return this.http.post(`${this.API_URI}/incident/create`, formData);
  }

  addMemo(id: string, memo: any) {
    return this.http.post(`${this.API_URI}/incident/memo/${id}`, memo);
  }

  incidentDetails(id: string) {
    return this.http.get(`${this.API_URI}/incident/details/${id}`);
  }

  incidentLogs() {
    return this.http.get(`${this.API_URI}/incident/logs`);
  }

  manageBookmark(id: string, details: any) {
    return this.http.post(`${this.API_URI}/incident/bookmark/${id}`, details);
  }

  getTimelineIncidents(data: any) {
    return this.http.post(`${this.API_URI}/incident/timeline`, data);
  }
}
