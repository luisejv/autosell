import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoNuevo } from 'src/app/core/interfaces/auto-nuevo';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { AdminService } from 'src/app/core/services/admin.service';
import { ClientService } from 'src/app/core/services/client.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-all',
  templateUrl: './car-all.component.html',
  styleUrls: ['./car-all.component.css'],
})
export class CarAllComponent implements OnInit {
  autos: (AutoSemiNuevo | AutoNuevo)[] = [];
  hasLoaded: boolean = false;

  constructor(
    private clientService: ClientService,
    private adminService: AdminService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //FIXME; fetch only semi nuevos
    this.userService.getAutosSemiNuevosValidados().subscribe(
      (res: (AutoSemiNuevo | AutoNuevo)[]) => {
        console.log(res);
        this.autos = res;
      },
      (err: any) => {
        console.log(err);
      },
      () => {
        this.hasLoaded = true;
      }
    );
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  removeCar(id: number): void {
    console.log('delete car with id: ', id);
    Swal.fire({
      title: '¿Eliminar auto de Clicker?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      // focusDeny: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.removeAutoReportado(id).subscribe(
          (res: any) => {
            console.log(res);
            console.log('carro borrado de clicker');
            Swal.fire({
              title: 'Eliminado',
              confirmButtonText: 'Ok',
              showConfirmButton: true,
              icon: 'success',
            }).then(() => {
              this.reloadComponent();
            });
          },
          (error: any) => {
            console.error(
              'removing car with id: ',
              id,
              ' from clicker: ',
              error
            );
          }
        );
      } else {
        console.log('cancelar borrado');
      }
    });
  }
}
