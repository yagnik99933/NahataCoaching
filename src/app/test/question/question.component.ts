import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";
import { retry } from "rxjs/operators";
import { ShareidService } from "src/app/services/shareid.service";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  showLabel: boolean = false;
  uploadLabel: boolean = false;
  showQuestion: boolean = false;

  courseId: any;
  subjectId: any;
  testId: any;
  totalMarks: number;
  questionId: any;
  question: any;
  questionList: any[];
  // used for input field :
  questionMarks: any = 1;

  // used for question marks logic:
  qtMarks: number;
  questionImageId: any;
  negativeMarks: any = 0;
  url = "";
  correctOption: string;
  options: any[] = ["OptionA", "OptionB", "OptionC", "OptionD"];

  addQuestionControl: FormGroup;
  file: File;

  constructor(
    private shareId: ShareidService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private router: Router,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.shareId.getCourseId();
    this.subjectId = this.shareId.getSubjectId();
    this.testId = this.shareId.getTestId();
    console.log(this.courseId);
    console.log(this.subjectId);
    console.log(this.testId);
    if (!this.courseId || !this.subjectId || !this.testId) {
      this.router.navigate(["/test"]);
    }
    this.createForm();
    this.showQuestions();
    this.getTotalMarks();
    console.log(this.totalMarks);
  }

  createForm() {
    this.addQuestionControl = this.fb.group({
      text: ["", Validators.required],
      optionA: ["", Validators.required],
      optionB: ["", Validators.required],
      optionC: ["", Validators.required],
      optionD: ["", Validators.required],
      correctOption: ["", Validators.required],
      questionMarks: [""],
      negativeMarks: [""],
      image: [""],
    });
  }

  openPreview(content) {
    this.modalService.open(content);
  }

  showQuestions() {
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
        if (data) {
          this.showQuestion = true;
          var object = data;
          this.questionList = Object.keys(object).map((e) => object[e]);
          this.questionList = this.questionList.reverse();
          // console.log('ShowQuestion Called....')
          // console.log(this.questionList);
        } else {
          this.questionList = [];
          this.showQuestion = false;
        }
      })
      .catch((error) => {
        return error;
      });
  }

  // Uploading Files functions below :
  handleFiles(event) {
    this.file = event.target.files[0];
    this.showLabel = false;
  }

  //method to upload file at firebase storage
  async uploadFile() {
    if (this.file) {
      this.uploadLabel = true;
      var val = Math.floor(Math.random() * 10000000);
      this.questionImageId = "QUES" + val;
      const snap = this.storage.upload(
        "question/" + this.questionImageId,
        this.file
      ); //upload task
      this.getUrl(await snap);
    }
    // else{
    //   alert('Please select an image');
    // }
  }

  async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.url = url; //store the URL
    this.uploadLabel = false;
    this.showLabel = true;
    // console.log("URL:::"+this.url);
    if (this.url) {
      firebase
        .database()
        .ref(
          "course/" +
            this.courseId +
            "/subject/" +
            this.subjectId +
            "/test/" +
            this.testId +
            "/question/" +
            this.questionId
        )
        .update({ imageUrl: this.url })
        .then((snapshot) => {
          return snapshot;
        })
        .catch((error) => {
          return error;
        });
    }
  }

  async addQuestion(questionMarks: any, negativeMarks: any) {
    this.question = this.addQuestionControl.value;

    if (!this.question.questionMarks) {
      this.question.questionMarks = questionMarks;
    }
    if (!this.question.negativeMarks) {
      this.question.negativeMarks = negativeMarks;
    }
    this.qtMarks = this.question.questionMarks;
    // console.log('in add question '+ this.qtMarks)
    await this.uploadFile();
    this.postQuestion();
    this.showQuestions();
  }

  postQuestion() {
    var val = Math.floor(Math.random() * 10000000);
    this.questionId = "QUES" + val;
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/test/" +
          this.testId +
          "/question/" +
          this.questionId
      )
      .set({
        questionText: this.question.text,
        optionA: this.question.optionA,
        optionB: this.question.optionB,
        optionC: this.question.optionC,
        optionD: this.question.optionD,
        correctOption: this.question.correctOption,
        questionMarks: this.question.questionMarks,
        negativeMarks: this.question.negativeMarks,
        imageUrl: this.url,
        questionId: this.questionId,
        status: true,
        entryDate: new Date().getTime(),
      })
      .then((snapshot) => {
        this.uploadLabel = false;
        this.showLabel = true;
        this.updateTotalmarks();
        this.toastrService.success("Successfully.", "Question Added", {
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
    this.addQuestionControl.reset({
      questionMarks: 1,
      negativeMarks: 0,
    });
    // console.log('Reset Done.')
  }

  deleteQuestion(imageUrl: any, questionMarks, questionId) {
    this.questionId = questionId;
    this.qtMarks = questionMarks;
    if (imageUrl) {
      this.storage.ref("question/" + this.questionImageId).delete();
    }
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/test/" +
          this.testId +
          "/question/" +
          this.questionId
      )
      .remove()
      .then((snapshot) => {
        this.showQuestions();
        this.toastrService.error("Successfully.", "Question Delted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return snapshot;
      })
      .catch((error) => {
        return error;
      });
    this.deleteTotalMarks();
  }

  getTotalMarks() {
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
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        this.totalMarks = data.totalMarks;
        // console.log("Total marks::"+this.totalMarks);
      })
      .catch((error) => {
        return error;
      });
  }

  updateTotalmarks() {
    this.totalMarks += this.qtMarks;
    // console.log(this.totalMarks);
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
      .update({ totalMarks: this.totalMarks })
      .then((snapshot) => {
        // console.log('Total Marks updated..')
      })
      .catch((error) => {
        return error;
      });
  }

  deleteTotalMarks() {
    this.totalMarks -= this.qtMarks;

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
      .update({ totalMarks: this.totalMarks })
      .then((snapshot) => {
        // console.log('Total Marks updated..')
      })
      .catch((error) => {
        return error;
      });
  }
}
