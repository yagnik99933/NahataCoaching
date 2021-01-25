import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-material",
  templateUrl: "./material.component.html",
  styleUrls: ["./material.component.scss"],
})
export class MaterialComponent implements OnInit {
  showCourseName: boolean = false;
  showSubjectName: boolean = false;
  showLabel: boolean = false;
  uploadLabel: boolean = false;

  showDiv: boolean = false;
  showDiv2: boolean = false;
  courseCode: any;
  courseName: string;
  courseId: any;
  courseList: any[];
  subjectList: any[];
  subjectName: any;
  subjectCode: any;
  subjectId: any;
  contains: boolean = false;
  material: any;
  materialList: any[];

  addMaterialControl: FormGroup;
  fileType: string;
  types: string[] = ["Document", "Image"];
  file: File;
  url = "";
  materialId: string;
  editControl: FormGroup;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {}

  open(content, material) {
    this.material = material;
    // this.material.fileType = this.fileType;
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
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
    this.addMaterialControl = this.fb.group({
      name: ["", Validators.required],
      fileType: ["", Validators.required],
      image: ["", Validators.required],
    });

    this.editControl = this.fb.group({
      name: ["", Validators.required],
      fileType: ["", Validators.required],
      image: ["", Validators.required],
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
        // console.log("Error");
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
          // console.log('Andar')
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

  showmaterials() {
    if (this.courseId && this.subjectId) {
      firebase
        .database()
        .ref(
          "course/" +
            this.courseId +
            "/subject/" +
            this.subjectId +
            "/material/"
        )
        .once("value")
        .then((snapshot) => {
          var data = snapshot.val();
          if (data) {
            var object = data;
            this.materialList = Object.keys(object).map((e) => object[e]);
            // console.log(this.materialList);
          } else {
            this.materialList = [];
          }
          return "Failure.";
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
    this.materialList = [];
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

  async getSubjectId(name: string, code: any, Id: any, material: any[]) {
    this.subjectCode = code;
    this.subjectName = name;

    if (code) {
      this.showSubjects();
      this.subjectId = Id;
      if (material) {
        this.showDiv2 = true;
        this.showmaterials();
        // console.log("Called");
      } else {
        this.showDiv2 = false;
      }
      this.showSubjectName = true;
    }
  }

  // Uploading Files functions below :
  handleFiles(event) {
    this.file = event.target.files[0];
    this.showLabel = false;
  }

  //method to upload file at firebase storage
  async uploadFile() {
    this.material = this.addMaterialControl.value;

    this.uploadLabel = true;
    if (this.file) {
      var val = Math.floor(Math.random() * 10000000);
      this.materialId = "MATER" + val;
      const snap = await this.storage.upload(
        "material/" + this.materialId,
        this.file
      ); //upload task
      this.getUrl(snap);
    } else {
      alert("Please select an image");
    }
  }

  private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.url = url; //store the URL
    this.uploadLabel = false;
    this.showLabel = true;

    // console.log(this.url);
    if (this.url) {
      this.addMaterial();
    }
    this.addMaterialControl.reset();
  }

  addMaterial() {
    this.material = this.addMaterialControl.value;

    // var val = Math.floor(Math.random() * 10000000);
    // this.materialId = "MATER" + val;

    firebase
      .database()
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/material/" +
          this.materialId
      )

      .set({
        materialId: this.materialId,
        materialName: this.material.name,
        entryDate: new Date().getTime(),
        materialLink: this.url,
        fileType: this.material.fileType,
        status: true,
        openMaterial: false,
      })

      .then((snapshot) => {
        // console.log(snapshot);

        this.showLabel = false;
        this.toastrService.success("Successfully.", "Material Added", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showmaterials();
        return "material Added Successfully..";
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
      .ref(
        "course/" +
          this.courseId +
          "/subject/" +
          this.subjectId +
          "/material/" +
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
        this.showmaterials();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async editMaterial(
    courseId,
    subjectId,
    materialId,
    materialName,
    fileType,
    materialLink
  ) {
    this.material = this.editControl.value;
    if (!this.material.name) {
      this.material.name = materialName;
    }
    if (!this.material.fileType) {
      this.material.fileType = fileType;
    }
    if (this.material.image) {
      this.uploadLabel = true;
      this.storage.ref("material/" + materialId).delete();
      var snap = await this.storage.upload("material/" + materialId, this.file); //upload task
      var url = await snap.ref.getDownloadURL();
      this.material.image = url; //store the URL
    } else {
      this.material.image = materialLink;
    }

    firebase
      .database()
      .ref(
        "course/" +
          courseId +
          "/subject/" +
          subjectId +
          "/material/" +
          materialId
      )
      .update({
        materialName: this.material.name,
        materialLink: this.material.image,
        fileType: this.material.fileType,
      })
      .then((snapshot) => {
        this.showmaterials();
        this.uploadLabel = false;
        this.toastrService.success("Successfully.", "Material Editted", {
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

  deleteMaterial(courseId, subjectId, materialId, materialLink) {
    // this.bannerId = bannerId;
    // console.log('ID:::'+bannerId);
    if (materialLink) {
      this.storage.ref("material/" + materialId).delete();
    }

    firebase
      .database()
      .ref(
        "course/" +
          courseId +
          "/subject/" +
          subjectId +
          "/material/" +
          materialId
      )
      .remove()
      .then((snapshot) => {
        // console.log("Remove succeeded.")
        this.toastrService.error("Successfully.", "Material Deleted", {
          timeOut: 3000,
          easeTime: 1000,
          progressBar: true,
          positionClass: "toast-center-center",
        });
        this.showmaterials();
        return "Success.";
      })
      .catch((error) => {
        return error;
        // console.log("Remove failed: " + error.message)
      });
    this.modalService.dismissAll();
  }
}
