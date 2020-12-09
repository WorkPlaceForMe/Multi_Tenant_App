import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { NbMenuService } from '@nebular/theme';
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

<<<<<<< HEAD
  constructor(private menuService: NbMenuService) { }
  goToHome() {
    this.menuService.navigateHome();
  }
=======
  constructor() { }

>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
  ngOnInit() {
  }

}
