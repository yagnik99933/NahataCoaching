import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit {
  addNewsControl: FormGroup;
  editControl: FormGroup;
  news: any;
  newsList: any[];
  closeResult: string;
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
    this.showNews();
  }

  open(content, news) {
    this.news = news;
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
    this.addNewsControl = this.fb.group({
      text: ["", Validators.required],
    });

    this.editControl = this.fb.group({
      text: ["", Validators.required],
    });
  }

  addNews() {
    this.news = this.addNewsControl.value.text;
    var val = Math.floor(Math.random() * 10000000);
    const newsId = "NEWS" + val;
    const entryDate = new Date().getTime();

    firebase
      .database()
      .ref("news/" + newsId)
      .set({
        newsId: newsId,
        text: this.news,
        entryDate: entryDate,
        status: true,
      })
      .then((snaphot) => {
        this.showNews();
        this.toastrService.success("Successfully.", "News Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "News added successfully.";
      })
      .catch((error) => {
        return error;
      });
    this.addNewsControl.reset();
  }

  showNews() {
    firebase
      .database()
      .ref("news/")
      .once("value")
      .then((snapshot: any) => {
        var data = snapshot.val();
        if (data) {
          var object = data;
          this.newsList = Object.keys(object).map((e) => object[e]);
        } else {
          this.newsList = [];
        }
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
      .ref("news/" + Id)
      .update({ status: status })
      .then((snap) => {
        console.log("updated successfully");
        this.toastrService.success("Successfully.", "Status Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showNews();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editNews(newsId: any, newsText) {
    this.news = this.editControl.value;

    if (!this.news.text) {
      this.news.text = newsText;
    }

    var entryDate = new Date().getTime();
    firebase
      .database()
      .ref("news/" + newsId)
      .update({ text: this.news.text, entryDate: entryDate })
      .then((snapshot) => {
        this.showNews();
        this.toastrService.success("Successfully.", "News Edited", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "News editted successfully.";
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.modalService.dismissAll();
  }

  deleteNews(Id) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);

    firebase
      .database()
      .ref("news/" + Id)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "News Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showNews();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
