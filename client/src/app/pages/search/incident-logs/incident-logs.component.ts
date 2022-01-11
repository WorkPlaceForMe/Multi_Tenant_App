import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { FacesService } from "../../../services/faces.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-incident-logs",
  templateUrl: "./incident-logs.component.html",
  styleUrls: ["./incident-logs.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class IncidentLogsComponent implements OnInit {
  incidentLogs: Array<any> = [];

  constructor(
    private faceService: FacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getIncidentLogs();
  }

  getIncidentLogs() {
    this.faceService.incidentLogs().subscribe(
      (res: any) => {
        this.incidentLogs = res.logs;
        console.log(this.incidentLogs);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUserName(row: any) {
    const loggedinDetails = this.authService.getUser();
    if (loggedinDetails.id === row.account.id) {
      return `${row.account.username} (You)`;
    } else {
      return row.account.username;
    }
  }
}
