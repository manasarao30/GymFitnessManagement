import { Component, OnInit } from '@angular/core';
import { PackService } from '../pack.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackagesComponent implements OnInit {
  useriid:any= localStorage.getItem("loggeduser");
  packages:any;
  list: any;
  constructor(public pacService : PackService, public userSer : UsersService) {
    
    
   }
  
  ngOnInit(): void {console.log(this.useriid);
    this.userSer.getAllPackages().subscribe((data:any[])=>{
      console.log(data);
      this.packages= data;
      localStorage.setItem("allpackages",this.packages);
    },(error:any)=>{
      console.log(error);
    })
  }


}
