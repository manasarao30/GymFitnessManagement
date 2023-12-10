import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  packname="";
  packdesc="";
  name=localStorage.getItem("loggedusername");
  age=localStorage.getItem("loggeduserage");
  

  constructor(public http:HttpClient,public rooter: Router, public userService: UsersService) { 
    console.log("service created");
  }
  attendWorkout(work: any,useriid: any){
    let name = work.fname +" "+work.lname;

    if(!this.userService.isTrainer()){
    const newDate = new Date();
    const formattedDate = newDate.toISOString().split('T')[0];
    let jsonVal = {
      "member_id": useriid, 
      "workout_class_instance_id": work.workout_class_instance_id,
      "date": formattedDate
      }
      localStorage.setItem("workout_class_instance_id:",work.workout_class_instance_id);
      localStorage.setItem("EquipmentName",work.name);
    
    console.log("jsonV:",jsonVal)
    this.userService.addAttendance(jsonVal).subscribe((data:string)=>{

      console.log("sdsd",data);

    }, (error:any)=>{

    });


  this.userService.addMemberCompletesWorkoutClassInstance(jsonVal).subscribe((data:string)=>{

    console.log("sdsd",data);

  }, (error:any)=>{

  });
  }
  let req = {
    "member_id": useriid, 
    "trainer_id": work.trainer_id
  }
  this.userService.addTrainerTrainsMember(req).subscribe((data:string)=>{

    console.log("sdsd",data);

  }, (error:any)=>{

  });
  
    localStorage.setItem("workout_name", work.class_name);
    localStorage.setItem("workout_id",work.workout_class_instance_id);
    localStorage.setItem("trainer_name",name);
    this.rooter.navigateByUrl("/workout-class")
  }
  packageBuy(pac: any){
    localStorage.setItem("package", pac);
    localStorage.setItem("packna", pac.plan_name);
    this.rooter.navigateByUrl("/cart")
  }
  

}
