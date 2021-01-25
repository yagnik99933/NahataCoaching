import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseauthService } from '../services/firebaseauth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  show: boolean = false;
  constructor(public firebaseAuth: FirebaseauthService, private router: Router) { }

  ngOnInit() {

    // if(this.firebaseAuth.isLoggedIn ){
    //   this.show = true;
    //   console.log('SIdebar')
    // //   const currentRoute = this.router.url;
    // //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    // //   this.router.navigate([currentRoute]); // navigate to same route
    // // });
    // }
  }

}
