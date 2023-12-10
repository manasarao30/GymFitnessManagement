import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { logGuard } from './log.guard';
import { LoginComponent } from './login/login.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SlideComponent } from './slide/slide.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdduserComponent } from './adduser/adduser.component';
import { EdituserComponent } from './edituser/edituser.component';
import { ContactComponent } from './contact/contact.component';
import { WorkoutClassComponent } from './workout-class/workout-class.component';
import { GymEquipmentComponent } from './gym-equipment/gym-equipment.component';
import { MembershipPlanComponent } from './membership-plan/membership-plan.component';
import { MemberManagementComponent } from './mamber-management/mamber-management.component';
import { PackagesComponent } from './package/package.component';
import { AddEquipmentComponent } from './addEquipment/addEquipment.component';
import { AddPlanComponent } from './addplan/addplan.component';
import { ManageFeedbackComponent } from './manage-feedback/manage-feedback.component';
import { TrainerManagementComponent } from './trainer-management/trainer-management.component';
import { AddtrainerComponent } from './addtrainer/addtrainer.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { AddClassComponent } from './addClass/addClass.component';

const routes: Routes = [
   {path:"",component:SlideComponent},
   {path:"register", component:RegisterComponent,canActivate:[logGuard]},
   {path:"contact",component:ContactComponent},
   {path:"workout-class",component:WorkoutClassComponent},
   {path:"membership-plan",component:MembershipPlanComponent},
   {path:"gym-equipment",component:GymEquipmentComponent},
   {path:"member-management",component:MemberManagementComponent},
   {path:"package",component:PackagesComponent},
   {path:"addplan",component:AddPlanComponent},
   {path:"addequipment",component:AddEquipmentComponent},
   {path:"login", component:LoginComponent ,canActivate:[logGuard]},
   {path:"profile", component:ProfileComponent, canActivate:[AuthGuard]},
   {path:"workouts", component:WorkoutsComponent},
   {path:"cart", component:CheckoutComponent, canActivate:[AuthGuard]},
   {path:"payment", component:PaymentComponent, canActivate:[AuthGuard]},
   {path:"admin-dashboard", component:AdminDashboardComponent, canActivate:[AdminGuard]},
   {path:"edituser/:userid",component:EdituserComponent,canActivate:[AdminGuard]},
   {path:"adduser", component:AdduserComponent,canActivate:[AdminGuard]},
   {path:"feedback-manage",component:ManageFeedbackComponent},
   {path:"manage-trainer",component:TrainerManagementComponent},
   {path:"addtrainer",component:AddtrainerComponent},
   {path:"view-class",component:ViewClassComponent},
   {path:"addClass",component:AddClassComponent},
   {path:"**",component:NotfoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
