import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addplan',
  templateUrl: './addplan.component.html',
  styleUrls: ['./addplan.component.css']
})
export class AddPlanComponent implements OnInit {
  msg:string;
  // useremailavail=false;
  date = new Date();
  uuseremailavail=false;
  disabled : boolean = true;
  packages: any;

  constructor(public userSer :UsersService,public myRouter : Router) { }

  ngOnInit(): void {
    this.userSer.getAllPackages().subscribe((data:any[])=>{
      console.log(data);
      this.packages= data;
    },(error:any)=>{
      console.log(error);
    })
  }
  addPlan(form:NgForm){

    
    form.value.date = this.date;

    let data = form.value;

    let v : any;
    let jsonVal;
    var stringToConvert = localStorage.getItem("loggedadmin");
    var numberValue = Number(stringToConvert);
     jsonVal = {
      "plan_name": data.plan_name, 
      "price": data.price,
      "duration": data.duration,
      "benefits": data.benefits,
      management_id: numberValue
      }
    
    console.log("jsonV:",jsonVal)
    this.userSer.addPackage(jsonVal).subscribe((data:string)=>{

      console.log("sdsd",data);

      this.msg = data;
      this.msg = "Added Successfully";
      this.myRouter.navigateByUrl("/membership-plan");
      form.reset();

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something Went Wrong!!";
      if(error.status = 200){
        this.msg = "Registered Successfully";

      this.myRouter.navigateByUrl("/membership-plan");
      }

    });

  }

}
