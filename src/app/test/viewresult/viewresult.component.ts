import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { countReset } from "console";
import * as firebase from "firebase";
import { element } from "protractor";
import { ResultService } from "src/app/services/result.service";
import { ShareidService } from "src/app/services/shareid.service";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-viewresult",
  templateUrl: "./viewresult.component.html",
  styleUrls: ["./viewresult.component.scss"],
})
export class ViewresultComponent implements OnInit {
  courseId: any;
  courseName: any;
  subjectId: any;
  subjectName: any;

  testId: any;
  testName: any;
  securedMarks: any[] = [];
  testCompleted: number;
  totalMarks: any;
  testTimings: any;

  resultList: any[] = [];
  studentList: any[] = [];

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private shareId: ShareidService,
    private resultService: ResultService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.shareId.courseId;
    this.courseName = this.shareId.courseName;
    this.subjectId = this.shareId.subjectId;
    this.subjectName = this.shareId.subjectName;
    this.testId = this.shareId.testId;
    this.testName = this.shareId.testName;
    this.totalMarks = this.shareId.totalMarks;
    this.testTimings = this.shareId.testTimings;

    if (!this.courseId) {
      this.router.navigate(["/test"]);
    }
    this.showResult();
  }

  public SavePDF() {
    var data = document.getElementById("content"); //Id of the table
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("result.pdf"); // Generated PDF

      this.toastrService.success("Successfully.", "Result Downloaded", {
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: "toast-center-center",
      });
      return "teacher Added Successfully..";
    });
  }
  // showResult(){
  //   firebase.database().ref('student/')
  //   .once('value')
  //   .then((snapshot)=>{
  //     var data = snapshot.val();
  //     var object = data;
  //     this.studentList = Object.keys(object).map(e=>object[e]);
  //     console.log(this.studentList);
  //     this.studentList.forEach(data => {
  //       // var object = data
  //       // data = Object.keys(object).map(e=>object[e]);
  //       // console.log('DATA ---'+data.test)

  //       if(data.test){
  //         var object= data.test;
  //         data.test = Object.keys(object).map(e=>object[e]);
  //         data.test.forEach(test => {
  //           console.log(test);
  //           console.log(data);
  //           this.resultList.push(data);
  //           console.log('Result List -> '+this.resultList)
  //           this.testName = test.testName;
  //           this.testId = test.testId;
  //           this.securedMarks = test.securedMarks;
  //           this.testCompleted = test.entryDate;
  //         });

  //       }

  //     });
  //   })
  // }
  showResult() {
    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/test/" +
          this.testId +
          "/attempted_by/"
      )
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        // console.log(data);
        if (data) {
          var object = data;
          this.resultList = Object.keys(object).map((e) => object[e]);
          // console.log(this.resultList);

          this.resultList.forEach((element) => {
            this.getStudentDetails(element.studentId);
          });
        } else {
          this.resultList = [];
        }
      })
      .catch((err) => {
        return err;
      });
  }

  async getStudentDetails(mobileNo) {
    firebase
      .database()
      .ref("student/" + mobileNo + "/test/" + this.testId)
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        this.securedMarks.push(data.securedMarks);
        // var object = this.securedMarks;
        // this.securedMarks = Object.keys(object).map(e=>object[e]);
        // console.log(this.securedMarks);
      })
      .catch((err) => {
        return err;
      });
  }

  loadStudentResult(courseId, subjectId, mobileNo, testId, testName) {
    this.resultService.courseId = courseId;
    this.resultService.subjectId = subjectId;
    this.resultService.mobileNo = mobileNo;
    this.resultService.testId = testId;
    this.resultService.testName = testName;
    this.router.navigate(["/studentresult"]);
  }
}
