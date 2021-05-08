import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { DataService } from 'src/app/core/services/data.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ClientService } from 'src/app/core/services/client.service';

export interface Fotos {
  foto?: FileList;
  src?: string;
  url?: string;
}

@Component({
  selector: 'app-car-cu',
  templateUrl: './car-cu.component.html',
  styleUrls: ['./car-cu.component.css'],
})
export class CarCuComponent implements OnInit {
  @Input() create: boolean = false;
  @Input() update: boolean = false;
  @Input() title!: string;
  @Input() submitButtonText!: string;
  @Input() updateAction!: (auto: AutoSemiNuevo) => void;
  @Input() createAction!: (
    body: AutoSemiNuevo,
    fotos: Fotos[],
    uploadedPhotos: EventEmitter<string>
  ) => void;

  formGroup: FormGroup;
  carId: number = -1;
  fotoPrincipal!: File;
  fotos: Fotos[] = [{}];
  uploadedPhotos = new EventEmitter<string>();
  validatedPlaca: boolean = false;
  role: string | null;
  correo: string | null;
  fetchingPlaca: boolean = false;
  fetchingDNI: boolean = false;
  date: Date;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  imgFile!: string;
  dniTries: number = 0;
  placaTries: number = 0;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fotos, event.previousIndex, event.currentIndex);
  }

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    public dataService: DataService,
    public uploadService: UploadService,
    private clientService: ClientService
  ) {
    this.date = new Date();
    this.role = this.storageService.getRoleLocalStorage();
    this.correo = this.storageService.getEmailLocalStorage();
    // TODO: validators
    // TODO: validator cuando entra a editar, ningun campo que ya esté, debe cambiar a vacío, o sí puede?
    //NOTE: sería paja autocompletar la info del usuario particular para ahorrarle chamba
    // F3W642
    // BJX356
    this.formGroup = this.fb.group({
      id: '',
      dniDueno: ['', [Validators.required, Validators.pattern(/[0-9]{8}/)]],
      correoDueno: ['', [Validators.required, Validators.email]],
      nombreDueno: ['', [Validators.required]],
      telefonoDueno: ['', [Validators.required]],
      placa: [
        'BBB222',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      serie: [''],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anoFabricacion: [
        '2018',
        [
          Validators.required,
          Validators.max(this.date.getFullYear() + 1),
          Validators.maxLength(4),
          Validators.min(1999),
        ],
      ],
      tipoCambios: ['Automático', Validators.required],
      tipoCombustible: ['Eléctrico', Validators.required],
      tipoCarroceria: ['SUV', Validators.required],
      cilindrada: [
        '1200',
        [Validators.required, Validators.min(100), Validators.max(32000)],
      ],
      kilometraje: ['120000', Validators.required],
      numeroPuertas: ['5', Validators.required],
      tipoTraccion: ['Trasera', Validators.required],
      color: ['Azul', Validators.required],
      numeroCilindros: [
        '4',
        [Validators.required, Validators.min(1), Validators.max(16)],
      ],
      precioVenta: ['69420', Validators.required],
      descripcion: [''],
      terms: '',
      privacy: '',
    });
    this.formGroup.controls['nombreDueno'].disable();
    this.formGroup.controls['serie'].disable();
    this.formGroup.controls['marca'].disable();
    this.formGroup.controls['modelo'].disable();
  }

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    if (this.update || this.role === RolesEnum.ADMIN) {
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.userService.getAutoSemiNuevoById(params['id']).subscribe(
            (res: AutoSemiNuevo) => {
              if (
                this.role !== RolesEnum.ADMIN &&
                this.role !== RolesEnum.SUPERADMIN &&
                res.usuario.correo !== this.correo
              ) {
                // el sapaso (que no es admin ni superadmin) esta tratando de editar un carro que no es suyo
                // this.router.navigate(['/sapos-al-agua']);
                console.log(
                  'sapaso, ese no es tu carro, porq lo quieres editar'
                );
                this.router.navigate(['/home']);
                return;
              }

              console.group('autoseminuevo por id');
              console.dir(res);
              console.groupEnd();

              this.formGroup = this.fb.group({
                id: res.id,
                correoDueno: [res.correoDueno, [Validators.email]],
                nombreDueno: res.nombreDueno,
                telefonoDueno: res.telefonoDueno,
                // TODO: añadir el regex de una placa peruana
                placa: [
                  res.placa,
                  [Validators.minLength(6), Validators.maxLength(6)],
                ],
                serie: res.serie,
                marca: res.marca,
                modelo: res.modelo,
                anoFabricacion: [
                  res.anoFabricacion,
                  [
                    Validators.max(this.date.getFullYear()),
                    Validators.maxLength(4),
                    Validators.min(1999),
                  ],
                ],
                tipoCambios: res.tipoCambios,
                tipoCombustible: res.tipoCombustible,
                tipoCarroceria: res.tipoCarroceria,
                cilindrada: [
                  res.cilindrada,
                  [
                    Validators.required,
                    Validators.min(100),
                    Validators.max(32000),
                  ],
                ],
                kilometraje: res.kilometraje,
                numeroPuertas: res.numeroPuertas,
                tipoTraccion: res.tipoTraccion,
                color: res.color,
                numeroCilindros: [
                  res.numeroCilindros,
                  [Validators.required, Validators.min(1), Validators.max(16)],
                ],
                precioVenta: res.precioVenta,
              });

              this.title = 'Actualiza tu Carro';
              this.carId = params['id'];
            },
            (error: any) => {
              console.group('error fetching autoseminuevo por id');
              console.error(error);
              console.groupEnd();
            },
            () => {
              this.loaderService.setIsLoading(false);
            }
          );
        } else {
          // si no tiene params, mandarlo a home porq no hay carro que editar
          this.loaderService.setIsLoading(false);
          if (!this.create) {
            this.router.navigate(['/home']);
          }
        }

        console.group('Form Group');
        console.log(this.formGroup);
        console.groupEnd();
      });
    } else {
      this.userService
        .getUser(this.storageService.getEmailLocalStorage()!)
        .subscribe((response) => {
          this.formGroup.controls['dniDueno'].setValue(response.numDocumento);
          this.formGroup.controls['correoDueno'].setValue(response.correo);
          this.formGroup.controls['nombreDueno'].setValue(response.nombre);
          this.formGroup.controls['telefonoDueno'].setValue(
            response.numTelefono
          );
        });
    }
  }

  onImageChange(e: any, idx: number) {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      this.fotos[idx].foto = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fotos[idx].src = reader.result as string;
      };
    }
  }

  changeStep(id: number) {
    this.step1 = id === 1;
    this.step2 = id === 2;
    this.step3 = id === 3;
    this.step4 = id === 4;
    this.step5 = id === 5;
  }

  checkPlaca(): void {
    this.fetchingPlaca = true;
    let body = {
      placa: this.formGroup.controls['placa'].value,
      token: 'fe6ae5a7928cd90ea30f7c3767c9c25bb2a4d0ea',
    };
    this.userService.getPlacaDetails(body).subscribe(
      (response: any) => {
        console.log(response);
        if (
          response.success &&
          (response.encontrado === undefined || response.encontrado)
        ) {
          this.formGroup.controls['serie'].setValue(response.data.serie);
          this.formGroup.controls['marca'].setValue(response.data.marca);
          this.formGroup.controls['modelo'].setValue(response.data.modelo);
          this.fetchingPlaca = false;
          this.validatedPlaca = true;
          console.log(this.formGroup);
        } else {
          Swal.fire({
            titleText: 'Oops!',
            html:
              'No se encontró el auto con esa placa. Por favor, revise que sea correcto.',
            allowOutsideClick: true,
            icon: 'error',
            showConfirmButton: true,
          });
          this.formGroup.controls['placa'].setValue('');
        }
      },
      (error: any) => {
        this.fetchingPlaca = false;
        Swal.fire({
          titleText: 'Oops!',
          html:
            'No se encontró el auto con esa placa. Por favor, revise que sea correcto.',
          allowOutsideClick: true,
          icon: 'error',
          showConfirmButton: true,
        });
        console.error(error);
        this.placaTries = this.placaTries + 1;
        if (this.placaTries == 2) {
          this.formGroup.controls['serie'].enable();
          this.formGroup.controls['marca'].enable();
          this.formGroup.controls['modelo'].enable();
        }
      }
    );
  }

  checkDNI() {
    if (this.formGroup.controls['dniDueno'].value) {
      this.fetchingDNI = true;
      this.clientService
        .getDNIDetails(this.formGroup.controls['dniDueno'].value)
        .subscribe(
          (response) => {
            this.fetchingDNI = false;
            this.formGroup.controls['nombreDueno'].setValue(
              response.nombres +
                ' ' +
                response.apellido_p +
                ' ' +
                response.apellido_m
            );
          },
          (error) => {
            this.fetchingDNI = false;
            console.log(`[ERROR]: Check DNI, ${error}`);
            Swal.fire({
              titleText: 'DNI incorrecto, por favor intente de nuevo.',
              html: 'Try again please.',
              allowOutsideClick: true,
              icon: 'error',
              showConfirmButton: true,
            });
            this.dniTries = this.dniTries + 1;
            if (this.dniTries == 2) {
              this.formGroup.controls['nombreDueno'].enable();
            }
          }
        );
    }
  }

  toJSON(): AutoSemiNuevo {
    const body: AutoSemiNuevo = {
      id: this.formGroup.value.id,
      usuario: {
        correo: this.storageService.getEmailLocalStorage()!,
      },
      placa: this.formGroup.value.placa,
      serie: this.formGroup.value.serie,
      correoDueno: this.formGroup.value.correoDueno,
      nombreDueno: this.formGroup.value.nombreDueno,
      telefonoDueno: this.formGroup.value.telefonoDueno,
      marca: this.formGroup.value.marca,
      modelo: this.formGroup.value.modelo,
      anoFabricacion: this.formGroup.value.anoFabricacion,
      tipoCambios: this.formGroup.value.tipoCambios,
      tipoCombustible: this.formGroup.value.tipoCombustible,
      tipoCarroceria: this.formGroup.value.tipoCarroceria,
      cilindrada: this.formGroup.value.cilindrada,
      kilometraje: this.formGroup.value.kilometraje,
      numeroPuertas: this.formGroup.value.numeroPuertas,
      tipoTraccion: this.formGroup.value.tipoTraccion,
      color: this.formGroup.value.color,
      numeroCilindros: this.formGroup.value.numeroCilindros,
      precioVenta: this.formGroup.value.precioVenta,
      fotoPrincipal: '',
      fotos: [],
      accesorios: [],
      locacion: {
        id: '000000',
      },
    };
    if (this.create) {
      delete body.id;
    }
    return body;
  }

  addPhoto(): void {
    if (this.fotos.length < 15) {
      this.fotos.push({});
    }
  }

  submitActionWrapper(): void {
    // if (this.formGroup.invalid) {
    //   Swal.fire({
    //     icon: 'error',
    //     title:
    //       'Algunos campos fueron ingresados incorrectamente. Por favor, corrígelos.',
    //   });
    //   return;
    // }
    if (this.create) {
      this.createActionWrapper();
      return;
    }
    if (this.update) {
      this.updateActionWrapper();
      return;
    }
  }

  removePhoto(i: number) {
    this.fotos.splice(i, 1);
  }

  updateActionWrapper(): void {
    this.updateAction(this.toJSON());
  }

  createActionWrapper(): void {
    if (
      this.formGroup.value.terms === true &&
      this.formGroup.value.privacy === true
    ) {
      this.fotos = this.fotos.filter((foto, idx) => {
        return foto.foto;
      });
      this.createAction(this.toJSON(), this.fotos, this.uploadedPhotos);
    } else {
      Swal.fire({
        titleText: 'Oops!',
        html:
          'Si no aceptas los términos y condiciones y la política de privacidad no podrás subir tu carro a la aplicación.',
        allowOutsideClick: true,
        icon: 'warning',
        showConfirmButton: true,
      });
    }
  }
}
