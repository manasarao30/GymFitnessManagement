import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addEquipment',
  templateUrl: './addEquipment.component.html',
  styleUrls: ['./addEquipment.component.css']
})
export class AddEquipmentComponent implements OnInit {
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
  addEquipment(form:NgForm){

    
    form.value.date = this.date;

    let data = form.value;

    let v : any;
    let jsonVal;
    var stringToConvert = localStorage.getItem("loggedadmin");
    var numberValue = Number(stringToConvert);
    const newDate = new Date();
    const formattedDate = newDate.toISOString().split('T')[0];
     jsonVal = {
      "name": data.name, 
      "description": data.description,
      "last_maintenance_date": formattedDate,
      management_id: numberValue
      }
    
    this.userSer.addEquipment(jsonVal).subscribe((data:string)=>{

      console.log("sdsd",data);

      this.msg = data;
      this.msg = "Added Successfully";
      this.myRouter.navigateByUrl("/gym-equipment");
      form.reset();

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something Went Wrong!!";
      if(error.status = 200){
        this.msg = "Registered Successfully";

      this.myRouter.navigateByUrl("/gym-equipment");
      }

    });

  }

}
