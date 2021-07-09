import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { Accesorio } from 'src/app/core/interfaces/accesorio';
import {
  AutoSemiNuevo,
  SponsoredCar,
} from 'src/app/core/interfaces/auto-semi-nuevo';
import { Denuncia } from 'src/app/core/interfaces/denuncia';
import { Lead } from 'src/app/core/interfaces/lead';
import { AdminService } from 'src/app/core/services/admin.service';
import { ClientService } from 'src/app/core/services/client.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auto-semi-nuevo',
  templateUrl: './auto-semi-nuevo.component.html',
  styleUrls: ['./auto-semi-nuevo.component.css'],
})
export class AutoSemiNuevoComponent implements OnInit {
  @ViewChild('') slide1!: ElementRef;
  @ViewChild('') slide2!: ElementRef;
  auto!: AutoSemiNuevo;
  tiposAccesorios!: string[];
  loading: boolean = true;
  logged: boolean = false;
  isRemax: boolean = false;
  isAdmin: boolean = false;

  sendingContactForm: boolean = false;

  contactFormGroup: FormGroup;

  slideConfig = {
    arrows: true,
    fade: true,
    asNavFor: '.js-slider-for',
  };

  slideConfig2 = {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.js-slider-nav',
    focusOnSelect: true,
  };

  constructor(
    private userService: UserService,
    private clientService: ClientService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    public storageService: StorageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.logged = this.storageService.isLoggedIn();
    console.log('logged', this.logged);
    this.isRemax = this.storageService.getRoleLocalStorage() == RolesEnum.REMAX;
    this.isAdmin =
      this.storageService.getRoleLocalStorage() == RolesEnum.ADMIN ||
      this.storageService.getRoleLocalStorage() == RolesEnum.SUPERADMIN;
    this.contactFormGroup = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('[0-9]{8,8}')]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('9[0-9]{8,8}')]],
      correo: ['', [Validators.required, Validators.email]],
      descripcion: '',
    });
  }

  getAccesoriosOfTipo(tipo: string): Accesorio[] {
    return this.auto.accesorios!.filter((a: Accesorio) => a.tipo === tipo);
  }

  unique(value: string, idx: number, self: any) {
    return self.indexOf(value) === idx;
  }

  ngOnInit(): void {
    this.loading = true;
    this.loaderService.setIsLoading(true);
    this.route.queryParams.subscribe((params) => {
      console.group('Params');
      console.log(params);
      console.groupEnd();
      if (params['id']) {
        this.userService.getAutoSemiNuevoById(params['id']).subscribe(
          (response: AutoSemiNuevo) => {
            console.group('AutoSemiNuevo por ID:');
            console.dir(response);
            console.groupEnd();
            this.auto = response;
            this.tiposAccesorios = this.auto
              .accesorios!.map((a: Accesorio) => a.tipo)
              .filter(this.unique);
            this.auto.fotos?.unshift(this.auto.fotoPrincipal);
          },
          (error: any) => {
            console.group('Error fetching autoSemiNuevo por ID');
            console.error(error);
            console.groupEnd();
            this.router.navigate(['/home']);
          },
          () => {
            this.loading = false;
          }
        );
      } else {
        this.router.navigate(['/home']);
      }
      this.loaderService.setIsLoading(false);
    });
  }

  submitForm() {
    this.sendingContactForm = true;
    let bodyForm = new HttpParams()
      .set('DNI', this.contactFormGroup.value.dni)
      .set('First_Name', this.contactFormGroup.value.nombres)
      .set('Last_Name', this.contactFormGroup.value.apellidos)
      .set('Phone_Number', this.contactFormGroup.value.telefono)
      .set('Email', this.contactFormGroup.value.correo)
      .set('Carroceria_Vehiculo', this.auto.tipoCarroceria)
      .set('Nuevo', 'false')
      .set('ID_Auto', '424')
      .set(
        'DatosSemiNuevo',
        this.contactFormGroup.value.descripcion.length > 0
          ? this.auto.marca +
              '-' +
              this.auto.modelo +
              '-' +
              this.auto.placa +
              '-' +
              this.contactFormGroup.value.descripcion
          : this.auto.marca + '-' + this.auto.modelo + '-' + this.auto.placa
      );

    const body2 = {
      autoSemiNuevo: {
        id: this.auto.id,
      },
      dni: this.contactFormGroup.value.dni,
      nombres:
        this.contactFormGroup.value.nombres +
        ' ' +
        this.contactFormGroup.value.apellidos,
      correo: this.contactFormGroup.value.correo,
      numTelefono: this.contactFormGroup.value.telefono,
    };

    this.clientService.postPilot(bodyForm).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Enviado!',
          icon: 'success',
          html: 'Solicitud generada! Le llamarán por teléfono para seguir con el proceso de compra.',
          showConfirmButton: true,
        });
        this.clientService.postFormInterested(body2).subscribe(
          (response) => {
            console.log('Agregado a InteresadosCompra');
          },
          (error) => {
            console.log('Error en agregar a InteresadosCompra');
          }
        );
        this.sendingContactForm = false;
        this.contactFormGroup.reset();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Oops!',
          icon: 'error',
          html: 'Hubo un fallo en el servidor, por favor intenta más tarde. Si el problema persiste, contacta con un administrador.',
          showConfirmButton: true,
        });
        this.sendingContactForm = false;
      }
    );
  }

  contact(): void {
    this.sendingContactForm = true;
    const bodyForm = new HttpParams()
      .set('DNI', this.storageService.getDniLocalStorage()!)
      .set('First_Name', this.storageService.getNombreLocalStorage()!)
      .set('Last_Name', this.storageService.getApellidosLocalStorage()!)
      .set('Phone_Number', this.storageService.getPhoneLocalStorage()!)
      .set('Email', this.storageService.getEmailLocalStorage()!)
      .set('Carroceria_Vehiculo', this.auto.tipoCarroceria)
      .set('Nuevo', 'false')
      .set('ID_Auto', '424')
      .set(
        'DatosSemiNuevo',
        this.contactFormGroup.value.descripcion.length > 0
          ? this.auto.marca +
              '-' +
              this.auto.modelo +
              '-' +
              this.contactFormGroup.value.descripcion
          : this.auto.marca + '-' + this.auto.modelo
      );

    console.log(bodyForm);

    const body2 = {
      autoSemiNuevo: {
        id: this.auto.id,
      },
      dni: this.storageService.getDniLocalStorage()!,
      nombre: this.storageService.getNombreLocalStorage()!,
      apellidos: this.storageService.getApellidosLocalStorage()!,
      correo: this.storageService.getEmailLocalStorage()!,
      numTelefono: this.storageService.getPhoneLocalStorage()!,
    };

    this.clientService.postPilot(bodyForm).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Enviado!',
          icon: 'success',
          html: 'Solicitud generada! Le llamaran por telefono para seguir con el proceso de compra.',
          showConfirmButton: true,
        });
        this.clientService.postFormInterested(body2).subscribe(
          (response) => {
            console.log('Agregado a InteresadosCompra');
          },
          (error) => {
            console.log('Error en agregar a InteresadosCompra');
          }
        );
        this.sendingContactForm = false;
      },
      (error) => {
        Swal.fire({
          title: 'Oops!',
          icon: 'error',
          html: 'Hubo un fallo en el servidor, por favor intenta más tarde. Si el problema persiste, contacta con un administrador.',
          showConfirmButton: true,
        });
        this.sendingContactForm = false;
      }
    );
  }

  addCarToSponsored(): void {
    const body: SponsoredCar = {
      autoSemiNuevo: this.auto,
    };
    this.adminService.addCarToSponsored(body).subscribe(
      (response) => {
        Swal.fire({
          title: 'Agregado!',
          icon: 'success',
          html: 'Auto agregado a patrocinados.',
          showConfirmButton: true,
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status == 400) {
          Swal.fire({
            title: 'Oops!',
            icon: 'error',
            html: 'El auto ya se encuentra dentro de los autos patrocinados.',
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            icon: 'error',
            html: 'Hubo un fallo en el servidor, por favor intenta más tarde. Si el problema persiste, contacta con un administrador.',
            showConfirmButton: true,
          });
        }
      }
    );
  }

  denunciar(descripcion: string): void {
    console.log('denunciar auto. descripcion: ', descripcion);

    if (descripcion === '') {
      Swal.fire('¡Debes poner una descripción!', '', 'error');
      return;
    }

    const body: Denuncia = {
      autoSemiNuevo: {
        id: this.auto.id!,
      },
      usuario: {
        correo: this.storageService.getEmailLocalStorage(),
      },
      descripcion: descripcion,
    };

    Swal.fire({
      title: '¿Denunciar este auto?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.denunciar(body).subscribe(
          (response: any) => {
            console.log(response);
            Swal.fire('Denunciado', '', 'success');
          },
          (error: any) => {
            console.error('denunciando: ', error);
            Swal.fire('No se puede denunciar un auto dos veces', '', 'error');
          }
        );
      }
    });
  }

  addToInsterested(): void {
    let body = {
      autoSemiNuevo: {
        id: this.auto.id,
      },
      usuario: {
        correo: this.storageService.getEmailLocalStorage(),
      },
    };
    this.userService.addCarToInsterested(body).subscribe(
      (response) => {
        console.group('Interesado Venta Response');
        console.log(response);
        console.groupEnd();
        Swal.fire({
          title: 'Agregado!',
          icon: 'success',
          html: 'Auto agregado a interesados por vender. Ya puedes empezar a ofrecerlo entre tus contactos!',
          showConfirmButton: true,
        });
      },
      (error: any) => {
        Swal.fire({
          title: 'Oops!',
          icon: 'error',
          html: 'Hubo un fallo en el servidor, por favor intenta más tarde. Si el problema persiste, contacta con un administrador.',
          showConfirmButton: true,
        });
        console.log('Error processing request: ', error);
      }
    );
  }
}
