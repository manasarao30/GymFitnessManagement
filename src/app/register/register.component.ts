import { Component, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  msg : string ="";
  uuseremailavail=false;
  date = new Date();
  disabled : boolean = true;

  constructor(public userSer : UsersService, public rooter:Router) { }

  ngOnInit(): void {
  }

  userRegistration(form:NgForm)
  {
    console.log("User Registered");
    form.value.date=this.date;
    console.log(form.value);
    let data = form.value;
    let jsonVal = {
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
      "membership_status": "",
    }
    
    this.rooter.navigateByUrl("/login")

    this.userSer.doUserRegistration(jsonVal).subscribe((data:string)=>{

      console.log(data);

      this.msg = data;
      
      form.reset();

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something Went Wrong!!";

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

  checkvalid(f:NgForm){
    if(f.invalid == true){
      this.disabled = true;
    }
    else if(f.invalid == false && this.msg == ""){
      this.disabled = false;
    }
    console.log("msg ",this.disabled);
    return this.disabled;
  }
 
   
 

}
