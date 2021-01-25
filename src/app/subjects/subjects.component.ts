import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"],
})
export class SubjectsComponent implements OnInit {
  showCourseName: boolean = false;
  addSubjectControl: FormGroup;
  subject: any;
  subjectList: any[];
  courseName: any;
  courseCode: any;
  courseList: any[];
  courseId: any;
  editControl: FormGroup;
  closeResult: string;
  showDiv: boolean = false;

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
    this.showCourses();
  }

  open(content, subject) {
    this.subject = subject;
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

  openDelete(content, banner) {
    this.modalService.open(content);
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  createForm() {
    this.addSubjectControl = this.fb.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
    });
    this.editControl = this.fb.group({
      code: [""],
      name: [""],
    });
  }

  showCourses() {
    firebase
      .database()
      .ref("course")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.courseList = Object.keys(object).map((e) => object[e]);
        } else {
          this.courseList = [];
        }
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  getCourseId(code: any, name: string, Id: any, subjects: any[]) {
    this.courseCode = code;
    this.courseName = name;
    this.courseId = Id;
    // console.log("Subject details"+JSON.stringify(subjects))
    if (!JSON.stringify(subjects)) {
      this.showDiv = true;
    } else {
      this.showDiv = false;
    }
    this.showCourseName = true;
    this.showSubjects();
  }

  addSubject() {
    // document.getElementById("exampleInputPassword2");

    this.subject = this.addSubjectControl.value;
    // console.log(this.subject);
    var code = this.subject.code;
    var name = this.subject.name;
    var val = Math.floor(Math.random() * 10000000);
    var subjectId = "SUB" + val;
    var entryDate = new Date().getTime();

    firebase
      .database()
      .ref("course/" + this.courseId + "/subject/" + subjectId)
      .set({
        subjectCode: code,
        subjectName: name,
        subjectId: subjectId,
        entryDate: entryDate,
        status: true,
      })
      .then((snapshot) => {
        // console.log(snapshot);
        this.showSubjects();
        this.toastrService.success("Successfully.", "Subject Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "Course Added Successfully..";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.addSubjectControl.reset();
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
          var object = data;
          this.subjectList = Object.keys(object).map((e) => object[e]);
          // console.log(this.subjectList);
          return "Data";
        } else {
          this.subjectList = [];
        }
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  editSubject(courseId, subjectId, subjectCode, subjectName) {
    this.subject = this.editControl.value;
    if (!this.subject.code) {
      this.subject.code = subjectCode;
    }
    if (!this.subject.name) {
      this.subject.name = subjectName;
    }

    firebase
      .database()
      .ref("course/" + this.courseId + "/subject/" + subjectId)
      .update({
        subjectCode: this.subject.code,
        subjectName: this.subject.name,
      })
      .then((snapshot) => {
        // console.log(snapshot);
        this.showSubjects();
        this.toastrService.success("Successfully.", "Subject Edited", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "Subject edited successfully.";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.modalService.dismissAll();
  }

  updateStatus(Id, status, courseId) {
    if (status) {
      status = false;
    } else {
      status = true;
    }

    firebase
      .database()
      .ref("course/" + courseId + "/subject/" + Id)
      .update({ status: status })
      .then((snapshot) => {
        this.showSubjects();
        this.toastrService.success("Successfully.", "Subject Status Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
      })
      .catch((error) => {
        return error;
      });
  }

  deleteSubject(courseId, subjectId) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);

    firebase
      .database()
      .ref("course/" + courseId + "/subject/" + subjectId)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Subject Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showSubjects();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
