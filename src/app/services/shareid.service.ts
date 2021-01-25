import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareidService {

  constructor() { }

  courseId: any;
  subjectId: any;
  courseName: any;
  subjectName: any;
  testId: any;
  testName: any;
  totalMarks: any;
  testTimings: any;

  getCourseId(){
    return this.courseId;
  }

  getSubjectId(){
    return this.subjectId;
  }

  getTestId(){
    return this.testId;
  }

  getTestName(){
    return this.testName;
  }

  getCourseName(){
    return this.courseName;
  }

  getSubjectName(){
    return this.subjectName;
  }

  getTotalMarks(){
    return this.totalMarks;
  }

  getTestTimings(){
    return this.testTimings;
  }
}
