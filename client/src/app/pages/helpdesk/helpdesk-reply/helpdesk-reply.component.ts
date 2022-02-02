import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { HelpDeskService } from "../../../services/helpdesk.service";
import { NbDialogRef } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
const imageTypes = ["jpg", "png", "jpeg"];

@Component({
  selector: "app-helpdesk-reply",
  templateUrl: "./helpdesk-reply.component.html",
  styleUrls: ["./helpdesk-reply.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class HelpdeskReplyComponent implements OnInit {
  helpDeskReplyForm: FormGroup;
  fileName: string;
  wrongFileType: boolean = false;
  loading: boolean = false;
  replies: Array<any> = [];
  @Input() ticket: any;
  @ViewChild("fileInput", { static: false }) fileInputVariable: any;

  constructor(
    private helpDeskService: HelpDeskService,
    private fb: FormBuilder,
    public dialogRef: NbDialogRef<HelpdeskReplyComponent>,
    public authService: AuthService
  ) {
    this.helpDeskReplyForm = this.fb.group({
      replyMessage: ["", [Validators.required, Validators.minLength(4)]],
      image: [""],
    });
  }

  ngOnInit() {
    this.getReplies();
    if (this.ticket.status === "RESOLVED") {
      this.helpDeskReplyForm.disable();
    }
  }

  onSubmit() {
    this.loading = true;
    const data = {
      id: this.ticket.id,
      replyMessage: this.helpDeskReplyForm.value.replyMessage,
      image: this.fileInputVariable.nativeElement.files[0],
    };

    this.helpDeskService.postHelpDeskReply(data).subscribe(
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

  getReplies() {
    this.helpDeskService.getReplies(this.ticket.id).subscribe(
      (res: any) => {
        this.replies = res.replies;

        const userDetails = this.authService.getUser();
        for (let data of this.replies) {
          if (data.user_id === userDetails.id) {
            data.currentUser = true;
          } else {
            data.currentUser = false;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
    if (this.fileInputVariable) {
      this.fileInputVariable.nativeElement.value = "";
    }
    this.fileName = null;
    this.helpDeskReplyForm.reset();
  }
}
