import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { AuthService } from "../../../services/auth.service";
import { IncidentService } from "../../../services/incident.service";

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
    private incidentService: IncidentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getIncidentLogs();
  }

  getIncidentLogs() {
    this.incidentService.incidentLogs().subscribe(
      (res: any) => {
        this.incidentLogs = res.logs;
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
