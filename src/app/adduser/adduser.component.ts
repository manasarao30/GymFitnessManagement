import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
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
  addUser(form:NgForm){

    
    form.value.date = this.date;

    let data = form.value;
    const newDate = new Date();

    const formattedDate = newDate.toISOString().split('T')[0];

    let v : any;
    let jsonVal;
    for( v in this.packages){
      console.log("pac,",data.pack);
      console.log("packages,",this.packages);
      if(this.packages[v].plan_name == data.pack){
        let num = this.packages[v].duration.split(" ")[0];


        console.log("num,",num);
        if(num == 12){
          newDate.setFullYear(newDate.getFullYear() + 1);
        }
        else{
          newDate.setMonth(newDate.getMonth() + num);
        }

        const expDate = newDate.toISOString().split('T')[0];

     jsonVal = {
      "username": data.username, 
      "password": data.userpass,
      "fname": data.fname,
      "lname": data.lname,
      "age": data.userage,
      "role_name": "Member",
      "gender": data.gender,
      "email": data.uemail,
      "phone_no": data.userphone,
      "address": data.address,
      "membership_status": "Active",
      "membership_plan_id": this.packages[v].membership_plan_id,
      dateOfRegistration: formattedDate, 
      dateOfExpiry: expDate
    }
      }
    }
    console.log("jsonV:",jsonVal)
    this.userSer.doUserRegistration(jsonVal).subscribe((data:string)=>{

      console.log("sdsd",data);

      this.msg = data;
      this.msg = "Added user Successfully";
      this.myRouter.navigateByUrl("/member-management");
      form.reset();

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something Went Wrong!!";
      if(error.status = 200){
        this.msg = error.error.error;
      }

    });

  }
  uuemailcheck(uemail:string)
  {
    this.userSer.uuemailcheckAvail(uemail).subscribe((data:any[])=>{
      console.log(data);
      if(data.length==0)
      {
        this.disabled = false;
        console.log("iu")
        this.msg=""
        this.uuseremailavail= true;
      }
      else{
        this.disabled = true;
        this.msg="Email already registered";
        this.uuseremailavail= false;
      }
    },(error:any)=>{
      console.log(error);
      this.msg="Something went wrong";
    })
  }
 
   
  usernamecheck(username:string)
  {
    this.uuseremailavail = true;
    this.userSer.usernamecheckAvail(username).subscribe((data:any[])=>{
      console.log(data);
      if(data.length==0)
      {
        this.disabled = false;
        this.msg="";
        this.uuseremailavail= true;
      }
      else{
        this.disabled = true;
        this.msg="Username already registered";
        this.uuseremailavail= false;
      }
    },(error:any)=>{
      console.log(error);
      this.msg="Something went wrong";
    })
  }

}
