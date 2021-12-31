import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { api } from "../models/API";
import { Account } from "../models/Account";

@Injectable({
  providedIn: "root",
})
export class HelpDeskService {
  API_URI = api;
  constructor(private http: HttpClient) {}

  getGeneratedIssus() {
    return this.http.get(`${this.API_URI}/helpdesk/userOrBranch`);
  }

  addHelpDeskIssue(issueDetails: any) {
    const formData = new FormData();
    formData.append("title", issueDetails.title);
    formData.append("message", issueDetails.message);
    if (issueDetails.image) {
      formData.append("file", issueDetails.image);
    }
    return this.http.post(`${this.API_URI}/helpdesk/create`, formData);
  }
}
