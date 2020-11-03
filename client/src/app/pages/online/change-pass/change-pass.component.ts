import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef } from '@nebular/theme';
import { AccountService } from '../../../services/account.service';
import { MustMatch } from '../../../services/must-match.service';

@Component({
  selector: 'ngx-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  registerForm: FormGroup;
  submitted:boolean = false;
  is_saving : boolean = false;
  values: any = {
    password: 'primary',
    confirmPassword: 'primary',
  }
  @Input() id: any;

  constructor(private formBuilder: FormBuilder, private accountserv: AccountService, protected windowRef: NbWindowRef) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(10),Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{10,}$")]],
      confirmPassword: ['', Validators.required]
  },{
    validators:[
      MustMatch('password', 'confirmPassword')
    ]
  });
  }

  get f() { return this.registerForm.controls; }

  view:boolean = false;
  typePass: string = 'password';
  changeView(){
    if(this.view == false){
      this.typePass = 'password';
    }else if(this.view == true){
      this.typePass = 'text';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.values = {
      password: 'primary',
      confirmPassword: 'primary',
    }
    // stop here if form is invalid

    if (this.registerForm.invalid) {
      const controls = this.registerForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.values[name] = 'danger'
          }
      }
        return;
    }


    this.is_saving = true;
    let a = {
      password: this.registerForm.controls['password'].value
    }
      this.accountserv.changePs(a,this.id).subscribe(
      res => {
        this.windowRef.close();
      },
      err => {
        this.is_saving = false;
      }
      )  
  }

}
