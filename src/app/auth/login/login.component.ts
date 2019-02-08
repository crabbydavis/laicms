import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  isLoading = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password).then(token => {
      console.log('got token', token);
      const userQuery = this.authService.getUserFromDB(token.user.email).subscribe(docs => {
        console.log('user query', docs);
        this.authService.user = docs[0];
        this.isLoading = false;
        this.router.navigate(['/']);
        userQuery.unsubscribe();
      }, error => console.log('Error with user query'));
    }).catch(err => {
      this.isLoading = false;
      console.log(err);
    });
  }
}
