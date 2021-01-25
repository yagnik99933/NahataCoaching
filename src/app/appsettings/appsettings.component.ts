import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { MessagingService } from '../services/message.service';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.component.html',
  styleUrls: ['./appsettings.component.scss']
})
export class AppsettingsComponent implements OnInit {

  addBannerControl: FormGroup;
  closeResult: string;

  showLabel: boolean = false;
  uploadLabel: boolean = false;
  basicDetailLabel: boolean = false;

  file: File;
  appSettings: any;
  imageId: any;
  url = '';

  // attributes of setting
  appList: any;
  label: any = '';
  moto: any = '';
  imageUrl: any = '';
  mobileNo: any = '';
  address: any = '';
  email: any = '';

  constructor(private storage: AngularFireStorage, private fb: FormBuilder, private db: AngularFireDatabase,
    private service: MessagingService, private toastrService : ToastrService) {}

  ngOnInit() {

    this.createForm();
    // calling service -
    this.service.getInfo().subscribe((data)=>{
      // console.log(data);
      this.appList = data;
      this.label = this.appList.label;
      this.moto = this.appList.moto;
      this.imageUrl = this.appList.mainicon;
      this.mobileNo = this.appList.mobileNo;
      this.address = this.appList.address;
      this.email = this.appList.email;

      // console.log(this.label)
    })
  }

  createForm(){
    this.addBannerControl = this.fb.group({
      label: ['', Validators.required],
      moto: ['', Validators.required],
      mobileNo: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      image: ['']
    });
  }


  handleFiles(event) {
    this.file = event.target.files[0];
    // console.log(this.showLabel)
    this.showLabel = false;
    // console.log(this.showLabel)
  }


   //method to upload file at firebase storage
   async uploadFile() {
    this.appSettings = this.addBannerControl.value;

    // console.log(this.appSettings);
    this.uploadLabel = true;
    if (this.file) {
      var imageName = "mainicon";
      const snap = await this.storage.upload('app/'+imageName, this.file);    //upload task
      this.getUrl(snap);
    }
    else{
      this.uploadData();
      this.uploadLabel = false;
      this.showLabel = true;
    }
  }

  //method to retrieve download url
  private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.url = url;  //store the URL
    this.uploadLabel = false;
    this.showLabel = true;

    // console.log(this.url);
    if(this.url){
      this.uploadData();
    }

  }

  uploadData(){

    var label = this.addBannerControl.value.label;
    var moto = this.addBannerControl.value.moto;

    if(this.addBannerControl.value.label == ''){
      label = this.label;
    }
    if(this.addBannerControl.value.moto == ''){
      moto = this.moto;
    }
    if(!this.url){
      this.url = this.imageUrl;
    }

    firebase.database().ref('app/')
    .update({ label: label, moto: moto, mainicon: this.url })
    .then((snapshot)=>{
      // console.log(snapshot);
      this.service.getInfo();
      this.toastrService.success('Successfully.', 'App Settings Updated',{
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: 'toast-center-center'
      });
      return 'Success';
    })
    .catch((error)=>{
      return error;
    });
  }

  addBasicDetails(){
    var mobileNo = this.addBannerControl.value.mobileNo;
    var address = this.addBannerControl.value.address;
    var email = this.addBannerControl.value.email;
    if(this.addBannerControl.value.email == ''){
      email = this.email;
    }
    if(this.addBannerControl.value.mobileNo == ''){
      mobileNo = this.mobileNo;
    }
    if(this.addBannerControl.value.address == ''){
      address = this.address;
    }

    firebase.database().ref('app/')
    .update({ mobileNo: mobileNo, address: address, email: email })
    .then((snapshot)=>{
      // console.log(snapshot);
      this.basicDetailLabel = true;
      this.toastrService.success('Successfully.', 'App Settings Updated',{
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: 'toast-center-center'
      });
    })
    .catch((error)=>{
      return error;
    });
  }

  deleteIcon(){
    this.showLabel = false;
    this.storage.ref('app/mainicon').delete();

    firebase.database().ref('app/')
    .update({ mainicon: '' })
    .then((snapshot)=>{
      this.toastrService.error('Successfully.', 'Icon Deleted',{
        timeOut: 3000,
        easeTime: 1000,
        progressBar: true,
        positionClass: 'toast-center-center'
      });
      return snapshot;
    })
    .catch((err)=>{
      return err;
    })
  }

  hideLabel2(){
    this.basicDetailLabel = false;
  }

  hideLabel1(){
    this.showLabel = false;
  }

}
