import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  totalTeacher: any[] = [];
  totalTeacherCount: number = 0;
  constructor(private db: AngularFireDatabase) {}

  getAllStudents() {
    return this.db.list("student/").valueChanges();
  }

  getTotalTeachers() {
    return this.db.list("teacher/", (ref) => ref.orderByKey()).valueChanges();
  }

  getTotalCourses() {
    return this.db.list("course/", (ref) => ref.orderByKey()).valueChanges();
  }

  getTotalBanners() {
    return this.db.list("banner/", (ref) => ref.orderByKey()).valueChanges();
  }

  getTotalNews() {
    return this.db.list("news/", (ref) => ref.orderByKey()).valueChanges();
  }

  getVerifiedStudents() {
    return this.db
      .list("student/", (ref) =>
        ref.orderByChild("courseEnrollmentStatus").equalTo("ACCEPTED")
      )
      .valueChanges();
  }

  getUnVerifiedStudents() {
    return this.db
      .list("student/", (ref) =>
        ref
          .orderByChild("courseEnrollmentStatus")
          .equalTo("PENDING" || "REJECTED")
      )
      .valueChanges();
  }
}
