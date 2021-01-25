import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseauthService } from "../services/firebaseauth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {

  constructor(
    public authService: FirebaseauthService ,
    public router: Router
  ){ }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   console.log(this.authService.islogged) ;
  //   if(!this.authService.islogged) {
  //     console.log('Auth guard')
  //     this.router.navigate(['admin/credential'])
  //   }
  //   return true;
  // }

}
