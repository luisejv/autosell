import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { User } from 'src/app/core/interfaces/user';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/core/services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  rol: string;
  isAdmin: boolean;
  isRemax: boolean;
  isUser: boolean;
  isDashboard: boolean;
  user!: User;
  scrolled: boolean = false;
  registerCarUrl: boolean = false;

  constructor(
    public commonService: CommonService,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {
    this.rol = this.storageService.getRoleLocalStorage()!;
    this.isAdmin = this.rol == RolesEnum.ADMIN;
    this.isRemax = this.rol == RolesEnum.REMAX;
    this.isUser = this.rol == RolesEnum.PARTICULAR;
    this.userService
      .getUser(this.storageService.getEmailLocalStorage()!)
      .subscribe(
        (response) => {
          this.user = response;
        },
        (error) => {
          console.log('Error getting user info: ', error);
          // TODO: handlear esto
        }
      );
    const arrayUrl = this.router.url.split('/');
    this.registerCarUrl = arrayUrl[arrayUrl.length - 1] == 'registrar-auto';
    this.isDashboard = arrayUrl[arrayUrl.length - 1] === 'dashboard';
    this.router.events.subscribe((route) => {
      this.inDashboard();
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {}

  inDashboard(): boolean {
    const arrayUrl = this.router.url.split('/');
    this.isDashboard = arrayUrl[arrayUrl.length - 1] === 'dashboard';
    return this.isDashboard;
  }

  @HostListener('document:scroll')
  scrollFunction() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
}
