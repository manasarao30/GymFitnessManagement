import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';
import { NavmainComponent } from './navmain/navmain.component';
import { SlideComponent } from './slide/slide.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { WorkoutsComponent } from './workouts/workouts.component';
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

@NgModule({
  declarations: [
    AppComponent,
    NavmainComponent,
    SlideComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NotfoundComponent,
    WorkoutsComponent,
    CheckoutComponent,
    PaymentComponent,
    AdminDashboardComponent,
    AdduserComponent,
    EdituserComponent,
    ContactComponent,
    WorkoutClassComponent,
    GymEquipmentComponent,
    MembershipPlanComponent,
    MemberManagementComponent,
    PackagesComponent,
    AddEquipmentComponent,
    AddPlanComponent,
    ManageFeedbackComponent,
    TrainerManagementComponent,
    AddtrainerComponent,
    ViewClassComponent,
    AddClassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StorageServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
