import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";
import { ShareidService } from "../services/shareid.service";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
})
export class TestComponent implements OnInit {
  showCourseName: boolean = false;
  showSubjectName: boolean = false;
  contains: boolean = false;
  showDiv: boolean = false;
  showDiv2: boolean = false;
  showTestLabel: boolean = false;

  courseList: any[];
  courseCode: any;
  courseName: string;
  courseId: any;
  subjectList: any[];
  subjectName: any;
  subjectCode: any;
  subjectId: any;
  test: any;
  testList: any[];

  addTestControl: FormGroup;
  testId: string;
  editControl: FormGroup;

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private shareId: ShareidService,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {}

  open(content, test) {
    this.test = test;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  openDelete(content, banner) {
    this.modalService.open(content);
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  ngOnInit() {
    this.createForm();
    this.showCourses();
    this.showSubjects();
  }

  createForm() {
    this.addTestControl = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      timings: ["", Validators.required],
    });

    this.editControl = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      timings: ["", Validators.required],
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

  // To show subjects acc to selected course from dropdown :
  showSubjects() {
    firebase
      .database()
      .ref("course/" + this.courseId + "/subject")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          // console.log('')
          var object = data;
          this.subjectList = Object.keys(object).map((e) => object[e]);
          return "Data";
        }
        return "";
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  showTest() {
    if (this.courseId && this.subjectId) {
      // console.log('Showtest inside');
      firebase
        .database()
        .ref(
          "course/" + this.courseId + "/subject/" + this.subjectId + "/test/"
        )
        .once("value")
        .then((snapshot) => {
          var data = snapshot.val();
          if (data) {
            this.showTestLabel = true;
            var object = data;
            this.testList = Object.keys(object).map((e) => object[e]);
            // console.log(this.testList);
            return "Success.";
          } else {
            this.testList = [];
          }
        })
        .catch((error) => {
          return error;
        });
    }
  }

  async getCourseId(code: any, name: string, Id: any, subjects: any[]) {
    this.subjectCode = "";
    this.subjectName = "";
    this.subjectId = "";
    this.testList = [];
    this.courseCode = code;
    this.courseName = name;
    if (code) {
      this.contains = false;
      this.courseId = Id;
      // sharing id with service.
      this.shareId.courseId = this.courseId;
      await this.showSubjects();
      this.subjectList = subjects;

      if (!JSON.stringify(subjects)) {
        this.showDiv = true;
      } else {
        this.showDiv = false;
        var object = this.subjectList;
        this.subjectList = Object.keys(object).map((e) => object[e]);
      }
      this.showCourseName = true;
    } else {
      this.contains = true;
    }
  }

  async getSubjectId(name: string, code: any, Id: any, test: any[]) {
    this.subjectCode = code;
    this.subjectName = name;

    if (code) {
      this.showSubjects();
      this.subjectId = Id;
      //sharing id with service.
      this.shareId.subjectId = this.subjectId;
      if (test) {
        this.showTestLabel = true;
        this.showTest();
        // console.log("Called");
      } else {
        this.showTestLabel = false;
      }

      this.showDiv2 = false;
    }
    this.showSubjectName = true;
  }

  addTest() {
    this.test = this.addTestControl.value;
    var name = this.test.name;
    var description = this.test.description;
    var timings = this.test.timings;
    var val = Math.floor(1000000 + Math.random() * 9000);
    this.testId = "TEST" + val;

    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/test/" +
          this.testId
      )
      .set({
        testId: this.testId,
        testName: name,
        testDescription: description,
        entryDate: new Date().getTime(),
        testTimings: timings,
        totalMarks: 0,
        status: true,
      })
      .then((snapshot) => {
        this.showTest();
        this.toastrService.success("Successfully.", "Test Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "Test Added Successfully..";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.addTestControl.reset();
  }

  loadQuestionComponent(Id: any) {
    // sharing TEST-id with service :
    this.shareId.testId = Id;
    // console.log(Id);
    this.router.navigate(["/question"]);
    // console.log('Call toh ho rha hai..');
  }

  loadViewResult(testId, testName, totalMarks, testTimings) {
    this.shareId.courseName = this.courseName;
    this.shareId.subjectName = this.subjectName;
    this.shareId.testId = testId;
    this.shareId.testName = testName;
    this.shareId.totalMarks = totalMarks;
    this.shareId.testTimings = testTimings;
    this.router.navigate(["/viewresult"]);
  }

  updateStatus(Id, status) {
    if (status) {
      status = false;
    } else if (!status) {
      status = true;
    }
    firebase
      .database()
      .ref(
        "course/" + this.courseId + "/subject/" + this.subjectId + "/test/" + Id
      )
      .update({ status: status })
      .then((snap) => {
        console.log("updated successfully");
        this.toastrService.success("Successfully.", "Status Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showTest();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editTest(courseId, subjectId, testId, testName, description, testTimings) {
    this.test = this.editControl.value;
    if (!this.test.name) {
      this.test.name = testName;
    }
    if (!this.test.description) {
      this.test.description = description;
    }
    if (!this.test.timings) {
      this.test.timings = testTimings;
    }
    firebase
      .database()
      .ref("course/" + courseId + "/subject/" + subjectId + "/test/" + testId)
      .update({
        testName: this.test.name,
        testDescription: this.test.description,
        testTimings: this.test.timings,
      })
      .then((snapshot) => {
        this.showTest();
        this.toastrService.success("Successfully.", "Test Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "teacher editted successfully.";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.modalService.dismissAll();
  }

  deleteTest(courseId, subjectId, testId) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);

    firebase
      .database()
      .ref("course/" + courseId + "/subject/" + subjectId + "/test/" + testId)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Test Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showTest();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
