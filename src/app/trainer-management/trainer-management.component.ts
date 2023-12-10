import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-trainer-management',
  templateUrl: './trainer-management.component.html',
  styleUrls: ['./trainer-management.component.css']
})
export class TrainerManagementComponent implements OnInit {
  msg: string;
  users: any[] = [];
  constructor(public userSer: UsersService) { }

  ngOnInit(): void {
    this.userSer.getTrainers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    }, (error: any) => {

      this.msg = "Something went wrong"
    });
  }

  deletetrainer(userId: number) {

    if (confirm("Do you want to delete this Trainer?")) {
      //console.log("User deleted with id"+userId);
      this.userSer.deleteUserData(userId).subscribe((data: string) => {
        this.msg = "Trainer deleted successfully";
        var index = this.users.findIndex((obj) => {
          return obj._id == userId;
        });
        this.users.splice(index, 1);
      }, (error: any) => {
        this.msg = "something went wrong";


      });
    }
  }


  doSearch(search: string) {
    this.userSer.searchUsers(search).subscribe((data: any[]) => {
      console.log(data);
      this.users=data;

    }, (error: any) => {

      console.log(error);
    });
  }
}
