import { Component, OnInit } from '@angular/core';
import { PackService } from '../pack.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  isPackbuy = true;
  code: string = "452dfg";
  pay = 50;
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
  package:any;
  pacList:any;

  packname = localStorage.getItem("packna");
  packdesc = localStorage.getItem("packds");





  constructor(public activeRoute: ActivatedRoute, public pac: PackService, public userSer: UsersService, public rooter: Router) { this.packn = pac.packname }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((param: Params) => {
      console.log(param.userid);


    });
    this.userSer.getAllPackages().subscribe((data:any[])=>{
      console.log(data);
      this.pacList= data;
    },(error:any)=>{
      console.log(error);
    })
    this.package = localStorage.getItem("package");
    if (this.packname == 'Basic') {
      this.pay = 50;
    }
    else if(this.packname == 'Advanced'){
      this.pay = 150;
    }
  else {
      this.pay = 600;
  }
  }

  // bath(event: any) {
  //   if (event.target.checked == true)
  //     if (this.couponcode == this.code) {
  //       this.pay += 100;
  //     }
  //     else {
  //       this.pay += 1000;
  //     }
  //   else {
  //     if (this.couponcode == this.code) {
  //       this.pay -= 100
  //     }
  //     else {
  //       this.pay -= 1000;
  //     }
  //   }
  // }
  // train(event: any) {
  //   if (event.target.checked == true)
  //     if (this.couponcode == this.code) {
  //       this.pay += 1000;
  //     }
  //     else {
  //       this.pay += 300;
  //     }
  //   else {
  //     if (this.couponcode == this.code) {
  //       this.pay -= 1000;
  //     }
  //     else {
  //       this.pay -= 300;
  //     }
  //   }
  // }
  // diet(event: any) {
  //   if (event.target.checked == true)
  //     if (this.couponcode == this.code) {
  //       this.pay += 250;
  //     }
  //     else {
  //       this.pay += 100;
  //     }
  //   else {
  //     if (this.couponcode == this.code) {
  //       this.pay -= 250;
  //     }
  //     else {
  //       this.pay -= 100;
  //     }
  //   }
  // }
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

  updatePay(event: any){
    console.log("event::",event.target);
      if (event.target.id == 'Basic') {
        this.pay = 50;
      }
      else if(event.target.id == 'Advanced'){
        this.pay = 150;
      }
    else {
        this.pay = 600;
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
    const date = new Date();
    let req;
    const newDate = new Date();

    const formattedDate = date.toISOString().split('T')[0];

    let v : any;
    for( v in this.pacList){
      if(this.pacList[v].plan_name == this.packname){

        let num = this.pacList[v].duration.split(" ")[0];
        if(num == 12){
          newDate.setFullYear(newDate.getFullYear() + 1);
        }
        else{
          let val;
          if(num == 1){
            val = 1;
          }
          else 
          val = 3;
          newDate.setMonth(newDate.getMonth() + val);
        }

        const expDate = newDate.toISOString().split('T')[0];
         req = {
          membership_plan_id: this.pacList[v].membership_plan_id, 
          user_id: numberValue, 
          dateOfRegistration: formattedDate, 
          dateOfExpiry: expDate
        }
      }
    }
    console.log(numberValue);
    console.log("req,",req);
    this.userSer.addpackages(req).subscribe((data: string) => {
      this.msg = data;
      form.reset();
    }, (error: any) => {
      this.msg = "something went wrong";
    })
    let req2  = {
      member_id: numberValue,
      date: formattedDate,
      amount: this.pay

    }
    
    this.userSer.addinvoice(req2).subscribe((data: string) => {
      this.msg = data;
      form.reset();
    }, (error: any) => {
      this.msg = "something went wrong";
    })

    this.rooter.navigateByUrl("/payment")

    



  }
}
