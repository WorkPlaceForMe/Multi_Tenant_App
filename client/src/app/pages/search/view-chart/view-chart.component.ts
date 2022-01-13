import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import { IncidentService } from "../../../services/incident.service";
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
  loading: boolean = false;
  dateRange: any = {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Dates",
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Incidents",
          },
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: "Incident Found",
    },
  ];

  constructor(private incidentServide: IncidentService) {}

  ngOnInit() {
    this.getChartDetails();
  }

  getChartDetails(search?: boolean) {
    this.loading = search ? true : false;
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    const data = {
      start: moment(this.dateRange.start).startOf("day").format(dateTimeFormat),
      end: moment(this.dateRange.end).endOf("day").format(dateTimeFormat),
    };

    this.incidentServide.getTimelineIncidents(data).subscribe(
      (res: any) => {
        this.loading = false;
        const barChartDataObj = [];
        const countArray = [];
        let countXAxisData = 1;
        for (const data of res.incidents) {
          const dataObj = {};
          countArray.push(moment(data._source.time).format(chartDateFormat));
          if (
            !this.barChartLabels.includes(
              moment(data._source.time).format(chartDateFormat)
            )
          ) {
            this.barChartLabels.push(
              moment(data._source.time).format(chartDateFormat)
            );
            dataObj["x"] = countXAxisData;
            dataObj["time"] = moment(data._source.time).format(chartDateFormat);

            barChartDataObj.push(dataObj);
            countXAxisData++;
          }
        }

        for (let i = 0; i < barChartDataObj.length; i++) {
          const totalIncidentOfDate = countArray.filter(
            (time) => time === barChartDataObj[i].time
          ).length;

          barChartDataObj[i]["y"] = totalIncidentOfDate;
          delete barChartDataObj[i].time;
          this.barChartData[0].data.push(barChartDataObj[i]);
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
        alert(error.error.message);
      }
    );
  }
}
