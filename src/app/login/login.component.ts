import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msg : string;
  isAdmin = "false";
  roleType: any;
  isTrainer = "false";

  constructor(public userSer : UsersService, public myRouter : Router,public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  valSelected(event:any){
    console.log("eventL:",event.target.value)
    this.roleType = event.target.value;
  }
 
  doLogin(form:NgForm)
  {
    console.log(form.value);
    localStorage.setItem("loggedAdmin","1635362908540");

    this.userSer.doUserLogin(form.value,this.roleType).subscribe((data:any[])=>{

      console.log(data);

     if(data.length==0)
     {
       this.msg = "Invalid Login";
     }
     else {
      let name;
      if(data[0].role_name=="Admin"){
        name = data[0].name;
        this.isAdmin = "true";
      }
      else {
        name = data[0].fname;
      }
      this.isTrainer = "false";
      if(data[0].role_name =="Trainer"){

       localStorage.setItem("trainer_id", data[0].trainer_id);
        this.isTrainer = "true";
        name = data[0].fname;
      }
       localStorage.setItem("loggeduser", data[0].member_id);
       localStorage.setItem("isTrainer", this.isTrainer);
       localStorage.setItem("isAdmin", this.isAdmin);
       localStorage.setItem("loggedusername", name);
       localStorage.setItem("loggedusernamee", data[0].lname);
       localStorage.setItem("loggedusergen", data[0].gender);
       localStorage.setItem("loggeduserage", data[0].userage);
       localStorage.setItem("userData", data[0]);;
       console.log("isAdmin::",this.isAdmin)
       console.log("isTrainer::",this.isTrainer)
       if(this.isAdmin == "true"){
        this.myRouter.navigateByUrl("/admin-dashboard");
       }
       else if(this.isTrainer =="true"){
        this.myRouter.navigateByUrl("/workouts");
       }
       else{
      this.myRouter.navigateByUrl("/profile");
       }
     }
     if(data[0].username=='admin')
     {
      localStorage.setItem("loggedadmin", data[0].management_id);
      
     }

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something went wrong";

    });
  }

}