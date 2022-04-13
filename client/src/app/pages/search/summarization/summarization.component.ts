import {
  Component,
  OnInit
} from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import moment = require("moment");

const timeFormat = "HH:mm:ss";

@Component({
  selector: "summarization",
  templateUrl: "./summarization.component.html",
  styleUrls: ["./summarization.component.scss"],
})
export class SummarizationComponent implements OnInit {
  processForm: FormGroup;
  
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formInitialization()
  }

  formInitialization() {
    this.processForm = this.fb.group({
      inputFileName: ["", [Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      startTime: [""],
      endTime: [""],
      duration: [null, [Validators.min(3)]],
    }, { validators: [this.checkStartTimeAndEndTime] });
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

   /*  this.videoService.processVideo(data).subscribe(
      (res: any) => {
        this.closeModal();
        alert(res.message);
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
      }
    ); */
  }

  checkStartTimeAndEndTime(control: AbstractControl): ValidationErrors | null { 
    const startTime = control.get("startTime").value;
    const endTime = control.get("endTime").value;

    if (startTime && endTime) {
      const difference = moment(startTime, timeFormat).diff(moment(endTime, timeFormat))
      if (difference >= 0) {
        return { 'invalidStartTimeEndTime': true }
      }
    }
 
    return null
  }
}
