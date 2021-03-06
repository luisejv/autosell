import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { LoaderService } from 'src/app/core/services/loader.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { Fotos } from '../shared/car-cu/car-cu.component';

@Component({
  selector: 'app-car-editing',
  templateUrl: './car-editing.component.html',
  styleUrls: ['./car-editing.component.css'],
})
export class CarEditingComponent implements OnInit {
  role: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private loaderService: LoaderService
  ) {
    this.role = this.storageService.getRoleLocalStorage()!;
  }

  ngOnInit(): void {}

  editCar(
    auto: AutoSemiNuevo,
    fotos: Fotos[],
    shouldUpdateFotoPrincipal: boolean,
    fotoPrincipal?: FileList
  ): void {
    this.loaderService.setIsLoadingSWAL(
      true,
      'Editando su auto',
      'Espere unos momentos'
    );
    // agarrar las fotos que son archivos
    fotos = fotos.filter((foto: Fotos) => foto.foto);

    console.group('EDIT CAR ABOUT TO SEND REQ');
    console.log('editCar: ', { auto });
    console.log('fotos: ', { fotos });
    console.log('foto principal: ', { fotoPrincipal });
    console.groupEnd();

    const formData: FormData = new FormData();
    if (fotos.length > 0) {
      if (shouldUpdateFotoPrincipal) {
        formData.append(
          'fotoPrincipal',
          fotoPrincipal![0],
          fotoPrincipal![0].name
        );
      }

      fotos.forEach((foto: Fotos, idx: number) => {
        formData.append(`files[${idx}]`, foto.foto![0], foto.foto![0].name);
      });
      formData.append('autoSemiNuevo', JSON.stringify(auto));
    } else {
      if (shouldUpdateFotoPrincipal) {
        formData.append(
          'fotoPrincipal',
          fotoPrincipal![0],
          fotoPrincipal![0].name
        );
      }
      formData.append('files', '');
      formData.append('autoSemiNuevo', JSON.stringify(auto));
    }
    this.userService.putAutoSemiNuevo(formData).subscribe(
      (res: any) => {
        console.log('edit car response: ', { res });
        this.loaderService.setIsLoadingSWAL(false);
        Swal.fire({
          icon: 'success',
          title: '??El auto ha sido actualizado!',
          showConfirmButton: true,
        }).then(() => {
          if (this.role === RolesEnum.ADMIN) {
            this.router.navigateByUrl('/dashboard/autos-por-validar');
          } else {
            this.router.navigateByUrl('/dashboard/publicados-autos');
          }
        });
      },
      (err: any) => {
        console.log('when editing car: ', { err });
        this.loaderService.setIsLoadingSWAL(false);
        Swal.fire({
          icon: 'error',
          title: '??Ocurri?? un error!',
          text: 'Int??ntalo nuevamente.',
          showConfirmButton: true,
        });
      }
    );
  }
}
