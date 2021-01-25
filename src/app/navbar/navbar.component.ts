import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {  Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import { ChatService } from '../services/chat.service';
import { FirebaseauthService } from '../services/firebaseauth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {

  public sidebarOpened = false;
  show: boolean = false;

  // Notification related :
  notificationList: any[];
  recentList: any[] = [];
  notificationLength: number = 0;
  notificationStatus: boolean;

  constructor(config: NgbDropdownConfig, private router: Router, private db: AngularFireDatabase,
    private chatService: ChatService, public firebaseAuth: FirebaseauthService) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    // console.log(this.firebaseAuth.isLoggedIn)

    // if(this.firebaseAuth.isLoggedIn){


    //   this.show = true;
    //   const currentRoute = this.router.url;
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([currentRoute]); // navigate to same route
    // });
    // }
    this.showNotification();
    // To update the notification list :
    this.update();


  }

  showNotification(){

    // To get notifications :
    firebase.database().ref('notification/internal/')
    .on('value', (snapshot: any)=>{
      var data = snapshot.val();
      var object = data;
      if(data){
        this.notificationList = Object.keys(object).map(e=>object[e]);
        var recentList = [];
        this.notificationList.forEach(data =>{
          // console.log(data.status)

          if(data.status){
            // Updating the list acc. to status :
            recentList.push(data)
            // console.log(recentList )
            this.notificationLength = recentList.length;
            this.update();
            // console.log(this.notificationLength )
          }
          else{
            this.notificationLength = recentList.length;
          }
        })

        // console.log("Recent List"+recentList)
        // console.log(this.notificationList)
      }
    });
  }

  // For live updates :
  update(){
    this.db.list('notification/internal/').valueChanges()
    .subscribe((snap)=>{});
  }

  loadChatComponent(senderName: string, mobileNo: any, intChatId: any, status: boolean){
    // console.log(senderName);
    // console.log(mobileNo);

    // Passing values(student Mobile No & sender Name) to Chat service :
    this.chatService.studentMobileNo = mobileNo;
    this.chatService.studentName = senderName;


    // Set status of notification to false :
    if(status){
      firebase.database().ref('notification/internal/'+intChatId)
      .update({ status: false })
      .then((snapshot)=>{
        this.showNotification();
        this.update();
      })
      .catch((error)=>{
        return error;
      });
    }

     // Routing to chat component :
    if(this.router.url !='/chat'){
      // console.log(this.router.url)
      this.router.navigate(['chat']);
    }
    else{
      const currentRoute = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentRoute]); // navigate to same route
    });
    }

  }

  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    }
    else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }

}




