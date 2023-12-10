import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  msg: string;
  date = new Date();
  uuseremailavail=false;
  disabled : boolean = true;

  userId: any;
  packages: any;

  userdata: { _id: number, fname: string, lname: string, email: string, membership_plan_id:string, age: Number, gender: String, username: string,address: string,  password: string,   plan_name: string, phone_no: number, level: string, membership_status: boolean, dateOfExpiry: string; dateOfRegistration: string; role_name: string }

  constructor(public activeRoute: ActivatedRoute, public userSer: UsersService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((param: Params) => {
      console.log(param);
      if (param.userid) {
        this.userId = param.userid;
        this.userSer.getSingleUserData(param.userid).subscribe((data: any[]) => {
          console.log(data);
          this.userdata = data[0];
        }, (error: any) => {
          console.log(error);
        });
      }


    });

    this.userSer.getAllPackages().subscribe((data:any[])=>{
      console.log(data);
      this.packages= data;
    },(error:any)=>{
      console.log(error);
    })
  }
  editUser(form: NgForm) {
    form.value._id = this.userdata._id
    form.value.date=this.date;
    console.log(form.value);
    let data = form.value;
    const newDate = new Date();
    let formattedDate;

    const expDT = new Date(this.userdata.dateOfExpiry).toISOString().split('T')[0];

    let expDate;
    let plan_id;
    if(data.plan_name!=this.userdata.plan_name){
       formattedDate = newDate.toISOString().split('T')[0];
      for( let v in this.packages){
        if(this.packages[v].plan_name == data.plan_name){
          let num = this.packages[v].duration.split(" ")[0];
          plan_id = this.packages[v].plan_id;
          if(num == 12){
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
          else{
            newDate.setMonth(newDate.getMonth() + num);
          }
  
           expDate = newDate.toISOString().split('T')[0];
        }
    }
  }
    let jsonVal = {
      "username": data.username, 
      "password": data.userpass,
      "fname": data.fname,
      "lname": data.lname,
      "age": data.userage,
      "gender": data.gender,
      "email": data.uemail,
      "phone_no": data.userphone,
      "address": data.address,
      "membership_status": "Active",
      "membership_plan_id": plan_id || this.userdata.membership_plan_id,
      dateOfRegistration: formattedDate || this.userdata.dateOfRegistration, 
      dateOfExpiry: expDate || expDT,
      userId: this.userId
    }
    this.userSer.editsingleUserdata(jsonVal).subscribe((data: string) => {
      console.log("any error:",data);
      this.msg = "Updated successfully";
    }, (error: any) => {
      console.log("any error:",error);
      if(error.status == 200){
        this.msg = "Updated successfully";
      }
      else
      this.msg = "something went wrong";
    
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
}




