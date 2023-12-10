import { Component, OnInit } from '@angular/core';
import { PackService } from '../pack.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
  useriid:any= localStorage.getItem("loggeduser");
  workouts:any;
  attend: any ="Attend";
  constructor(public pac:PackService,public userSer: UsersService) {
    
   }
  
  ngOnInit(): void {console.log(this.useriid);
    let trainerId = localStorage.getItem("trainer_id");
    console.log("trainerID",trainerId);
    if(trainerId!=null){
      this.attend = "Start"
      this.userSer.getAllWorkoutsForTrainer(trainerId).subscribe((data:any[])=>{
        console.log(data);
        this.workouts= data;
      },(error:any)=>{
        console.log(error);
      })

    }
    else{
    this.userSer.getAllWorkouts().subscribe((data:any[])=>{
      console.log(data);
      this.workouts= data;
    },(error:any)=>{
      console.log(error);
    })
  }
  }


}
