import { Component, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import * as firebase from "firebase";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { Student } from "../models/student";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs/Rx";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TablesComponent implements OnInit {
  students: any[];
  checked: boolean = true;
  page = 1;
  count = 0;
  tableSize = 500;
  tableSizes = [5, 10, 15, 20, 40, 60];

  // For implemenying Search Bar
  searchTerm: string;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(
    private db: AngularFireDatabase,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getStudentData();

    // To implement Search :
    Observable.combineLatest(this.startobs, this.endobs).subscribe(
      (value: any) => {
        this.fireDatabaseName(value[0], value[1]).subscribe((studentList) => {
          this.students = studentList;
          // console.log(this.studentList)
        });
      }
    );
  }

  getStudentData() {
    firebase
      .database()
      .ref("student")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.students = Object.keys(object).map((e) => object[e]);
        } else {
          this.students = [];
        }
      })
      .catch((error) => {
        return error;
      });
  }

  change($event: MatSlideToggleChange, mobileNo, verified) {
    if ($event) {
      console.log(verified);
      if (verified == true) {
        this.getStudentData();
        firebase
          .database()
          .ref("student/" + mobileNo)
          // .child('verified')
          .update({ verified: false })
          .then((snapshot) => {
            this.toastrService.success("Successfully.", "Student Unverified", {
              timeOut: 3000,
              easeTime: 1000,
              progressBar: true,
              positionClass: "toast-center-center",
            });
          });
      }
      if (verified == false) {
        this.getStudentData();
        firebase
          .database()
          .ref("student/" + mobileNo)
          // .child('verified')
          .update({ verified: true })
          .then((snapshot) => {
            this.toastrService.success("Successfully.", "Student Verified", {
              timeOut: 3000,
              easeTime: 1000,
              progressBar: true,
              positionClass: "toast-center-center",
            });
          });
      }
    }
  }

  // Implementing Search :
  async filterStudentList($event, search: string) {
    // console.log(search);
    if (search) {
      this.getStudentData();
    }
    let q = $event.target.value;
    console.log(q);
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");
  }

  fireDatabaseName(start, end) {
    if (!start) {
      this.getStudentData();
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

  // For pagination :
  onTableDataChange(event) {
    this.page = event;
    this.getStudentData();
  }

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getStudentData();
  }
}
