import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ngx-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error:any = {
    err: false,
    message : ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  values = {
    username: 'primary',
    password: 'primary',
    login: 'primary'
  }

  constructor(    
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    });
  }

  get f() { return this.registerForm.controls; }


  onSubmit(){
    this.submitted = true;
    this.loading = true;
    this.values = {
      username: 'primary',
      password: 'primary',
      login: 'primary'
    }

    this.authService.login(this.registerForm.value).subscribe(
      data => {
        this.authService.saveToken(data.user.accessToken);
        this.authService.saveUser(data.user);
        this.router.navigate(['/pages'])
        this.isLoggedIn = true;
        this.roles = this.authService.getUser().roles;
        window.location.reload()
      },
      err => {
        this.errorMessage = err.error.message;
        if(err.error.type == 'user'){
          this.values.username = 'danger'
          this.registerForm.controls['username'].setErrors({required:true})
        }
        if(err.error.type == 'password'){
          this.values.password = 'danger'
          this.registerForm.controls['password'].setErrors({required:true})
        }
        if(err.error.type == 'disable'){
          this.values.login = 'danger'
          this.showToast(err.error.message)
        }
        if(err.error.type == 'logged'){
          this.values.login = 'danger'
          this.values.username = 'danger'
          this.values.password = 'danger'
          this.showToast(err.error.message)
        }
        this.loading = false;
      }
    );

    // this.authService.login(this.registerForm.value)
  }

  reloadPage() {
    window.location.reload();
  }

  destroyByClick = true;
  duration = 10000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'warning';
  
  private showToast( body: string) {
    const config = {
      status: this.status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = 'Warning';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

}
