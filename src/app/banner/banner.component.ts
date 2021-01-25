import { Component, OnInit } from "@angular/core";
import { snapshotChanges } from "@angular/fire/database";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { finalize, map, sample } from "rxjs/operators";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  file: File;
  url = "";

  showLabel: boolean = false;
  uploadLabel: boolean = false;
  buttonStatus: boolean = false;
  bannerId: any;
  banner: any;
  bannerName: any;
  bannerDescription: any;
  bannerUrl: any;
  bannerList: any[];
  addBannerControl: FormGroup;
  closeResult: string;
  addImageControl: FormGroup;
  editControl: FormGroup;

  constructor(
    private storage: AngularFireStorage,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  openPreview(content) {
    this.modalService.open(content);
  }

  open(content, banner) {
    this.banner = banner;
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

  ngOnInit() {
    this.createForm();
    this.getAllbanner();
  }

  createForm() {
    this.addBannerControl = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    });
    this.addImageControl = this.fb.group({
      image: [""],
    });
    this.editControl = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      image: ["", Validators.required],
    });
  }

  handleFiles(event) {
    this.file = event.target.files[0];
    this.showLabel = false;
    this.buttonStatus = true;
  }

  //method to upload file at firebase storage
  async uploadFile() {
    this.banner = this.addBannerControl.value;
    this.bannerName = this.banner.name;
    this.bannerDescription = this.banner.description;

    // console.log(this.banner);
    this.uploadLabel = true;
    if (this.file) {
      var val = Math.floor(Math.random() * 10000000);
      this.bannerId = "BAN" + val;
      const snap = await this.storage.upload(
        "banner/" + this.bannerId,
        this.file
      ); //upload task
      this.getUrl(snap);
    } else {
      alert("Please select an image");
    }
  }

  //method to retrieve download url
  private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.url = url; //store the URL
    this.uploadLabel = false;
    this.showLabel = true;

    // console.log(this.url);
    if (this.url) {
      this.storeBanner();
    }
    this.addBannerControl.reset();
    this.addImageControl.reset();
  }

  storeBanner() {
    firebase
      .database()
      .ref("banner/" + this.bannerId)
      .set({
        bannerName: this.bannerName,
        bannerDescription: this.bannerDescription,
        url: this.url,
        bannerId: this.bannerId,
        status: true,
        entryDate: new Date().getTime(),
        link: "",
      })
      .then((snapshot) => {
        // console.log(snapshot);
        this.getAllbanner();
        this.showLabel = false;
        this.toastrService.success("Successfully.", "Banner Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        return "Success";
      })
      .catch((error) => {
        return error;
      });
  }

  getAllbanner() {
    firebase
      .database()
      .ref("banner/")
      .once("value")
      .then((snapshot) => {
        var data = snapshot.val();
        var object = data;
        if (data) {
          this.bannerList = Object.keys(object).map((e) => object[e]);
          // console.log(this.bannerList);
        } else {
          this.bannerList = [];
        }
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
      .ref("banner/" + Id)
      .update({ status: status })
      .then((snap) => {
        console.log("updated successfully");
        this.toastrService.success("Successfully.", "Status Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.getAllbanner();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async editBanner(bannerId, bannerName, bannerDescription, url) {
    this.banner = this.editControl.value;
    if (!this.banner.name) {
      this.banner.name = bannerName;
    }
    if (!this.banner.description) {
      this.banner.description = bannerDescription;
    }
    if (this.banner.image) {
      this.uploadLabel = true;
      this.storage.ref("banner/" + bannerId).delete();
      var snap = await this.storage.upload("banner/" + bannerId, this.file); //upload task
      var url = await snap.ref.getDownloadURL();
      this.banner.image = url; //store the URL
    } else {
      this.banner.image = url;
    }

    firebase
      .database()
      .ref("banner/" + bannerId)
      .update({
        bannerName: this.banner.name,
        bannerDescription: this.banner.description,
        url: this.banner.image,
      })
      .then((snapshot) => {
        this.getAllbanner();
        this.uploadLabel = false;
        this.toastrService.success("Successfully.", "Banner Updated", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
      })
      .catch((errorObject) => {
        return errorObject;
      });
    this.modalService.dismissAll();
  }

  deleteImage(bannerId) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);
    this.storage.ref("banner/" + bannerId).delete();

    firebase
      .database()
      .ref("banner/" + bannerId)
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.success("Successfully.", "Banner Removed", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.getAllbanner();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
