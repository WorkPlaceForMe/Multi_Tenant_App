import {
  Component,
  Input,
  OnInit,
  HostListener,
  Renderer2,
} from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { FacesService } from "../../../../services/faces.service";

@Component({
  selector: "app-manual-trigger",
  templateUrl: "./manual-trigger.component.html",
  styleUrls: ["./manual-trigger.component.scss"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class ManualTriggerComponent implements OnInit {
  canvas: any;
  context: any;
  manualTriggerForm: FormGroup;
  loading: boolean = false;
  coords = [];
  count: number = 0;
  @Input() data: any;
  algorithms: any;

  constructor(
    public dialogRef: NbDialogRef<ManualTriggerComponent>,
    private fb: FormBuilder,
    private rd: Renderer2,
    public sanitizer: DomSanitizer,
    private face: FacesService
  ) {}

  ngOnInit() {
    this.initializeManualTriggerForm();
    this.getAlgorithms();
    // this.getAlgorithmDetails(this.data.algoId);
    this.canvas = <HTMLCanvasElement>document.getElementById("canvasId");
    this.context = this.canvas.getContext("2d");
    this.context.canvas.width = 700;
    this.context.canvas.height = 400;
  }
  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    let x, y, rect;
    if (this.canvas) {
      rect = this.canvas.getBoundingClientRect();
      x = e.clientX - rect.left - 3;
      y = e.clientY - rect.top - 3;
      if (this.count == 1) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw();
        this.context.fillStyle = "rgba(0,0,0,0)";
        this.context.strokeStyle = "white";
        this.context.fillRect(
          this.coords[0]["x"] - 2,
          this.coords[0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
        this.context.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
        this.context.strokeRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.context.fillRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.context.fillRect(x - 2, y - 2, 4, 4);
        this.context.lineWidth = 2.5;
        this.context.stroke();
      }
    }
  }

  initializeManualTriggerForm() {
    this.manualTriggerForm = this.fb.group({
      actions: ["", [Validators.required, Validators.minLength(3)]],
      severity: ["", [Validators.required, Validators.minLength(3)]],
      // algoName: ["", [Validators.required]],
      algoId: ["", [Validators.required]],
    });
  }

  drawRect(event: any) {
    this.canvas = this.rd.selectRootElement(event.target);
    this.context = this.canvas.getContext("2d");
    this.goAnnotate(event);
  }

  clear() {
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.data["results"].splice(this.data["results"].length - 1, 1);
    this.re_draw();
  }

  getBackground() {
    const backgroundImage = `url(${this.data.screenshot})`;
    return this.sanitizer.bypassSecurityTrustStyle(backgroundImage);
  }

  goAnnotate(event) {
    this.re_draw();
    let x, y, rect;
    this.count++;
    if (this.count == 1) {
      this.context.beginPath();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw();
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      this.coords.push({ x: x, y: y });
      this.context.moveTo(x, y);
      this.context.fillRect(x - 2, y - 2, 4, 4);
    } else if (this.count == 2) {
      this.count = 0;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      this.context.fillRect(
        this.coords[0]["x"] - 2,
        this.coords[0]["y"] - 2,
        4,
        4
      );
      this.context.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
      this.context.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
      this.context.strokeStyle = "lime";
      this.context.strokeRect(
        this.coords[0]["x"],
        this.coords[0]["y"],
        x - this.coords[0]["x"],
        y - this.coords[0]["y"]
      );
      this.context.fillRect(x - 2, y - 2, 4, 4);
      x = x - this.coords[0].x;
      y = y - this.coords[0].y;
      this.coords.push({ x: x, y: y });
      this.coords.push({
        general_detection: "No",
        detection_source: "Manual Drawn",
      });
      this.context.lineWidth = 2.5;
      this.context.stroke();
      this.data["results"].push(this.coords);
      this.re_draw();
      this.coords = [];
    }
  }

  re_draw() {
    for (let e = 0; e < this.data["results"].length; e++) {
      this.context.strokeStyle = "lime";
      if (this.data["results"][e][2]["general_detection"] == "Yes") {
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][1]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          this.data["results"][e][0]["x"],
          this.data["results"][e][0]["y"],
          this.data["results"][e][1]["x"] - this.data["results"][e][0]["x"],
          this.data["results"][e][1]["y"] - this.data["results"][e][0]["y"]
        );
        this.context.fillRect(
          this.data["results"][e][1]["x"] - 2,
          this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
      } else {
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] + this.data["results"][e][1]["x"] - 4,
          this.data["results"][e][0]["y"] - 4,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] + this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          this.data["results"][e][0]["x"],
          this.data["results"][e][0]["y"],
          this.data["results"][e][1]["x"],
          this.data["results"][e][1]["y"]
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] + this.data["results"][e][1]["x"] - 3,
          this.data["results"][e][0]["y"] + this.data["results"][e][1]["y"] - 3,
          4,
          4
        );
      }
      this.context.lineWidth = 2.5;
      this.context.stroke();
    }
  }

  getAlgorithms() {
    this.face.getAllAlgos().subscribe(
      (res: any) => {
        this.algorithms = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAlgorithmDetails(id: number) {
    this.face.getAlgoByID(id).subscribe(
      (res: any) => {
        this.manualTriggerForm.patchValue({ algoName: res.data.name });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveManualTrigger() {
    this.loading = true;
    const reqData = {
      cameraId: this.data.cameraId,
      httpIn: this.data.screenshot,
      actions: this.manualTriggerForm.value.actions,
      severity: this.manualTriggerForm.value.severity,
      results:
        this.data.results.length > 0 ? JSON.stringify(this.data.results) : "",
      canvasWidth: String(this.context.canvas.width),
      canvasHeight: String(this.context.canvas.height),
      algoId: this.manualTriggerForm.value.algoId,
    };

    this.face.manualTrigger(reqData).subscribe(
      (res: any) => {
        this.loading = false;
        this.closeModal();
        alert(res.message);
      },
      (error) => {
        this.loading = false;
        console.log(error);
        alert(error.error.message);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
