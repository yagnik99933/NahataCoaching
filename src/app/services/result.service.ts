import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  courseId: any;
  subjectId: any;
  testId: any;
  mobileNo: any;
  testName: any;
  constructor() { }

  getTestId(){
    return this.testId;
  }
  getTestName(){
    return this.testName;
  }

  getMobileNo(){
    return this.mobileNo;
  }

  getSubjectId(){
    return this.subjectId;
  }

  getCourseId(){
    return this.courseId;
  }

}
