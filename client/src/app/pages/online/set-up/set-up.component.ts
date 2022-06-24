import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';
import { MustMatch } from '../../../services/must-match.service';


@Component({
  selector: 'ngx-set-up',
  templateUrl: './set-up.component.html',
  styleUrls: ['./set-up.component.scss'],
})
export class SetUpComponent implements OnInit {

  constructor(private accountserv: AccountService, private router: Router, private activatedRoute: ActivatedRoute, private renderer: Renderer2, private formBuilder: FormBuilder) { }
  registerForm: FormGroup;
  edit: boolean = false;
  user: Account;
  is_saving: boolean = false;
  mess0: boolean = false;
  submitted: boolean = false;
  now_user: Account;
  un_role: string;
  algos: any = [];
  algorithms: Array<string>;
  type: string = 'client';
  values: any = {
    email: 'primary',
    username: 'primary',
    password: 'primary',
    confirmPassword: 'primary',
    algorithm: 'primary',
    vms: 'primary'
  };

  allAct: boolean = false;
  changeAll(){
      for(const alg of this.algos){
        alg.act = this.allAct
      }
  }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    if (this.now_user.role === 'admin'){
        this.un_role = 'client';
        this.getAlgos();
    }else if (this.now_user.role === 'client'){
      this.un_role = 'branch';
    }else if (this.now_user.role === 'branch'){
      this.un_role = 'user';
    }

    this.registerForm = this.formBuilder.group({
      algorithm: [''],
      unique: [false],
      password: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{10,}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      cameras: [10],
      analytics: [10],
      disabled: [false],
      vms: ['']
  }, {
    validators: [
      MustMatch('password', 'confirmPassword'),
    ],
  });

    const params = this.activatedRoute.snapshot.params;
    if (params.id){
      this.edit = true;
      if (this.now_user.role === 'admin'){
      this.accountserv.getOneAd(params.id)
      .subscribe(
        res => {
          this.user = res['data'];
          this.registerForm.controls['username'].setValue(this.user.username);
          this.registerForm.controls['email'].setValue(this.user.email);
          this.registerForm.controls['analytics'].setValue(this.user.analytics);
          this.registerForm.controls['cameras'].setValue(this.user.cameras);
          this.registerForm.controls['vms'].setValue(this.user.vms);
          this.type = this.user.role;
          if (this.user.disabled === 0){
            this.registerForm.controls['disabled'].setValue(false);
          }else if (this.user.disabled === 1){
            this.registerForm.controls['disabled'].setValue(true);
          }
          if (this.user.id_branch !== '0000'){
            this.registerForm.controls['unique'].setValue(true);
          }
          for (const a of this.user.algorithm){
            for (const b of this.algos){
              if (a === b.name){
                b.act = true;
              }
            }
          }
        },
        err => console.error(err),
      );
    }else {
      this.accountserv.getOne(params.id)
      .subscribe(
        res => {
          this.user = res['data'];
          this.registerForm.controls['username'].setValue(this.user.username);
          this.registerForm.controls['email'].setValue(this.user.email);
          if (this.user.id_branch !== '0000'){
            this.registerForm.controls['unique'].setValue(true);
          }
          if (this.user.disabled === 0){
            this.registerForm.controls['disabled'].setValue(false);
          }else if (this.user.disabled === 1){
            this.registerForm.controls['disabled'].setValue(true);
          }
        },
        err => console.error(err),
      );
    }
    }
  }

  get f() { return this.registerForm.controls; }

  view1(){
    console.log(this.registerForm.controls);
  }

  view: boolean = false;
  typePass: string = 'password';
  changeView(){
    if (this.view === false){
      this.typePass = 'password';
    }else if (this.view === true){
      this.typePass = 'text';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.values = {
      email: 'primary',
      username: 'primary',
      password: 'primary',
      confirmPassword: 'primary',
      algorithm: 'primary',
      vms: 'primary'
    };
    // stop here if form is invalid
    this.registerForm.controls['algorithm'].setErrors(null);
    if (this.edit === true){
      this.registerForm.controls['password'].setErrors(null);
      this.registerForm.controls['confirmPassword'].setErrors(null);
    }
    if (this.registerForm.invalid) {
      const controls = this.registerForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.values[name] = 'danger';
          }
      }
        return;
    }
    let found = false;
    this.algorithms = [];
    for (const a of this.algos){
      if (a['act'] === true){
        found = true;
        this.algorithms.push(a['name']);
      }
    }
    if (this.type === 'admin'){
      found = true;
    }
    if (found === false && this.now_user.role === 'admin'){
      this.values.algorithm = 'danger';
      return this.registerForm.controls['algorithm'].setErrors({required: true});
    }else {
      this.registerForm.controls['algorithm'].setValue(this.algorithms);
    }
    if (this.now_user.role !== 'admin'){
      this.registerForm.controls['analytics'].setValue(this.now_user.analytics);
      this.registerForm.controls['cameras'].setValue(this.now_user.cameras);
    }

    this.is_saving = true;
    if (this.edit === false){
      let role = this.un_role;
      if (this.now_user.role === 'admin'){
        role = this.type;
      }
      if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000'){
        role = 'user';
      }
      this.accountserv.addAccount(this.registerForm.value, role).subscribe(
      res => {
        // console.log('User successfully created!');
        this.router.navigate(['/pages/accounts']);
      },
      err => {
        this.is_saving = false;
        if (err.error.repeated === 'Username'){
          this.values.username = 'danger';
          this.registerForm.controls['username'].setErrors({cantMatch: true});
        }
        if (err.error.repeated === 'Email'){
          this.values.email = 'danger';
          this.registerForm.controls['email'].setErrors({cantMatch: true});
        }
      },
      );
    }else if (this.edit === true){
      const params = this.activatedRoute.snapshot.params.id;
      let role = this.un_role;
      if (this.now_user.role === 'admin'){
        role = this.type;
      }
      if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000'){
        role = 'user';
      }
      this.accountserv.editAccount(this.registerForm.value, params, role)
      .subscribe(
      res => {
        if (this.now_user.role === 'admin'){
          const send = {
            algorithm: this.registerForm.controls['algorithm'].value,
          };
          this.accountserv.editAlgo(params, send).subscribe(
            res => {
              this.router.navigate(['/pages/accounts']);
            },
            err => console.log(err),
          );
        }else {
          this.router.navigate(['/pages/accounts']);
        }
      },
      err => {
        this.is_saving = false;
        if (err.error.repeated === 'Username'){
          this.values.username = 'danger';
          this.registerForm.controls['username'].setErrors({cantMatch: true});
        }
        if (err.error.repeated === 'Email'){
          this.values.email = 'danger';
          this.registerForm.controls['email'].setErrors({cantMatch: true});
        }
      },
    );
    }

  }

  handleError(error) {
    console.log('Error: ', error);
  }


getAlgos(){
  this.accountserv.getAlg().subscribe(
    res => {
      this.algos = res['data'];
    },
    err => console.log(err),
  );
}

}
