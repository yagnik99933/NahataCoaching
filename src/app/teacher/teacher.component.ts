import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-teacher",
  templateUrl: "./teacher.component.html",
  styleUrls: ["./teacher.component.scss"],
})
export class TeacherComponent implements OnInit {
  addTeacherControl: FormGroup;
  editControl: FormGroup;
  teacher: any;
  teacherList: any[];
  closeResult: string;
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
    this.showTeachers();
  }

  open(content, teacher) {
    this.teacher = teacher;
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
    this.addTeacherControl = this.fb.group({
      name: ["", Validators.required],
      subject: ["", Validators.required],
    });

    this.editControl = this.fb.group({
      name: ["", Validators.required],
      subject: ["", Validators.required],
    });
  }

  // this function adds a new teacher in DB.
  addTeacher() {
    this.teacher = this.addTeacherControl.value;

    var name = this.teacher.name;
    var subject = this.teacher.subject;
    var val = Math.floor(Math.random() * 10000000);
    var teacherId = "TEACH" + val;
    var entryDate = new Date().getTime();

    firebase
      .database()
      .ref("teacher/" + teacherId)
      .set({
        teacherName: name,
        teacherSubject: subject,
        teacherId: teacherId,
        entryDate: entryDate,
        status: true,
      })
      .then((snapshot) => {
        this.showTeachers();
        this.toastrService.success("Successfully.", "Teacher Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "teacher Added Successfully..";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.addTeacherControl.reset();
  }

  // This function shows list of all teachers
  showTeachers() {
    firebase
      .database()
      .ref("teacher")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.teacherList = Object.keys(object).map((e) => object[e]);
        } else {
          this.teacherList = [];
        }

        // console.log(this.teacherList);
        // this.students = data ;
        // console.log(this.students);
        return "Data";
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  updateStatus(Id, status) {
    if (status) {
      status = false;
    } else if (!status) {
      status = true;
    }
    firebase
      .database()
      .ref("teacher/" + Id)
      .update({ status: status })
      .then((snap) => {
        console.log("updated successfully");
        this.toastrService.success("Successfully.", "Status Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showTeachers();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editTeacher(teacherId, teacherName, teacherSubject) {
    this.teacher = this.editControl.value;
    if (!this.teacher.subject) {
      this.teacher.code = teacherSubject;
    }
    if (!this.teacher.name) {
      this.teacher.name = teacherName;
    }
    firebase
      .database()
      .ref("teacher/" + teacherId)
      .update({
        teacherName: this.teacher.name,
        teacherSubject: this.teacher.subject,
      })
      .then((snapshot) => {
        this.showTeachers();
        this.toastrService.success("Successfully.", "Teacher Editted", {
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

  deleteVideo(Id) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);

    firebase
      .database()
      .ref("teacher/" + Id)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Teacher Removed", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showTeachers();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
