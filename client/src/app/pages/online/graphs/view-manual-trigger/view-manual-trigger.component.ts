import { Component, Input, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-view-manual-trigger",
  templateUrl: "./view-manual-trigger.component.html",
  styleUrls: ["./view-manual-trigger.component.scss"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class ViewManualTriggerComponent implements OnInit {
  canvas: any;
  context: any;
  @Input() value: string | number;
  @Input() rowData: any;
  dialogRef: NbDialogRef<any>;

  constructor(
    private dialogService: NbDialogService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  getBackground() {
    const backgroundImage = `url(${this.rowData.picture})`;
    return this.sanitizer.bypassSecurityTrustStyle(backgroundImage);
  }

  openModal(template: any) {
    this.dialogRef = this.dialogService.open(template, {
      dialogClass: "model-full",
      closeOnBackdropClick: false,
    });

    this.canvas = <HTMLCanvasElement>document.getElementById("canvasId");
    this.context = this.canvas.getContext("2d");
    this.context.canvas.width = Number(this.rowData.canvasWidth);
    this.context.canvas.height = Number(this.rowData.canvasHeight);

    this.draw({ results: JSON.parse(this.rowData.results) });
  }

  draw(data: any) {
    for (let e = 0; e < data["results"].length; e++) {
      this.context.strokeStyle = "red";
      if (data["results"][e][2]["general_detection"] == "Yes") {
        this.context.fillRect(
          data["results"][e][0]["x"] - 2,
          data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          data["results"][e][0]["x"] - 2,
          data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          data["results"][e][1]["x"] - 2,
          data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          data["results"][e][0]["x"],
          data["results"][e][0]["y"],
          data["results"][e][1]["x"] - data["results"][e][0]["x"],
          data["results"][e][1]["y"] - data["results"][e][0]["y"]
        );
        this.context.fillRect(
          data["results"][e][1]["x"] - 2,
          data["results"][e][1]["y"] - 2,
          4,
          4
        );
      } else {
        this.context.fillRect(
          data["results"][e][0]["x"] - 2,
          data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          data["results"][e][0]["x"] + data["results"][e][1]["x"] - 4,
          data["results"][e][0]["y"] - 4,
          4,
          4
        );
        this.context.fillRect(
          data["results"][e][0]["x"] - 2,
          data["results"][e][0]["y"] + data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          data["results"][e][0]["x"],
          data["results"][e][0]["y"],
          data["results"][e][1]["x"],
          data["results"][e][1]["y"]
        );
        this.context.fillRect(
          data["results"][e][0]["x"] + data["results"][e][1]["x"] - 3,
          data["results"][e][0]["y"] + data["results"][e][1]["y"] - 3,
          4,
          4
        );
      }
      this.context.lineWidth = 2.5;
      this.context.stroke();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
