import { Component, OnInit } from "@angular/core";
import { ChatService } from "../services/chat.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseOperation } from "@angular/fire/database/interfaces";
import { first } from "rxjs/operators";
import { Subject } from "rxjs";
import { Observable } from "rxjs/Rx";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  // All boolean variables :
  showTeacherLabel: boolean = false;
  selectTeacherLabel: boolean = false;
  chatListLabel: boolean = false;

  // To maintain color of button in studentList :
  toogle: boolean = true;
  status: string = "Enable";

  // Related to teacher :
  teacherId: any;
  teacherName: any;
  teacherSubject: any;
  teacherList: any[];

  // Related to student :
  studentList: any[];
  studentName: string;
  studentMobileNo: any;

  // Related to chat :
  chatId: any;
  chatList: any[];
  chatText: string;
  chatTime: any;
  chat: any;
  sender: any;

  // To display latest chat in studentList in chat :
  text: string;

  // For implemenying Search Bar
  searchTerm: string;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  addChatControl: FormGroup;
  clickedIndex: number;

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.createForm();
    this.showTeachers();
    this.showStudents();
    // this.showChats(this.studentMobileNo);
    if (this.chatService.studentMobileNo) {
      // this.chatService.studentMobileNo = this.chatService.studentMobileNo.substring(0, this.chatService.studentMobileNo.length - 1);
      //   console.log(this.chatService.studentMobileNo);
      this.searchTerm = this.chatService.studentMobileNo;
      const inputField = document.querySelector("#query");

      Observable.combineLatest(this.searchTerm, this.searchTerm).subscribe(
        (value: any) => {
          // console.log('valuee-->'+value);

          this.fireDatabaseName(value[0], value[1]).subscribe((studentList) => {
            this.studentList = studentList;
            inputField.dispatchEvent(new Event("input"));
            this.showChats(this.chatService.studentMobileNo);
            // console.log(this.studentList)
          });
        }
      );
    }
    Observable.combineLatest(this.startobs, this.endobs).subscribe(
      (value: any) => {
        this.fireDatabaseName(value[0], value[1]).subscribe((studentList) => {
          this.studentList = studentList;
          // console.log(this.studentList)
        });
      }
    );
  }

  createForm() {
    this.addChatControl = this.fb.group({
      chatText: ["", Validators.required],
    });
  }

  showTeachers() {
    firebase
      .database()
      .ref("teacher/")
      .on("value", (snapshot) => {
        var data = snapshot.val();
        var object = data;
        this.teacherList = Object.keys(object).map((e) => object[e]);
        return "Data";
      });
  }

  showStudents() {
    firebase
      .database()
      .ref("student/")
      .on("value", (snapshot) => {
        this.studentList = [];
        var data = snapshot.val();
        var object = data;
        this.studentList = Object.keys(object).map((e) => object[e]);
        // console.log(this.studentList);
        return "Data";
      });
  }

  showChats(mobileNo: number) {
    this.studentMobileNo = mobileNo;
    firebase
      .database()
      .ref("chat/" + this.studentMobileNo)
      .on("value", (snapshot: any) => {
        var data = snapshot.val();
        var object = data;
        this.chatListLabel = true;
        this.chatList = object;
        if (data) {
          this.chatList = Object.keys(object).map((e) => object[e]);

          // Sorting on basis of entry date :
          let sortedInput = this.chatList
            .slice()
            .sort((a, b) => b.entryDate - a.entryDate);
          // console.log(sortedInput.reverse());
          this.chatList = sortedInput;
          this.update();
        } else {
          this.chatList = [];
        }

        // setTimeout(() => {
        //   if(this.chatList.length){

        //   }
        // }, 2000);

        // var length  = this.chatList; // 5
        // if(this.chatList.length == length+1){
        //   this.ngOnInit();
        // }
        // this.showChats(mobileNo);
        // console.log('Got Chat'+ this.chatList);

        // for (let index = 0; index < this.chatList.length; index++) {
        //   let length = this.chatList.length;
        //   this.text = this.chatList[length - 1].chatText;
        // }
      });
  }

  update() {
    this.db
      .list("chat/" + this.studentMobileNo)
      .valueChanges()
      .subscribe((snap) => {
        // console.log("Updated method  data :"+ snap);
      });
  }

  getTeacherId(teacherId: any, teacherName: string, teacherSubject: string) {
    this.teacherId = teacherId;
    this.teacherName = teacherName;
    this.teacherSubject = teacherSubject;
  }

  postChat() {
    if (!this.teacherId) {
      this.showTeacherLabel = true;
    } else {
      this.showTeacherLabel = false;
    }

    this.chat = this.addChatControl.value;
    var val = new Date().getTime();
    this.chatId = "CHAT" + val;
    firebase
      .database()
      .ref("chat/" + this.studentMobileNo + "/" + this.chatId)
      .set({
        chatText: this.chat.chatText,
        chatId: this.chatId,
        entryDate: new Date().getTime(),
        senderName: this.teacherName,
        sender: "teacher",
        senderId: this.teacherId,
        status: true,
        teacherId: this.teacherId,
        mobileNo: this.studentMobileNo,
        teacherName: this.teacherName,
      })
      .then((snapshot) => {
        this.showChats(this.studentMobileNo);
        return snapshot;
      })
      .catch((error) => {
        return error;
      });
    this.addChatControl.reset();
  }

  getStudentDetails(name: string, mobileNo: any, index: number) {
    this.clickedIndex = index;
    // console.log(mobileNo);
    this.showChats(mobileNo);

    setTimeout(() => {}, 2000);
    this.update();
    // To change color of button :
    this.toogle = !this.toogle;
    this.status = this.toogle ? "Enable" : "Disable";

    // getting student data :
    this.studentName = name;
    this.studentMobileNo = mobileNo;
  }

  // Implementing Search :
  async filterStudentList($event, search: string) {
    if (search) {
      this.showStudents();
    }
    let q = $event.target.value;
    // console.log(q)
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");
  }

  fireDatabaseName(start, end) {
    if (!start) {
      this.showStudents();
    }
    // Searching based on name of student :
    if (/^[a-z]+$/i.test(start)) {
      return this.db
        .list("student", (ref) =>
          ref
            .orderByChild("name")
            .startAt(start.toUpperCase())
            .endAt(end.toUpperCase())
            .limitToFirst(10)
        )
        .valueChanges();
    } else {
      // Searching based on mobile no of student :
      if (!start.startsWith("+91", 0) && !end.startsWith("+91", 0)) {
        start = "+91" + start;
        end = "+91" + end;
      }
      // console.log('-----Else-----');
      return this.db
        .list("student", (ref) =>
          ref
            .orderByChild("mobileNo")
            .startAt(start)
            .endAt(end)
            .limitToFirst(10)
        )
        .valueChanges();
    }
  }
}
