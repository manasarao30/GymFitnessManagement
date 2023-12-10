import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-gym-equipment',
  templateUrl: './gym-equipment.component.html',
  styleUrls: ['./gym-equipment.component.css']
})
export class GymEquipmentComponent implements OnInit {
  msg: string;
  users: any[] = [];
  constructor(public userSer: UsersService) { }

  ngOnInit(): void {
    this.userSer.getAllEquipment().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    }, (error: any) => {

      this.msg = "Something went wrong"
    });
  }

  deleteEquipment(userId: number) {

    if (confirm("Do you want to delete this Equipment?")) {
      //console.log("User deleted with id"+userId);
      this.userSer.deleteEquipment(userId).subscribe((data: string) => {
        this.msg = "Deleted successfully";
        var index = this.users.findIndex((obj) => {
          return obj._id == userId;
        });
        this.users.splice(index, 1);
      }, (error: any) => {
        this.msg = "something went wrong";


      });
    }
  }
}
