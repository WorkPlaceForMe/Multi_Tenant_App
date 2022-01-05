import { Component, OnInit, ViewChild } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { HelpDeskService } from "../../../services/helpdesk.service";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HelpdeskReplyComponent } from "../helpdesk-reply/helpdesk-reply.component";
import { HelpdeskDetailsComponent } from "../helpdesk-details/helpdesk-details.component";
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
  loading: boolean = false;
  modalId: string;
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModal(template: any, id?: string) {
    this.modalId = id || "";
    this.dialogRef = this.dialogService.open(template, {
      dialogClass: "model-full",
      closeOnBackdropClick: false,
    });
  }

  openReplyModal(ticket: any) {
    this.dialogRef = this.dialogService.open<any>(HelpdeskReplyComponent, {
      context: { ticket },
      hasScroll: true,
      dialogClass: "model-full",
      closeOnBackdropClick: false,
    });

    this.dialogRef.onClose.subscribe((resp) => {
      console.log(resp);
    });
  }

  openTicketViewModal(modalData: any) {
    this.dialogRef = this.dialogService.open<any>(HelpdeskDetailsComponent, {
      context: { modalData },
      hasScroll: true,
      dialogClass: "model-full",
    });

    this.dialogRef.onClose.subscribe((resp) => {
      console.log(resp);
    });
  }

  onSubmit() {
    this.loading = true;
    const data = {
      title: this.helpDeskForm.value.title,
      message: this.helpDeskForm.value.message,
      image: this.fileInputVariable.nativeElement.files[0],
    };

    this.helpDeskService.addHelpDeskIssue(data).subscribe(
      (res: any) => {
        this.getTickets();
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

  updateStatus() {
    this.helpDeskService.updateStatus(this.modalId, "REOPENED").subscribe(
      (res: any) => {
        this.getTickets();
        this.closeModal();
        alert(res.message);
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
    if (this.fileInputVariable) {
      this.fileInputVariable.nativeElement.value = "";
    }
    this.fileName = null;
    this.helpDeskForm.reset();
  }
}
