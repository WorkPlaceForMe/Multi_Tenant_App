import { Component, OnInit, ViewChild } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { HelpDeskService } from "../../../services/helpdesk.service";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
const imageTypes = ["jpg", "png", "jpeg"];

@Component({
  selector: "app-generate-helpdesk-ticket",
  templateUrl: "./generate-helpdesk-ticket.component.html",
  styleUrls: ["./generate-helpdesk-ticket.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class GenerateHelpDeskTicketComponent implements OnInit {
  tickets: Array<any> = [];
  helpDeskForm: FormGroup;
  fileName: string;
  dialogRef: NbDialogRef<any>;
  wrongFileType: boolean = false;
  @ViewChild("fileInput", { static: false }) fileInputVariable: any;

  constructor(
    private helpDeskService: HelpDeskService,
    private dialogService: NbDialogService,
    private fb: FormBuilder
  ) {
    this.helpDeskForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(4)]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.getTickets();
  }

  getTickets() {
    this.helpDeskService.getGeneratedIssus().subscribe(
      (res: any) => {
        this.tickets = res.helpDeskIssues;
        console.log(this.tickets);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModal(template) {
    this.dialogRef = this.dialogService.open(template, {
      context: "pass data in template",
      dialogClass: "model-full",
    });
  }

  onSubmit() {
    console.log("submit");
    const data = {
      title: this.helpDeskForm.value.title,
      message: this.helpDeskForm.value.message,
      image: this.fileInputVariable.nativeElement.files[0],
    };

    this.helpDeskService.addHelpDeskIssue(data).subscribe(
      (res: any) => {
        console.log(res);
        this.getTickets();
        this.closeModal();
        alert(res.message);
      },
      (error) => {
        console.log(error);
        alert(error.error.err_desc);
      }
    );
  }

  change() {
    this.fileName = null;
    this.wrongFileType = false;
    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      this.fileName = this.fileInputVariable.nativeElement.files[0]["name"];
      const fileType = this.fileName.split(".")[1];
      console.log(fileType);
      if (!fileType || !imageTypes.includes(fileType.toLowerCase())) {
        this.wrongFileType = true;
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
    this.fileInputVariable.nativeElement.value = "";
    this.fileName = null;
    this.helpDeskForm.reset();
  }
}
