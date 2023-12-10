import { Component, OnInit } from '@angular/core';
import { PackService } from '../pack.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-workout-class',
  templateUrl: './workout-class.component.html',
  styleUrls: ['./workout-class.component.css']
})
export class WorkoutClassComponent implements OnInit {
  isPackbuy = true;
  code: string = "452dfg";
  pay = 150;
  userdataa: { _id: number, Fname: string, lname: string, uemail: string, userage: Number, usergender: Number, gender: String, userpass: string, userphone: number }
  codemsg: string;
  couponcode: string = "";
  packn: string;
  isdiet = false;
  msg: string;
  userdata: any = localStorage.getItem("loggeduser");
  date = new Date();
  offer: string;
  appliedmsg: string;
  taxy: number;
  istax: boolean;
  isnottax: boolean;
  val:string;
  coup:string;
  isTrainer:any;
  usersList: any;

  packname = localStorage.getItem("workout_name");
  classId = localStorage.getItem("workout_id");
  packdesc = localStorage.getItem("trainer_name");
  equipmentName = localStorage.getItem("EquipmentName");





  constructor(public activeRoute: ActivatedRoute, public pac: PackService, public userSer: UsersService, public rooter: Router) { this.packn = pac.packname }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((param: Params) => {
      console.log(param.userid);



    });
    this.isTrainer  = this.userSer.isTrainer();
    let trainerId = localStorage.getItem("trainer_id");
    console.log("isTrainer",this.isTrainer);
    this.isTrainer = (trainerId!=null)
    if(this.isTrainer){
      console.log("inside trainer")
    // let classId = localStorage.getItem("workout_class_instance_id");
    this.userSer.getUsersAttendingClass(this.classId).subscribe((data: any[]) => {
      console.log(data);
      this.usersList = data;
    }, (error: any) => {

      this.msg = "Something went wrong"
    });
  }

  }

  bath(event: any) {
    if (event.target.checked == true)
      if (this.couponcode == this.code) {
        this.pay += 100;
      }
      else {
        this.pay += 1000;
      }
    else {
      if (this.couponcode == this.code) {
        this.pay -= 100
      }
      else {
        this.pay -= 1000;
      }
    }
  }
  train(event: any) {
    if (event.target.checked == true)
      if (this.couponcode == this.code) {
        this.pay += 1000;
      }
      else {
        this.pay += 300;
      }
    else {
      if (this.couponcode == this.code) {
        this.pay -= 1000;
      }
      else {
        this.pay -= 300;
      }
    }
  }
  diet(event: any) {
    if (event.target.checked == true)
      if (this.couponcode == this.code) {
        this.pay += 250;
      }
      else {
        this.pay += 100;
      }
    else {
      if (this.couponcode == this.code) {
        this.pay -= 250;
      }
      else {
        this.pay -= 100;
      }
    }
  }
  coupon(event: any) {

    if (this.couponcode == this.code) {
      event.target.disabled = true;
      this.pay *= 0.5;
      this.coup="Applied";
      this.appliedmsg = "Coupon Applied";
      this.codemsg = "50%";
    }
    else {
      this.codemsg = "Please Enter valid Code";
    }
  }
  iscoupon() {
    if (this.couponcode == this.code) {
      
      return true;
    }
    else {
      return false;
    }

  }
 
  
  
 
  packCb(form: NgForm) {

    console.log("Package Registered");
    console.log(form.value);
    var stringToConvert = localStorage.getItem("loggeduser");
    var numberValue = Number(stringToConvert);
    console.log(numberValue);
    form.value._id = numberValue;
    form.value.paid= this.pay;
    form.value.coupon=this.coup;
    form.value.date = this.date;
    form.value.pack = this.packn;
    this.userSer.addpackages(form.value).subscribe((data: string) => {
      this.msg = data;
      form.reset();
    }, (error: any) => {
      this.msg = "something went wrong";
    })
    this.rooter.navigateByUrl("/payment")




  }
}
