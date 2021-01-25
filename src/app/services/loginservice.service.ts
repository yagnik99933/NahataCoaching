import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {

  time = new Date().getTime()
  validTime = this.time + (24*60*60*60);
  constructor() { }

  session: Object = { loggedIn: true, Time: this.validTime}

  maintainSession(){
      // console.log('maintainSession called....')
      // console.log(this.session)
      localStorage.setItem("Session",JSON.stringify(this.session))
  }
  //       // var x = JSON.parse(localStorage.getItem("Person"));
}
