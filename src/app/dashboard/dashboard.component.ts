import { Component, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from "@angular/router";
import { DashboardService } from "../services/dashboard.service";
import { FirebaseauthService } from "../services/firebaseauth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../app.component.scss", "./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  totalStudents: any[] = [];
  totalStudentCount: any;
  totalVerfiedStudentCount: number;
  totalUnverifiedStudentCount: number;
  totalTeacherCount: number;
  totalCourseCount: number;
  totalBannerCount: number;
  totalNewsCount: number;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    // Student Count
    this.dashboardService.getAllStudents().subscribe((response) => {
      // console.log(response);
      this.totalStudents = response;
      this.totalStudentCount = response.length;
      //  console.log('Total Student - '+this.totalStudentCount );
    });

    // get Verified & Unverified Students :
    this.dashboardService.getVerifiedStudents().subscribe((data) => {
      // console.log(data);
      this.totalVerfiedStudentCount = data.length;
      // console.log('Total verified Student - '+this.totalVerfiedStudentCount );
    });

    // get Un-Verified & Unverified Students :
    this.dashboardService.getUnVerifiedStudents().subscribe((data) => {
      // console.log(data);
      this.totalUnverifiedStudentCount = data.length;
      // console.log('Total Un verified Student - '+this.totalUnverifiedStudentCount);
    });

    // Teacher Count
    this.dashboardService.getTotalTeachers().subscribe((data) => {
      // console.log(data);
      this.totalTeacherCount = data.length;
      // console.log(this.totalTeacherCount)
    });

    //Course Count :
    this.dashboardService.getTotalCourses().subscribe((data) => {
      // console.log(data);
      this.totalCourseCount = data.length;
    });

    //Banner Count :
    this.dashboardService.getTotalBanners().subscribe((data) => {
      // console.log(data);
      this.totalBannerCount = data.length;
    });

    //News Count :
    this.dashboardService.getTotalNews().subscribe((data) => {
      // console.log(data);
      this.totalNewsCount = data.length;
    });
  }
}
