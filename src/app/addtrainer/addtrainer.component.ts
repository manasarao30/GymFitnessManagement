import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addtrainer',
  templateUrl: './addtrainer.component.html',
  styleUrls: ['./addtrainer.component.css']
})
export class AddtrainerComponent implements OnInit {
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
  addtrainer(form:NgForm){
    form.value.date = this.date;
    let data = form.value;
    const jsonVal = {
      "username": data.username, 
      "password": data.userpass,
      "fname": data.fname,
      "lname": data.lname,
      "role_name": "Trainer",
      "email": data.uemail,
      "phone_no": data.userphone,
      "management_id": localStorage.getItem("loggedadmin")
    }
    console.log("jsonV:",jsonVal)
    this.userSer.addTrainer(jsonVal).subscribe((data:string)=>{
      console.log("sdsd",data);
      this.msg = "Trainer added Successfully";

      this.myRouter.navigateByUrl("/manage-trainer");
      // this.msg = data;
      form.reset();

    }, (error:any)=>{
      console.log("error::",error)
      console.log("error::",error)
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
