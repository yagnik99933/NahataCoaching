import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { ResultService } from "src/app/services/result.service";

@Component({
  selector: "app-studentresult",
  templateUrl: "./studentresult.component.html",
  styleUrls: ["./studentresult.component.scss"],
})
export class StudentresultComponent implements OnInit {
  courseId: any;
  subjectId: any;
  mobileNo: any;
  testId: any;
  selectedOption: any;
  questionList: any[] = [];
  list: any[] = [];

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    this.courseId = this.resultService.getCourseId();
    this.subjectId = this.resultService.getSubjectId();
    this.mobileNo = this.resultService.getMobileNo();
    this.testId = this.resultService.getTestId();
    // console.log('Mobile Number'+ this.mobileNo)
    if (!this.mobileNo) {
      this.router.navigate(["/viewresult"]);
    }
    this.showQuestions();
    this.getQuestion();
  }

  showQuestions() {
    firebase
      .database()
      .ref("student/" + this.mobileNo + "/test/" + this.testId + "/ques/")
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        // console.log(data);
        if (data) {
          var object = data;
          this.list = Object.keys(object).map((e) => object[e]);
          // console.log('Selected option '+this.list);
          this.list.forEach((question) => {
            this.selectedOption = question.selectedOption;
            // console.log(this.selectedOption);
          });
          return "Success.";
        }
      })
      .catch((err) => {
        return err;
      });
  }

  getQuestion() {
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/test/" +
          this.testId +
          "/question/"
      )
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        // console.log(data);
        if (data) {
          var object = data;
          this.questionList = Object.keys(object).map((e) => object[e]);
          // console.log(this.questionList);
          return "Success.";
        } else {
          this.questionList = [];
        }
      });
  }
}
