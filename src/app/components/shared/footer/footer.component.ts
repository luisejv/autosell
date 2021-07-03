import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { CarSearchFilter } from 'src/app/core/interfaces/car-search-filter';
import { ClientService } from 'src/app/core/services/client.service';
import { StorageService } from 'src/app/core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  ruta: string;
  isAdmin: boolean;
  newsletterFormGroup!: FormGroup;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    if (this.storageService.isLoggedIn()) {
      this.ruta = '/dashboard/registrar-auto';
    } else {
      this.ruta = '/auth';
    }
    this.isAdmin =
      this.storageService.getRoleLocalStorage() === RolesEnum.ADMIN;
    this.newsletterFormGroup = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  goToCarsSubset(subset: string): void {
    const body: CarSearchFilter = {
      carSubset: subset,
    };
    this.router
      .navigateByUrl('/home', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/inventory-listings'], { queryParams: body });
      });
  }

  addToNewsletter(): void {
    if (this.newsletterFormGroup.valid) {
      this.clientService
        .addToNewsletter({ correo: this.newsletterFormGroup.value.correo })
        .subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: '¡Agregado!',
              text: 'Te has suscrito al boletín de noticias. ¡Mantente atento a nuestras próximas promociones!',
              showConfirmButton: true,
            });
            this.newsletterFormGroup.reset();
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: '¡Oops!',
              text: 'Hubo un error con la solicitud, inténtalo más tarde por favor.',
              showConfirmButton: true,
            });
          }
        );
    } else {
      Swal.fire({
        icon: 'warning',
        title: '¡Oops!',
        text: 'Debes ingresar un correo válido para suscribirte.',
        showConfirmButton: true,
      });
    }
  }

  ngOnInit(): void {}
}
