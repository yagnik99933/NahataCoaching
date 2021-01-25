import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgSelectConfig } from "@ng-select/ng-select";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

// import { title } from 'process';
import { Observable } from "rxjs";
import { MessagingService } from "../services/message.service";

@Component({
  selector: "app-sendmessage",
  templateUrl: "./sendmessage.component.html",
  styleUrls: ["./sendmessage.component.scss"],
})
export class SendmessageComponent implements OnInit {
  // Url For Development:
  // url = 'http://localhost:5001/nahatacoaching/us-central1/sendNotification';

  // URL for Production :
  url: string =
    "https://us-central1-nahatacoaching.cloudfunctions.net/sendNotification";

  notification: any;
  addNotificationControl: FormGroup;
  newNotification: Observable<any>;
  correctOption: string;
  options: any[] = [
    "Send to all students",
    "Send to the students of a particular course",
    "Send to only one student",
  ];
  selectedCourse: any;
  selectedStudent: any;
  courseList: any[] = [];
  student: any;
  // mobileNo: any = '';
  studentList: any[] = [];
  cutoff: any;
  courseNotification: any[] = [];

  deleteLabel: boolean = false;

  constructor(
    public messageService: MessagingService,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    public http: HttpClient,
    private config: NgSelectConfig,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
    this.showCourses();
    this.getStudentData();
  }

  createForm() {
    this.addNotificationControl = this.fb.group({
      topic: ["", Validators.required],
      title: ["", Validators.required],
      body: ["", Validators.required],
      // course: ['', Validators.required],
      // student: ['', Validators.required]
    });
  }

  // This function shows list of all courses
  showCourses() {
    firebase
      .database()
      .ref("course")
      .on("value", (snapshot: any) => {
        var data = snapshot.val();

        if (data) {
          var object = data;
          this.courseList = Object.keys(object).map((e) => object[e]);
        } else {
          this.courseList = [];
        }
      });
  }

  // get list of students :
  getStudentData() {
    firebase
      .database()
      .ref("student")
      .on("value", (snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.studentList = Object.keys(object).map((e) => object[e]);
        } else {
          this.studentList = [];
        }
      });
  }

  sendNotification(student) {
    // console.log(this.selectedStudent)
    // console.log(this.correctOption)

    var token;
    var sendingToTopic = true;
    var mobileNo;

    if (this.correctOption === "Send to all students") {
      // Send to all Students :
      this.correctOption = "nahata";
    } else if (
      this.correctOption === "Send to the students of a particular course"
    ) {
      // Send to student of particular Course
      this.correctOption = this.selectedCourse;
      // console.log(this.selectedCourse)
    } else if (this.correctOption === "Send to only one student") {
      // Send to indiviual student
      this.correctOption = "";
      token = this.selectedStudent.token;
      mobileNo = this.selectedStudent.mobileNo;
      // console.log('Token : '+token)
      // console.log('Mobile'+mobileNo)
      sendingToTopic = false;
    }
    // console.log('Title : '+typeof this.addNotificationControl.value.title)
    // console.log(sendingToTopic)

    // Error Spot
    if (this.selectedStudent) {
      var message = {
        method: "POST",
        notification: {
          title: this.addNotificationControl.value.title,
          body: this.addNotificationControl.value.body,
          topic: this.correctOption,
          token: token,
          sendingToTopic: sendingToTopic,
          mobileNo: mobileNo,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.http.post(this.url, message).subscribe();
      this.toastrService.success("Successfully.", "Message Sent", {
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: "toast-center-center",
      });
    } else {
      var messages = {
        method: "POST",
        notification: {
          title: this.addNotificationControl.value.title,
          body: this.addNotificationControl.value.body,
          topic: this.correctOption,
          token: token,
          sendingToTopic: sendingToTopic,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.http.post(this.url, messages).subscribe();
      this.toastrService.success("Successfully.", "Message Sent", {
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: "toast-center-center",
      });
    }

    this.addNotificationControl.reset();
  }

  deleteNotification() {
    // this will delete the all students DB :
    // For 7 days :
    var days = 7 * 24 * 60 * 60 * 1000;
    var currentStamp = new Date().getTime();
    this.cutoff = currentStamp - days;
    // console.log(typeof  this.cutoff)
    // console.log(this.cutoff)
    firebase
      .database()
      .ref("notification/external/nahata/")
      .orderByKey()
      .endAt("" + this.cutoff)
      .on("child_added", function (snapshot) {
        snapshot.ref.remove();
        // console.log('Deleted...!!!');
        this.toastrService.error("Successfully.", "Notifications Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
      });

    // this will delete the students of particular course  :
    firebase
      .database()
      .ref("notification/external/course/")
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          // 7 Days logic :
          var days = 7 * 24 * 60 * 60 * 1000;
          var currentStamp = new Date().getTime();
          var cutoff = currentStamp - days;
          // console.log(currentStamp)
          firebase
            .database()
            .ref("notification/external/course/" + childSnapshot.key)
            .orderByKey()
            .endAt("" + cutoff)
            .on("child_added", function (snapshot) {
              snapshot.ref.remove();
              this.toastrService.error(
                "Successfully.",
                "Notifications Deleted",
                {
                  timeOut: 3000,
                  easeTime: 1000,
                  progressBar: true,
                  positionClass: "toast-center-center",
                }
              );
            });
        });
      });

    // this will delete the notification of indivual student  :
    firebase
      .database()
      .ref("notification/external/student/")
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          // 7 days logic :
          var days = 7 * 24 * 60 * 60 * 1000;
          var currentStamp = new Date().getTime();
          var cutoff = currentStamp - days;
          // console.log(currentStamp)
          firebase
            .database()
            .ref("notification/external/student/" + childSnapshot.key)
            .orderByKey()
            .endAt("" + cutoff)
            .once("child_added", function (snapshot) {
              snapshot.ref.remove();
              this.toastrService.error(
                "Successfully.",
                "Notifications Deleted",
                {
                  timeOut: 3000,
                  easeTime: 1000,
                  progressBar: true,
                  positionClass: "toast-center-center",
                }
              );
            });
        });
      });
    this.deleteLabel = true;
  }

  hideLabel() {
    this.deleteLabel = false;
  }
}
