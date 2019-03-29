import { AuthService } from './../auth/auth.service';
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { User } from '../auth/user.model';

@Component({
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {

  form: FormGroup;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      }),
      planType: new FormControl(null, {
        validators: [Validators.required],
      }),
      planName: new FormControl(null, {
        validators: [Validators.required],
      }),
      signUpDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      status: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  submit(): void {
    //this.form.get('title').value
    console.log(this.form.value);
    this.auth.updateUser(this.form.value);
    this.auth.updateUser(this.form.value).then(res => {
      console.log('saved user');
    }).catch(error => {
      console.log(error);
    });
  }
}
