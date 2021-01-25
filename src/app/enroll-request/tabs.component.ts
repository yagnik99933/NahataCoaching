import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit {
  page = 1;
  count = 0;
  tableSize = 100;
  tableSizes = [5, 10, 15, 20, 40, 60];

  studentsRecord: any[];
  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.showStudentRecord();
  }

  showStudentRecord() {
    firebase
      .database()
      .ref("student")
      .on("value", (snapshot) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.studentsRecord = Object.keys(object).map((e) => object[e]);
          // console.log(this.studentsRecord);
        } else {
          this.studentsRecord = [];
        }
      });
  }

  changeEnrollStatus(mobileNo: any, courseEnrollmentStatus: any) {
    if (courseEnrollmentStatus === "PENDING") {
      firebase
        .database()
        .ref("student/" + mobileNo)
        .update({ courseEnrollmentStatus: "ACCEPTED" })
        .then((snapshot) => {
          this.showStudentRecord();
          return snapshot;
        })
        .catch((error) => {
          return error;
        });
    }

    if (courseEnrollmentStatus === "ACCEPTED") {
      firebase
        .database()
        .ref("student/" + mobileNo)
        .update({ courseEnrollmentStatus: "REJECTED" })
        .then((snapshot) => {
          this.showStudentRecord();
          return snapshot;
        })
        .catch((error) => {
          return error;
        });
    }

    if (courseEnrollmentStatus === "REJECTED") {
      firebase
        .database()
        .ref("student/" + mobileNo)
        .update({ courseEnrollmentStatus: "ACCEPTED" })
        .then((snapshot) => {
          this.showStudentRecord();
          return snapshot;
        })
        .catch((error) => {
          return error;
        });
    }
  }

  // For pagination :
  onTableDataChange(event) {
    this.page = event;
    this.showStudentRecord();
  }

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.showStudentRecord();
  }
}
