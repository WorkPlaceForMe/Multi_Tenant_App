import { Component, Input, OnInit } from "@angular/core";
import { trigger, style, animate, transition } from "@angular/animations";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacesService } from "../../../services/faces.service";
import { ViewCell } from "ng2-smart-table";

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
  incidentId: string;
  memoDetails: boolean = false;

  constructor(
    private facesServide: FacesService,
    private fb: FormBuilder,
    private dialogService: NbDialogService
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

    this.facesServide.addMemo(this.incidentId, data).subscribe(
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

  openModal(template: any, rowData: any) {
    this.incidentId = rowData.id;
    this.facesServide.incidentDetails(this.incidentId).subscribe(
      (res: any) => {
        if (
          res.incidentDetails._source &&
          res.incidentDetails._source.memoDetails.details
        ) {
          this.memoDetails = true;
          this.addMemoForm.setValue({
            memo: res.incidentDetails._source.memoDetails.details,
          });
        }

        this.dialogRef = this.dialogService.open(template, {
          dialogClass: "model-full",
          closeOnBackdropClick: false,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closeModal() {
    this.incidentId = "";
    this.memoDetails = false;
    this.dialogRef.close();
    this.addMemoForm.reset();
  }
}
