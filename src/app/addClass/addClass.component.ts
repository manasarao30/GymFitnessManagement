import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addClass',
  templateUrl: './addClass.component.html',
  styleUrls: ['./addClass.component.css']
})
export class AddClassComponent implements OnInit {
  msg:string;
  // useremailavail=false;
  date = new Date();
  uuseremailavail=false;
  disabled : boolean = true;
  packages: any;
  trainerID: any;
  equipments: any;
  equipmentID: any;

  constructor(public userSer :UsersService,public myRouter : Router) { }

  ngOnInit(): void {
    this.userSer.getTrainers().subscribe((data:any[])=>{
      console.log(data);
      this.packages= data;
    },(error:any)=>{
      console.log(error);
    })

    this.userSer.getAllEquipment().subscribe((data:any[])=>{
      console.log(data);
      this.equipments= data;
    },(error:any)=>{
      console.log(error);
    })
  }

  trainerSelected(event: any){
    console.log("event::",event.target.value);
    this.trainerID = event.target.value;
  }

  eqipmentSelected(event: any){
    console.log("equipment::",event.target.value);
    this.equipmentID = event.target.value;
  }
  addClass(form:NgForm){

    form.value.date = this.date;

    let data = form.value;

    console.log("trainer_id::",this.trainerID)
    let v : any;
    let jsonVal;
    var stringToConvert = localStorage.getItem("loggedadmin");
    var numberValue = Number(stringToConvert);
    const newDate = new Date();
    const formattedDate = newDate.toISOString().split('T')[0];
     jsonVal = {
      "class_name": data.name, 
      "duration": data.description,
      "timings": formattedDate,
      trainer_id: this.trainerID,
      equipment_id: this.equipmentID
      }
    
    this.userSer.addClass(jsonVal).subscribe((data:string)=>{

      console.log("sdsd",data);

      this.msg = data;
      this.msg = "Class added Successfully";
      this.myRouter.navigateByUrl("/view-class");
      form.reset();

    }, (error:any)=>{

      console.log(error);

      this.msg = "Something Went Wrong!!";
      if(error.status = 200){
        this.msg = "Registered Successfully";

      this.myRouter.navigateByUrl("/view-class");
      }

    });

  }

}
