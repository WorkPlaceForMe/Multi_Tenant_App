import { Component, OnInit, ViewChild } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { IncidentService } from "../../../services/incident.service";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const imageTypes = ["jpg", "png", "jpeg"];

@Component({
  selector: "app-add-incident",
  templateUrl: "./add-incident.component.html",
  styleUrls: ["./add-incident.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class AddIncidentComponent implements OnInit {
  addIncidentForm: FormGroup;
  fileName: string;
  wrongFileType: boolean = false;
  loading: boolean = false;
  @ViewChild("fileInput", { static: false }) fileInputVariable: any;

  constructor(
    private incidentServide: IncidentService,
    private fb: FormBuilder,
    public dialogRef: NbDialogRef<AddIncidentComponent>
  ) {
    this.addIncidentForm = this.fb.group({
      cameraName: ["", [Validators.required, Validators.minLength(4)]],
      description: ["", [Validators.required, Validators.minLength(4)]],
      time: [new Date()],
      file: ["", [Validators.required]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.loading = true;
    const time = this.addIncidentForm.value.time
      ? moment(this.addIncidentForm.value.time).format(dateTimeFormat)
      : "";
    const data = {
      cameraName: this.addIncidentForm.value.cameraName,
      description: this.addIncidentForm.value.description,
      time,
      image: this.fileInputVariable.nativeElement.files[0],
    };

    this.incidentServide.addIncident(data).subscribe(
      (res: any) => {
        this.closeModal();
        alert(res.message);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
        this.loading = false;
      }
    );
  }

  change() {
    this.fileName = null;
    this.wrongFileType = false;
    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      this.fileName = this.fileInputVariable.nativeElement.files[0]["name"];
      const fileType = this.fileName.split(".")[1];
      if (!fileType || !imageTypes.includes(fileType.toLowerCase())) {
        this.wrongFileType = true;
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
    if (this.fileInputVariable) {
      this.fileInputVariable.nativeElement.value = "";
    }
    this.fileName = null;
    this.addIncidentForm.reset();
  }
}
