import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-studentlist",
  templateUrl: "./studentlist.component.html",
  styleUrls: ["./studentlist.component.scss"],
})
export class StudentlistComponent implements OnInit {
  showCourseName: boolean = false;

  student: any;
  courseName: any;
  courseCode: any;
  courseId: any;

  studentList: any[];
  courseList: any[];
  checked: boolean = true;
  page = 1;
  count = 0;
  tableSize = 100;
  tableSizes = [5, 10, 15, 20, 40, 60];

  // For implemenying Search Bar
  searchTerm: string;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  closeResult: string;
  addStudentControl: FormGroup;

  constructor(
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  open(content, student) {
    this.student = student;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
  }

  ngOnInit() {
    this.showCourses();
    this.getStudentData();
    this.createForm();

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
    this.addStudentControl = this.fb.group({
      name: ["", Validators.required],
    });
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
          this.studentList = Object.keys(object).map((e) => object[e]);
        } else {
          this.studentList = [];
        }
      })
      .catch((error) => {
        return error;
      });
  }

  showCourses() {
    firebase
      .database()
      .ref("course")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        var object = data;
        this.courseList = Object.keys(object).map((e) => object[e]);
        return "Data";
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  getCourseId(code: any, name: string, Id: any) {
    this.courseCode = code;
    this.courseName = name;
    this.courseId = Id;
    // console.log("Subject details"+JSON.stringify(subjects))
    // if(!JSON.stringify(subjects)){
    //   this.showDiv = true;
    // }
    // else{
    //   this.showDiv = false;
    // }
    this.showCourseName = true;
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

  // Implementing Search :
  async filterStudentList($event, search: string) {
    if (search) {
      this.getStudentData();
    }
    let q = $event.target.value;
    // console.log(q)
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

  editStudent(mobileNo, name, courseId, courseName, courseCode) {
    // console.log(mobileNo);
    // console.log(name);
    // console.log(this.courseCode);
    // console.log(this.courseName);
    // console.log(this.courseId);

    if (!this.addStudentControl.value.name) {
      name = name;
    } else {
      name = this.addStudentControl.value.name;
    }
    if (!this.courseId) {
      this.courseCode = courseCode;
      this.courseName = courseName;
      this.courseId = courseId;
    }

    firebase
      .database()
      .ref("student/" + mobileNo)
      .update({
        courseCode: this.courseCode,
        courseId: this.courseId,
        courseName: this.courseName,
        name: name,
      })
      .then((snapshot) => {
        this.getStudentData();
        this.toastrService.success("Successfully.", "Student Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        // this.courseCode = '';
        // this.courseId = '';
        // this.courseCode = '';
        this.showCourseName = false;
        this.courseCode = "";

        return "teacher editted successfully.";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.modalService.dismissAll();
  }
}
