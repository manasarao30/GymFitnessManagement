import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
ad:string= '1635362908540';
name:string="";
private baseUrl = 'http://localhost:3000';
  constructor(public http : HttpClient,) {
   }

  doUserRegistration(data:any)
  {
    return this.http.post<string>("http://localhost:3000/register", data);
  }

  addTrainer(data:any)
  {
    return this.http.post<string>("http://localhost:3000/addtrainer", data);
  }

  addClass(data: any)
  {
    return this.http.post<string>("http://localhost:3000/addclass", data);
  }
  doUserLogin(data:any, roleType:any)
  {
    data.roleType = roleType;
    return this.http.post<any[]>("http://localhost:3000/login", data);
  }
  
  submitFeedback(data:any)
  {
    return this.http.post<any[]>("http://localhost:3000/feedback", data);
  }

  cancelMembership(member_id:any)
  {
    let data = {member_id: member_id}
    return this.http.post<any[]>("http://localhost:3000/cancelMembership", data);
  }

  getAllFeedback(){
    return this.http.get<any[]>("http://localhost:3000/addfeedback");
  }
  getAllPackages(){
    return this.http.get<any[]>("http://localhost:3000/allPackages");
  }  

  getAllWorkouts(){
    return this.http.get<any[]>("http://localhost:3000/allworkouts");
  }  

  getAllWorkoutsForTrainer(trainerId: any){
    const url = `${this.baseUrl}/allworkoutsforTrainer?trainerId=${trainerId}`;
    return this.http.get<any[]>(url);
  } 
  
  getUsersAttendingClass(classId: any){
    const url = `${this.baseUrl}/getUsersAttendingClass?classId=${classId}`;
    return this.http.get<any[]>(url);
  } 

  getAllEquipment(){
    return this.http.get<any[]>("http://localhost:3000/allEquipments");
  }
  isAdmin(){
    return !!localStorage.getItem("loggedadmin");
    // return true;
  }
  isLoggedIn()
  {
    this.name=localStorage.getItem("loggedusername") || "Admin";
    return !!localStorage.getItem("loggeduser");
  }

  isMember()
  {
    return (localStorage.getItem("isMember") == "Active");
  }

  isTrainer()
  {
    return (localStorage.getItem("isTrainer")!== "false");
  }
  getAllUsers()
  {
    return this.http.get<any[]>("http://localhost:3000/allusers");
    
  }

  getTrainers()
  {
    return this.http.get<any[]>("http://localhost:3000/alltrainers");
    
  }

  getMembershipdetailsForUser(user_id:any)
  {
    const url = `${this.baseUrl}/getMembershipForUsers?userid=${user_id}`;
    return this.http.get<any[]>(url);
    
  }

  
  getUsers()
  {
    return this.http.get<any[]>("http://localhost:3000/manageallusers");
    
  }
  
  getloggedUserData(userid:string)
  {
    // return this.http.get<any[]>("http://localhost:3000/profile/"+userid);
    const url = `${this.baseUrl}/profile?userid=${userid}`;
    return this.http.get<any[]>(url);
  }
  
  usernamecheckAvail(username:string)
  {   
     const url = `${this.baseUrl}/usernamecheck?username=${username}`;

  return this.http.get<any[]>(url);
  }
  uuemailcheckAvail(uemail:string)
  {
    const url = `${this.baseUrl}/uuemailcheck?email=${uemail}`;
    return this.http.get<any[]>(url);
  }
  getSingleUserData(userid:string)
  {
    const url = `${this.baseUrl}/getuser?userid=${userid}`;
    return this.http.get<any[]>(url);
  }
  editsingleUserdata(data:any)
  {
    return this.http.post<string>("http://localhost:3000/updateuser",data);
  }
  
  addpackages(data:any)
  {
    return this.http.post<string>("http://localhost:3000/update-package-details",data);
  }

  addinvoice(data:any)
  {
    return this.http.post<string>("http://localhost:3000/addinvoice",data);
  }

  addAttendance(data:any)
  {
    return this.http.post<string>("http://localhost:3000/addAttendance",data);
  }
  
  addTrainerTrainsMember(data:any)
  {
    return this.http.post<string>("http://localhost:3000/trainer-trains-member",data);
  }

  addMemberCompletesWorkoutClassInstance(data:any)
  {
    return this.http.post<string>("http://localhost:3000/member_completes_workoutClassInstance",data);
  }

  
  addPackage(data:any)
  {
    return this.http.post<string>("http://localhost:3000/add-package",data);
  }

  addEquipment(data:any)
  {
    return this.http.post<string>("http://localhost:3000/add-equipment",data);
  }

  
  deleteUserData(userid:number)
  {
    const url = `${this.baseUrl}/deleteuser?userid=${userid}`;
    return this.http.delete<string>(url);
  }

  deleteEquipment(equipmentid:number)
  {
    const url = `${this.baseUrl}/deleteEquipment?equipmentid=${equipmentid}`;
    return this.http.delete<string>(url);
  }
  

  deletePackage(planId:number)
  {
    const url = `${this.baseUrl}/deletepackage?planId=${planId}`;
    return this.http.delete<string>(url);
  }
  searchUsers(searchtxt:string)
  {
    return this.http.get<any[]>("http://localhost:3000/searchuser/"+searchtxt);
  }
 
  
}
