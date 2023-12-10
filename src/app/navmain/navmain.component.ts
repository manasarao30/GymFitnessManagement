import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navmain',
  templateUrl: './navmain.component.html',
  styleUrls: ['./navmain.component.css']
})
export class NavmainComponent implements OnInit {
  name: string;
  isAdmin: boolean = false;
  useriid: any = localStorage.getItem("loggeduser");
  isMember: any;
  constructor(public userSer: UsersService, public activeRoute: ActivatedRoute, public myRouter: Router) { }

  ngOnInit(): void {
    this.isAdmin = this.userSer.isAdmin();
        // to get the membership details
        // this.userSer.getMembershipdetailsForUser(this.useriid).subscribe((data: any[]) => {
        //   console.log(data);
        //   let membershipPlan = data[0];
        //   console.log("membershipPlan::",membershipPlan);
        //   // this.isMember = (membershipPlan.membership_status && membershipPlan.membership_status == "Active");
        //   console.log("isMember::",this.isMember);
        //   this.isMember = (localStorage.getItem("isMember") == "Active");
        //   console.log("isMember::", (localStorage.getItem("isMember") == "Active"));
        // }, (error: any) => {
        //   console.log(error);
        // });

        // this.isMember = (localStorage.getItem("isMember") == "Active");
  }
  doLogout() {
    localStorage.clear();
    this.myRouter.navigateByUrl("/");
  }
  
   



}
