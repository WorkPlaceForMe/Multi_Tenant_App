import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-single-tick',
  templateUrl: './single-tick.component.html',
  styleUrls: ['./single-tick.component.scss']
})
export class SingleTickComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    ) { }

    id: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || '';
    });
  }

}
