import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  studentMobileNo: any;
  studentName: string;

  constructor(private db: AngularFireDatabase){}

  getStudentMobileNo(){
    return this.studentMobileNo;
  }

  getStudentName(){
    return this.studentName;
  }
}
