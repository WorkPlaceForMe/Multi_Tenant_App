import { Component, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { HelpDeskService } from "../../../services/helpdesk.service";
import { NbDialogRef, NbDialogService } from "@nebular/theme";

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

  openModal(template: any, helpDeskId: string) {
    this.getModalData(helpDeskId);
    this.dialogRef = this.dialogService.open(template, {
      hasScroll: true,
      dialogClass: "model-full",
    });
  }

  getModalData(helpDeskId: string) {
    if (helpDeskId) {
      for (let data of this.tickets) {
        if (helpDeskId === data.id) {
          this.modalData = data;
          break;
        }
      }
    } else {
      this.modalData = null;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
