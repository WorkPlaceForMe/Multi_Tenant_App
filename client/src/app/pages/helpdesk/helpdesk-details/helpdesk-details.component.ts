import { Component, Input, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-helpdesk-details",
  templateUrl: "./helpdesk-details.component.html",
  styleUrls: ["./helpdesk-details.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class HelpdeskDetailsComponent implements OnInit {
  tickets: Array<any> = [];
  @Input() modalData: any;

  constructor(public dialogRef: NbDialogRef<HelpdeskDetailsComponent>) {}

  ngOnInit() {}

  closeModal() {
    this.dialogRef.close();
  }
}
