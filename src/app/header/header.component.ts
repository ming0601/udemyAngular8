import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from './../shared/data-storage-service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub: Subscription;
  constructor(private dataStorageService: DataStorageService, private userAuthService: AuthService) { }

  ngOnInit() {
    this.userSub = this.userAuthService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  saveRecipes() {
    this.dataStorageService.storeRecipes();
  }

  fetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logOut() {
    this.userAuthService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
