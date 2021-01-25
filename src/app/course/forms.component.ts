import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/filter";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as firebase from "firebase";
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from "ngx-toastr";

const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Federated States Of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Islands",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

@Component({
  selector: "app-forms",
  templateUrl: "./forms.component.html",
  styleUrls: ["./forms.component.scss"],
})
export class FormsComponent implements OnInit {
  currentRate: any;
  public typeaheadBasicModel: any;
  public typeaheadFocusModel: any;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) =>
        term.length > 1
          ? []
          : states
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      );

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focusSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map((term) =>
        (term === ""
          ? states
          : states.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      );

  addCourseControl: FormGroup;
  editControl: FormGroup;
  course: any;
  courseList: any[];
  closeResult: string;
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.currentRate = 8;
    this.createForm();
    this.showCourses();
  }

  open(content, course) {
    this.course = course;
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
    this.addCourseControl = this.fb.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
    });

    this.editControl = this.fb.group({
      code: ["", Validators.required],
      name: ["", Validators.required],
    });
  }

  // this function adds a new course in DB.
  addCourse() {
    this.course = this.addCourseControl.value;
    // console.log(this.course);
    var code = this.course.code;
    var name = this.course.name;
    var val = Math.floor(Math.random() * 10000000);
    var courseId = "COU" + val;
    var entryDate = new Date().getTime();

    firebase
      .database()
      .ref("course/" + courseId)
      .set({
        courseCode: code,
        courseName: name,
        courseId: courseId,
        entryDate: entryDate,
        status: true,
      })
      .then((snapshot) => {
        this.showCourses();
        this.toastrService.success("Successfully.", "Course Added", {
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
    this.addCourseControl.reset();
  }

  // This function shows list of all courses
  showCourses() {
    firebase
      .database()
      .ref("course")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();

        var object = data;
        this.courseList = Object.keys(object).map((e) => object[e]);
        // console.log(this.courseList);
        // this.students = data ;
        // console.log(this.students);
        return "Data";
      })
      .catch((errorObject) => {
        return errorObject;
      });
  }

  editCourse(courseId, courseCode, courseName) {
    this.course = this.editControl.value;
    if (!this.course.code) {
      this.course.code = courseCode;
    }
    if (!this.course.name) {
      this.course.name = courseName;
    }
    firebase
      .database()
      .ref("course/" + courseId)
      .update({ courseCode: this.course.code, courseName: this.course.name })
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

  updateStatus(Id, status) {
    if (status) {
      status = false;
    } else {
      status = true;
    }

    firebase
      .database()
      .ref("course/" + Id)
      .update({ status: status })
      .then((snapshot) => {
        this.showCourses();
        this.toastrService.success("Successfully.", "Course Status Updated", {
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

  deleteCourse(Id) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);

    firebase
      .database()
      .ref("course/" + Id)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Course Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showCourses();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
