import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  time = new Date().getTime()
  validTime = this.time + (24*60*60*60);
  session: Object = { loggedIn: true, Time: this.validTime };

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  redirectUrl: string;

  error: Boolean = false;
  showLoader: boolean = false;

  constructor(
    private db: AngularFireDatabase,
    public fAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.user = fAuth.authState;
    this.user.subscribe((user) => {
          if (user) {
            this.userDetails = user;
          }
          else {
            this.userDetails = null;
          }
        }
      );
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.fAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.showLoader = true;
        this.SetUserData(result.user);
        this.showLoader = false;
      }).catch((error) => {
        this.error = true;
        // window.alert(error.message)
      })
  }

  SetUserData(user) {
    const userData = {
      password: user.uid,
      email: user.email,
    }
    firebase.database().ref('admin/credential/')
    .set({ username: userData.email, password: userData.password })
    .then((snapshot)=>{
      this.router.navigate(['dashboard']);
      return snapshot;
    })
    .catch((error)=>{
      return error;
    })
  }

  get isLoggedIn(): boolean {

    if (this.userDetails == null ) {
        return false;
      } else {

        return true;
      }
  }

  logout() {
      this.fAuth.signOut()
      .then((res) => this.router.navigate(['/admin/credential']));
    }
 }

