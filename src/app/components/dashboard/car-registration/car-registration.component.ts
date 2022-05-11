import { Component, EventEmitter, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/interfaces/user';
import { UploadService } from 'src/app/core/services/upload.service';
import { Fotos } from '../shared/car-cu/car-cu.component';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-car-registration',
  templateUrl: './car-registration.component.html',
  styleUrls: ['./car-registration.component.css'],
})
export class CarRegistrationComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private uploadService: UploadService,
    private loaderService: LoaderService
  ) {
    console.log('this.uploadService: ', this.uploadService);
  }

  ngOnInit(): void {}

  postCar(
    body: AutoSemiNuevo,
    fotos: Fotos[],
    uploadedPhotos: EventEmitter<string>
  ): void {
    this.loaderService.setIsLoadingSWAL(
      true,
      'Registrando su auto',
      'Espere unos momentos'
    );
    let cont = 0;

    fotos = fotos.filter((foto) => {
      return foto.foto;
    });

    const formData = new FormData();

    if (fotos.length > 0) {
      fotos.forEach((foto: Fotos, idx: number) => {
        if (idx == 0) {
          formData.append('fotoPrincipal', foto.foto![0], foto.foto![0].name);
        } else {
          formData.append(`files[${idx}]`, foto.foto![0], foto.foto![0].name);
        }
      });
      formData.append('autoSemiNuevo', JSON.stringify(body));
    } else {
      formData.append('files', '');
      formData.append('autoSemiNuevo', JSON.stringify(body));
    }

    this.userService.postAutoSemiNuevo(formData).subscribe(
      (response: User) => {
        console.group('Response');
        console.log(response);
        console.groupEnd();
        this.loaderService.setIsLoadingSWAL(false);
        Swal.fire({
          titleText: '¡Éxito!',
          html: 'Su auto ha sido registrado.',
          allowOutsideClick: true,
          icon: 'success',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/dashboard');
        });
      },
      (error: any) => {
        this.loaderService.setIsLoadingSWAL(false);
        if (error.status === 423) {
          Swal.fire({
            titleText: 'Oops!',
            html: 'Se agotaron sus subidas anuales.',
            allowOutsideClick: true,
            icon: 'warning',
            showConfirmButton: true,
          });
        }
        if (
          error.status === 226 ||
          error.message.includes('este auto esta siendo vendido')
        ) {
          Swal.fire({
            titleText: 'Oops!',
            html: 'El auto ya existe actualmente en la aplicación!!',
            allowOutsideClick: true,
            icon: 'warning',
            showConfirmButton: true,
          });
        }
        console.group('Car Registrarion Error');
        console.error(error);
        console.groupEnd();
      }
    );
  }
}

// fotos.forEach((foto, index) => {
//   console.log(foto);
//   console.log('this.uploadService: ', this.uploadService);
//   this.uploadService.uploadFile(foto.foto![0], index);
// });
// this.uploadService.uploadedData.subscribe(
//   (response: any) => {
//     fotos[response.index].url = response.url;
//     cont += 1;
//     if (cont == fotos.length) {
//       uploadedPhotos.emit('ª');
//     }
//   },
//   (error: any) => {
//     console.log('Error uploading photo #' + cont, error);
//   }
// );
// uploadedPhotos.subscribe(
//   (res) => {
//     console.log('contador', cont);
// body.fotoPrincipal = fotos[0].url!;
// body.fotos = fotos.slice(1).map((foto) => {
//   return {
//     foto: foto.url!,
//   };
// });
// console.group('SemiNuevo JSON');
// console.log(body);
// console.groupEnd();
