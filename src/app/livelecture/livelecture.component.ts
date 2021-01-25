import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

import { Course } from "../models/course";

@Component({
  selector: "app-livelecture",
  templateUrl: "./livelecture.component.html",
  styleUrls: ["./livelecture.component.scss"],
})
export class LivelectureComponent implements OnInit {
  showCourseName: boolean = false;
  showSubjectName: boolean = false;
  contains: boolean = false;
  showDiv: boolean = false;
  showDiv2: boolean = false;

  courseList: any[];
  courseCode: any;
  courseName: string;
  courseId: any;
  subjectList: any[];
  subjectName: any;
  subjectCode: any;
  subjectId: any;
  liveVideo: any;
  liveVideoList: any[];

  addVideoControl: FormGroup;

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.createForm();
    this.showCourses();
    this.showSubjects();
  }
  open(content, liveVideo) {
    this.liveVideo = liveVideo;
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

  createForm() {
    this.addVideoControl = this.fb.group({
      name: ["", Validators.required],
      link: ["", Validators.required],
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
        } else {
          this.subjectList = [];
        }
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  showLiveVideos() {
    if (this.courseId && this.subjectId) {
      firebase
        .database()
        .ref(
          "course/" +
            this.courseId +
            "/subject/" +
            this.subjectId +
            "/livevideo/"
        )
        .once("value")
        .then((snapshot) => {
          var data = snapshot.val();
          if (data) {
            var object = data;
            this.liveVideoList = Object.keys(object).map((e) => object[e]);
            // console.log(this.liveVideoList);
          } else {
            this.liveVideoList = [];
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
    this.liveVideoList = [];
    this.courseCode = code;
    this.courseName = name;
    if (code) {
      this.contains = false;
      this.courseId = Id;

      await this.showSubjects();
      this.subjectList = subjects;
      // console.log("Subject details"+JSON.stringify(subjects))

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

  async getSubjectId(name: string, code: any, Id: any, liveVideo: any[]) {
    this.subjectCode = code;
    this.subjectName = name;

    if (code) {
      this.showSubjects();
      this.subjectId = Id;
      if (liveVideo && this.subjectId) {
        this.showDiv2 = true;
        this.showLiveVideos();
      } else {
        this.showDiv2 = false;

        console.log("Else");
      }
      this.showSubjectName = true;
    }
  }

  addVideo() {
    // document.getElementById("exampleInputPassword2");

    this.liveVideo = this.addVideoControl.value;
    // console.log(this.liveVideo);
    var name = this.liveVideo.name;
    var link = this.liveVideo.link;
    var val = Math.floor(Math.random() * 10000000);
    var liveId = "LIVE" + val;
    // console.log( this.courseId)
    // console.log( this.subjectId)
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/livevideo/" +
          liveId
      )
      .set({
        liveId: liveId,
        videoName: name,
        entryDate: new Date().getTime(),
        videoLink: link,
        timeSlot: "",
        status: true,
        openLecture: false,
      })
      .then((snapshot) => {
        // console.log(snapshot);
        this.showLiveVideos();
        this.toastrService.success("Successfully.", "Video Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "LiveVideo Added Successfully..";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.addVideoControl.reset();
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
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/livevideo/" +
          Id
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
        this.showLiveVideos();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editVideo(Id, videoName, videoLink) {
    this.liveVideo = this.addVideoControl.value;
    if (!this.liveVideo.videoName) {
      this.liveVideo.videoName = videoName;
    }
    if (!this.liveVideo.videoLink) {
      this.liveVideo.videoLink = videoLink;
    }
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/livevideo/" +
          Id
      )
      .update({
        videoName: this.liveVideo.videoName,
        videoLink: this.liveVideo.videoLink,
      })
      .then((snapshot) => {
        this.showCourses();
        this.toastrService.success("Successfully.", "Course Editted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "Course editted successfully.";
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
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/livevideo/" +
          Id
      )
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Video Removed", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showLiveVideos();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
