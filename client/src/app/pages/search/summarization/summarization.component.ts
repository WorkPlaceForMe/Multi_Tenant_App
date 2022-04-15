import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import moment = require("moment");
import { FacesService } from "../../../services/faces.service";
import { VideoService } from "../../../services/video.service";

const timeFormat = "HH:mm:ss";

@Component({
  selector: "summarization",
  templateUrl: "./summarization.component.html",
  styleUrls: ["./summarization.component.scss"],
})
export class SummarizationComponent implements OnInit {
  processForm: FormGroup;
  serverSuccessMessage = null;
  serverErrorMessage = null;
  videoFiles = [];

  constructor(private fb: FormBuilder, private videoService: VideoService, private facesService: FacesService) {}

  ngOnInit() {
    this.facesService.viewVids().subscribe(
      (res: any) => {
        res.data?.forEach( (item : any) => {
          this.videoFiles.push({ name:  item.name, path: item.rtsp_in });
        });
      },
      err => {
        console.log(err)
      }
    )
    this.formInitialization();
  }

  formInitialization() {
    this.processForm = this.fb.group(
      {
        inputFileName: [
          "",
          [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
        ],
        startTime: [""],
        endTime: [""],
        duration: [null, [Validators.min(3)]],
      },
      { validators: [this.checkStartTimeAndEndTime.bind(this)] }
    );
  }

  clearStartOrEnd(type: string) {
    (<HTMLInputElement>document.getElementById(type)).value = "";
    if (type === "startTime") {
      this.processForm.patchValue({ startTime: "" });
    } else {
      this.processForm.patchValue({ endTime: "" });
    }
  }

  onProcessVideoSubmit() {
    const data = {
      inputFileName: this.processForm.value.inputFileName,
      startTime: this.processForm.value.startTime
        ? moment(this.processForm.value.startTime).format(timeFormat)
        : "",
      endTime: this.processForm.value.endTime
        ? moment(this.processForm.value.endTime).format(timeFormat)
        : "",
      duration: this.processForm.value.duration,
    };

    this.videoService.processVideo(data).subscribe(
      (res: any) => {
        this.serverSuccessMessage = res.message;
      },
      (error) => {
        this.serverErrorMessage = error.error.message;
      }
    );
  }

  checkStartTimeAndEndTime(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get("startTime").value;
    const endTime = control.get("endTime").value;

    this.serverErrorMessage = null;
    this.serverSuccessMessage = null;

    if (startTime && endTime) {
      const difference = moment(startTime, timeFormat).diff(
        moment(endTime, timeFormat)
      );
      if (difference >= 0) {
        return { invalidStartTimeEndTime: true };
      }
    }

    return null;
  }
}
