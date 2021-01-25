import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoginserviceService } from '../services/loginservice.service';
import { FirebaseauthService } from '../services/firebaseauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: Boolean = false;
  admin = { username: '', password: '' };
  showLoader: boolean = false;

  constructor( private router: Router, private db: AngularFireDatabase,
  private firebaseAuth: FirebaseauthService) {}

  ngOnInit() {

    if(this.firebaseAuth.isLoggedIn){

      this.router.navigate(['dashboard']);
      }
    }

  onSubmit() {
    this.showLoader = true;
    this.firebaseAuth.SignIn(this.admin.username, this.admin.password)
    .then((snap )=>{
      // console.log('then')
      this.showLoader = this.firebaseAuth.showLoader;
      this.error = this.firebaseAuth.error;

    })
    .catch((error)=>{
      return error;
    })

  }

}
