import { Component, OnInit, HostBinding, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { User } from '../../../models/User';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-face-form',
  templateUrl: './face-form.component.html',
  styleUrls: ['./face-form.component.css'],
  animations: [
  trigger('flyInOut', [
    transition('void => *', [
      style({ transform: 'translateX(100%)' }),
      animate(300)
    ])
  ])
]
})
export class FaceFormComponent implements OnInit {
  @HostBinding('class') classes ='row';
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constraints = {
    video: {
        facingMode: "environment",
        width: { ideal: 4096 },
        height: { ideal: 2160 }
    }
};

  user: User = {
    id: 0,
    name: '',
    gender: '',
    age_group: '',
    role: '',
    category: '',
    uuid: '',
    errors:''
  };

  submitted = false;
  videoWidth = 0;
  videoHeight = 0;
  registerForm: FormGroup;
  mess0:boolean = false;
  edit : boolean = false;
  is_saving : boolean = false;
  percentDone: number = 0;  
  radioGroupValue = 'Male';
  values:any = {
    age_group: 'primary',
    name: 'primary',
    role: 'primary',
    category: 'primary'
  }
  constructor(private facesService: FacesService, private router: Router, private activatedRoute: ActivatedRoute,private renderer: Renderer2, private formBuilder: FormBuilder) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if(params.uuid){
      this.edit = true;
      this.facesService.getUser(params.uuid)
      .subscribe(
        res =>{
          this.user = res['data'];
          console.log(this.user)
          this.registerForm.controls['name'].setValue(this.user.name)
          this.registerForm.controls['gender'].setValue(this.user.gender)
          this.registerForm.controls['age_group'].setValue(this.user.age_group)
          this.registerForm.controls['role'].setValue(this.user.role)
          this.registerForm.controls['category'].setValue(this.user.category)
          this.registerForm.controls['uuid'].setValue(this.user.uuid)
        },
        err => console.error(err)
      )
    }
    this.registerForm = this.formBuilder.group({
      category: ['', Validators.required],
      role: ['', Validators.required],
      age_group: ['', Validators.required],
      gender: ['Male', Validators.required],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      uuid: [''],
  });
  }

  get f() { return this.registerForm.controls; }


onSubmit() {
  this.submitted = true;
  this.values = {
    age_group: 'primary',
    name: 'primary',
    role: 'primary',
    category: 'primary'
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
  if(this.edit == false){
    this.facesService.saveUser(this.registerForm.value).subscribe(
    res => {
      console.log('User successfully created!');
      this.router.navigate(['/pages/user/images/' + res['id']]);
    },
    err => {
      console.log(err.error)
      this.registerForm.controls[err.error].setErrors({used:true})
    }
    )
  }else if(this.edit == true){
    this.facesService.updateUser(this.registerForm.value)
    .subscribe(
    res => {
      console.log(res);
      this.router.navigate(['/pages/management']);
    },
    err => console.log(err)
  );
  }

}

handleError(error) {
  console.log('Error: ', error);
}


view(){
  console.log(this.registerForm.value)
}
}
