import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'ngx-single-tick',
  templateUrl: './single-tick.component.html',
  styleUrls: ['./single-tick.component.scss']
})
export class SingleTickComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private accountserv: AccountService,
    ) { }

    id: string;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.accountserv.seeTick(id).subscribe(
      res => {
        console.log(res)
      },
      err => console.error(err)
    )
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params);
      }
    );
  }

}
