import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RolesEnum } from '../enums/roles.enum';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatedGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.storageService.getRoleLocalStorage() === RolesEnum.ADMIN) {
      return true;
    } else {
      return false;
    }
    // if (this.storageService.isValidated()) {
    //   return true;
    // } else {
    //   this.router.navigate([
    //     '/validation/0',
    //     // '/validation/' + this.storageService.getTokenLocalStorage(),
    //   ]);
    //   return false;
    // }
  }
}
