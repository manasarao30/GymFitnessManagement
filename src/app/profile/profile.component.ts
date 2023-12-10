import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackService } from '../pack.service';
import { UsersService } from '../users.service';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  msg: string;

  userdata: { _id: number, fname: string, lname: string, email: string, age: Number, gender: String, userpass: string, phone_no: number, level: string, membership_status: boolean, dateOfExpiry: string; dateOfRegistration: string; role_name: string }
 
  useriid: any = localStorage.getItem("loggeduser");

  membershipPlan: any;

  buy: string;

  isActive: any;


  constructor(public userSer: UsersService, public activeRoute: ActivatedRoute, public pac: PackService, public myRouter: Router,private location: Location) {

  }


  ngOnInit(): void {
    console.log("loggeduswer",this.useriid);

    this.userSer.getloggedUserData(this.useriid).subscribe((data: any[]) => {
      console.log(data);
      this.userdata = data[0];
      if(this.userdata.role_name == 'Admin')
      this.myRouter.navigateByUrl('/admin-dashboard');
    }, (error: any) => {
      console.log(error);
    });
    
    // to get the membership details
    this.userSer.getMembershipdetailsForUser(this.useriid).subscribe((data: any[]) => {
      console.log(data);
      this.membershipPlan = data[0];
      this.buy = (this.membershipPlan.membership_status == "Active") ? "Update" : "Buy";
      localStorage.setItem("isMember", this.membershipPlan.membership_status);
      this.isActive = (this.membershipPlan.membership_status == "Active") ;
    }, (error: any) => {
      console.log(error);
    });
    this.reloadPage();
  }

  reloadPage(): void {
    // this.location.go(this.location.path());
    // window.location.reload();
  }

  cancelMembership(){
    this.userSer.cancelMembership(this.useriid).subscribe((data:any[])=>{

      console.log(data);

     if(data.length==0)
     {
      this.msg ="Error canceling membership";
     }
     else {
      this.msg ="Membership canceled";
      this.isActive = false;
      this.buy = "Buy";
     }
    }, (error:any)=>{

      console.log(error);

      this.msg = "Something went wrong";

    });

  }
  feedback(form:NgForm)
  {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
    console.log(form.value);
    let feedbackData = form.value;
    let request = {
      feedback_text: feedbackData.feedback,
      member_id: this.useriid,
      dateOfFeedback: formattedDate


    }
    this.userSer.submitFeedback(request).subscribe((data:any[])=>{

      console.log(data);

     if(data.length==0)
     {
      this.msg ="Error submitting feedback";
     }
     else {
      this.msg ="Feedback submitted"
     }
    }, (error:any)=>{

      console.log(error);

      this.msg = "Something went wrong";

    });
  }

  // addtrain()
  // {
  //   if(this.userdata.istrain==true){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }
  // adddiet()
  // {
  //   if(this.userdata.isdietplan==true){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }
}


