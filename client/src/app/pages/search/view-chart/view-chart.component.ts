import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { IncidentService } from "../../../services/incident.service";
import { TimelineItem } from "ngx-horizontal-timeline";
import * as moment from "moment";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const chartDateFormat = "Do MMMM,YYYY";
const date = new Date();

@Component({
  selector: "app-view-chart",
  templateUrl: "./view-chart.component.html",
  styleUrls: ["./view-chart.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class ViewChartComponent implements OnInit {
  items: TimelineItem[] = [];
  loading: boolean = false;
  dateRange: any = {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };

  constructor(private incidentServide: IncidentService) {}

  ngOnInit() {
    this.getChartDetails();
  }

  getChartDetails(search?: boolean) {
    this.loading = search ? true : false;
    const data = {
      start: moment(this.dateRange.start).startOf("day").format(dateTimeFormat),
      end: moment(this.dateRange.end).endOf("day").format(dateTimeFormat),
    };

    this.incidentServide.getTimelineIncidents(data).subscribe(
      (res: any) => {
        this.items = [];
        this.loading = false;
        const timeLineArray = [];
        const countArray = [];
        for (const data of res.incidents) {
          const dateValue = moment
            .utc(data._source.time)
            .format(chartDateFormat);
          const dataObj = {};
          countArray.push(dateValue);
          const labelExists = timeLineArray.some(
            (el) => el.label === dateValue
          );
          if (!labelExists) {
            dataObj["label"] = dateValue;
            timeLineArray.push(dataObj);
          }
        }

        for (let i = 0; i < timeLineArray.length; i++) {
          const totalIncidentOfDate = countArray.filter(
            (time) => time === timeLineArray[i].label
          ).length;

          timeLineArray[i]["title"] = `${totalIncidentOfDate} Incident Found`;
          timeLineArray[i]["icon"] = "fas fa-circle";
          timeLineArray[i]["color"] = "2980b9";
          this.items.push(timeLineArray[i]);
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
        if (error.status == 500) {
          alert("Something went wrong");
        } else {
          alert(error.error.message);
        }
      }
    );
  }
}
