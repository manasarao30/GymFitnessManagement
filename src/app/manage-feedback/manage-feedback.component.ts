import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-manage-feedback',
  templateUrl: './manage-feedback.component.html',
  styleUrls: ['./manage-feedback.component.css']
})
export class ManageFeedbackComponent implements OnInit {
  msg: string;
  packages: any[] = [];
  users:any;
  constructor(public userSer: UsersService) { }

  ngOnInit(): void {


    this.userSer.getAllFeedback().subscribe((data:any[])=>{
      console.log(data);
      this.packages= data;
    },(error:any)=>{
      this.msg = "Something went wrong"
      console.log(error);
    })
  }

  deletePlan(userId: number) {

    if (confirm("Do you want to delete this plan?")) {
      //console.log("User deleted with id"+userId);
      this.userSer.deletePackage(userId).subscribe((data: string) => {
        this.msg = data;
        var index = this.packages.findIndex((obj) => {
          return obj._id == userId;
        });
        this.packages.splice(index, 1);
      }, (error: any) => {
        this.msg = "something went wrong";


      });
    }
  }


  doSearch(search: string) {
    this.userSer.searchUsers(search).subscribe((data: any[]) => {
      console.log(data);
      this.packages=data;

    }, (error: any) => {

      console.log(error);
    });
  }
}
