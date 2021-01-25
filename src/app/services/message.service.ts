import { Injectable } from "@angular/core";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable()
export class MessagingService {

  constructor(private db: AngularFireDatabase) {

  }

  getInfo() {
    return this.db.object('app/').valueChanges();
  }
}
