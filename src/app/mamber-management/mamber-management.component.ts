import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-mamber-management',
  templateUrl: './mamber-management.component.html',
  styleUrls: ['./mamber-management.component.css']
})
export class MemberManagementComponent implements OnInit {
  msg: string;
  users: any[] = [];
  constructor(public userSer: UsersService) { }

  ngOnInit(): void {
    this.userSer.getUsers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    }, (error: any) => {

      this.msg = "Something went wrong"
    });
  }

  deleteUser(userId: number) {

    if (confirm("Do you want to delete this user?")) {
      //console.log("User deleted with id"+userId);
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
