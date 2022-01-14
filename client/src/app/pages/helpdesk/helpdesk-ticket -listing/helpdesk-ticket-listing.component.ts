import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { HelpDeskService } from "../../../services/helpdesk.service";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { HelpdeskReplyComponent } from "../helpdesk-reply/helpdesk-reply.component";
import { HelpdeskDetailsComponent } from "../helpdesk-details/helpdesk-details.component";

@Component({
  selector: "app-helpdesk-ticket-listing",
  templateUrl: "./helpdesk-ticket-listing.component.html",
  styleUrls: ["./helpdesk-ticket-listing.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class HelpdeskTicketListingComponent implements OnInit {
  tickets: Array<any> = [];
  dialogRef: NbDialogRef<any>;
  modalData: any;
  modalId: string;
  loading: boolean = false;

  constructor(
    private helpDeskService: HelpDeskService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.getTickets();
  }

  getTickets() {
    this.helpDeskService.getHelpdeskIssusByClient().subscribe(
      (res: any) => {
        this.tickets = res.helpDeskIssues;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openUpdateStatusModal(template: any, helpDeskId: string) {
    this.modalId = helpDeskId || "";
    this.dialogRef = this.dialogService.open(template, {
      hasScroll: true,
      dialogClass: "model-full",
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

  openViewModal(modalData: any) {
    this.dialogRef = this.dialogService.open<any>(HelpdeskDetailsComponent, {
      context: { modalData },
      hasScroll: true,
      dialogClass: "model-full",
    });

    this.dialogRef.onClose.subscribe((resp) => {
      console.log(resp);
    });
  }

  updateStatus() {
    this.loading = true;
    this.helpDeskService.updateStatus(this.modalId, "RESOLVED").subscribe(
      (res: any) => {
        this.loading = false;
        this.getTickets();
        this.closeModal();
        alert(res.message);
      },
      (error) => {
        console.log(error);
        this.loading = false;
        alert(error.error.message);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
