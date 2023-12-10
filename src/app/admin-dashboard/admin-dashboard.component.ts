import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  msg: string;
  users: any[] = [];
  constructor(public userSer: UsersService) { }

  ngOnInit(): void {
    this.userSer.getAllUsers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    }, (error: any) => {

      this.msg = "Something went wrong"
    });
  }

  deleteUser(userId: number) {

    if (confirm("Do you want to delete this user?")) {
      this.userSer.deleteUserData(userId).subscribe((data: string) => {
        this.msg = "User deleted successfully";
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
