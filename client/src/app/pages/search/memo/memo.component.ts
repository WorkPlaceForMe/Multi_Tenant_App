import { Component, Input, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViewCell } from "ng2-smart-table";
import { IncidentService } from "../../../services/incident.service";

@Component({
  selector: "app-memo",
  templateUrl: "./memo.component.html",
  styleUrls: ["./memo.component.css"],
  animations: [
    trigger("flyInOut", [
      transition("void => *", [
        style({ transform: "translateX(100%)" }),
        animate(400),
      ]),
    ]),
  ],
})
export class MemoComponent implements ViewCell, OnInit {
  addMemoForm: FormGroup;
  loading: boolean = false;
  dialogRef: NbDialogRef<any>;
  @Input() value: string | number;
  @Input() rowData: any;
  memoOrBookmark: boolean = false;
  bookMarked: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private incidentServide: IncidentService
  ) {
    this.addMemoForm = this.fb.group({
      memo: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.loading = true;
    const data = {
      memo: this.addMemoForm.value.memo,
    };

    this.incidentServide.addMemo(this.rowData.id, data).subscribe(
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

  openModal(template: any, type: string, event: any) {
    this.incidentServide.incidentDetails(this.rowData.id).subscribe(
      (res: any) => {
        if (type === "memo") {
          if (
            res.incidentDetails._source.memoDetails &&
            res.incidentDetails._source.memoDetails.details
          ) {
            this.memoOrBookmark = true;
            this.addMemoForm.setValue({
              memo: res.incidentDetails._source.memoDetails.details,
            });
          }
        } else if (type === "bookmark") {
          if (
            res.incidentDetails._source.bookmarkDetails &&
            res.incidentDetails._source.bookmarkDetails.isBookMarked
          ) {
            this.memoOrBookmark = true;
            this.bookMarked = false;
          }
        }

        this.dialogRef = this.dialogService.open(template, {
          dialogClass: "model-full",
          closeOnBackdropClick: false,
        });

        this.dialogRef.onClose.subscribe((resp) => {
          if (resp) {
            if (resp.bookMarked) {
              event.target.style.color = "rgb(56, 177, 56)";
            } else {
              event.target.style.color = "rgb(134, 139, 134)";
            }
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  manageBookmark() {
    this.loading = true;
    const data = {
      bookMarked: this.bookMarked,
    };

    this.incidentServide.manageBookmark(this.rowData.id, data).subscribe(
      (res: any) => {
        alert(res.message);
        this.loading = false;
        this.incidentServide.incidentDetails(this.rowData.id).subscribe(
          (res: any) => {
            if (res.incidentDetails._source.bookmarkDetails) {
              this.rowData.bookmarkDetails =
                res.incidentDetails._source.bookmarkDetails;
            }
            this.closeModal(data);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
        alert(error.error.message);
        this.loading = false;
      }
    );
  }

  closeModal(data?: any) {
    const refData = data || null;
    this.memoOrBookmark = false;
    this.bookMarked = true;
    this.dialogRef.close(refData);
    this.addMemoForm.reset();
  }
}
