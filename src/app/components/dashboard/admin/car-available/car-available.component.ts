import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { AdminService } from 'src/app/core/services/admin.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
import { SellDetailsComponent } from './sell-details/sell-details.component';

@Component({
  selector: 'app-car-available',
  templateUrl: './car-available.component.html',
  styleUrls: ['./car-available.component.css'],
})
export class CarAvailableComponent implements OnInit {
  availableCars: AutoSemiNuevo[] = [];
  hasLoaded: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private userService: UserService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const params = this.router.url;
    console.log(params);
    this.adminService
      .getCarsByFilter(
        params.includes('/dashboard/autos-disponibles'),
        params.includes('/dashboard/autos-vendidos'),
        true
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.availableCars = response;
        },
        (err: any) => {
          console.log(err);
        },
        () => {
          this.hasLoaded = true;
        }
      );
  }

  getName() {
    const params = this.router.url;
    if (params.includes('/dashboard/autos-disponibles')) {
      return 'Autos Disponibles';
    } else if (params.includes('/dashboard/autos-no-disponibles')) {
      return 'Autos No Disponibles';
    } else {
      return 'Autos Vendidos';
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  setEnabled(id: number): void {
    const carToChange = this.availableCars.find((car) => car.id === id);

    if (carToChange && carToChange.id) {
      this.adminService.setEnabled(carToChange.id).subscribe((res: any) => {
        this.reloadComponent();
      });
    }
  }

  getDialogWidth(): string {
    if (
      this.commonService.screenWidth > 672 &&
      this.commonService.screenWidth <= 1000
    ) {
      return '60%';
    } else if (this.commonService.screenWidth <= 672) {
      return '97%';
    } else {
      return '40%';
    }
  }

  getDialogHeight(): string {
    if (this.commonService.screenWidth <= 672) {
      return '90%';
    } else {
      return '80%';
    }
  }

  mostrarVentaDetails(auto: AutoSemiNuevo): void {
    const dialogRef = this.dialog.open(SellDetailsComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: this.getDialogWidth(),
      height: this.getDialogHeight(),
      data: auto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadComponent();
    });
  }
}
