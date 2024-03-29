import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { Accesorio } from 'src/app/core/interfaces/accesorio';
import { CommonService } from 'src/app/core/services/common.service';

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
  @Input() updateAction!: (
    auto: AutoSemiNuevo,
    fotos: Fotos[],
    shouldUpdateFotoPrincipal: boolean,
    fotoPrincipal?: FileList
  ) => void;
  @Input() createAction!: (
    body: AutoSemiNuevo,
    fotos: Fotos[],
    uploadedPhotos: EventEmitter<string>
  ) => void;

  formGroup: FormGroup;
  accesorios!: Accesorio[];
  tiposAccesorios!: string[];
  fotoPrincipalChanged: boolean = false;
  carId: number = -1;
  fotoPrincipal!: FileList | string;
  aux!: string;
  fotos: Fotos[] = [];
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
  vin: string = '';

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
    public commonService: CommonService
  ) {
    this.date = new Date();
    this.role = this.storageService.getRoleLocalStorage();
    this.correo = this.storageService.getEmailLocalStorage();
    this.formGroup = this.fb.group({
      id: '',
      dniDueno: ['', [Validators.required, Validators.pattern(/[0-9]{8}/)]],
      correoDueno: ['', [Validators.required, Validators.email]],
      nombreDueno: ['', [Validators.required]],
      telefonoDueno: ['', [Validators.required]],
      placa: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      serie: [null],
      marca: [null, [Validators.required]],
      modelo: [null, [Validators.required]],
      anoFabricacion: [
        '',
        [
          Validators.required,
          Validators.max(this.date.getFullYear() + 1),
          Validators.maxLength(4),
          Validators.min(1980),
        ],
      ],
      tipoCambios: ['', Validators.required],
      tipoCombustible: ['', Validators.required],
      tipoCarroceria: ['', Validators.required],
      cilindrada: [
        '',
        [Validators.required, Validators.min(200), Validators.max(6000)],
      ],
      kilometraje: ['', Validators.required],
      numeroPuertas: ['', Validators.required],
      tipoTraccion: [null, Validators.required],
      color: ['', Validators.required],
      numeroCilindros: [
        '',
        [Validators.required, Validators.min(1), Validators.max(16)],
      ],
      precioVenta: ['', Validators.required],
      descripcion: [''],
      tag: [''],
    });
  }

  unique(value: string, idx: number, self: any) {
    return self.indexOf(value) === idx;
  }

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    if (this.update) {
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.userService.getAutoSemiNuevoById(params['id']).subscribe(
            (res: AutoSemiNuevo) => {
              console.group('autoseminuevo por id');
              console.log(res);
              console.groupEnd();

              this.formGroup = this.fb.group({
                id: res.id,
                dniDueno: [
                  123456789,
                  [Validators.required, Validators.pattern(/[0-9]{8}/)],
                ],
                correoDueno: [res.correoDueno, [Validators.email]],
                nombreDueno: res.nombreDueno,
                telefonoDueno: res.telefonoDueno,
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
                    Validators.min(800),
                    Validators.max(6000),
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
                accesorios: [],
                terms: '',
                privacy: '',
                descripcion: res.descripcion,
                tag: res.tag,
              });
              if (res.fotoPrincipal) {
                this.fotoPrincipal = res.fotoPrincipal;
                this.aux = this.fotoPrincipal as string;
                this.fotos.push({ src: res.fotoPrincipal });
              }
              if (res.fotos!.length > 0) {
                res.fotos!.forEach((foto: string) => {
                  this.fotos.push({ src: foto });
                });
              }
              this.title = 'Actualiza tu Auto';
              this.carId = params['id'];

              this.userService.getAccesorios().subscribe(
                (accesorios: Accesorio[][]) => {
                  console.group('Accesorios');
                  let newAccesorios: Accesorio[] = [];
                  accesorios.forEach((accesorio) =>
                    newAccesorios.push(...accesorio)
                  );
                  this.tiposAccesorios = newAccesorios
                    .map((a: Accesorio) => a.tipo)
                    .filter(this.unique);

                  console.log(this.tiposAccesorios);

                  this.accesorios = newAccesorios.map(
                    (accesorio: Accesorio) => {
                      res.accesorios?.forEach((a: Accesorio) => {
                        if (accesorio.nombre === a.nombre) {
                          accesorio.selected = true;
                        }
                      });

                      if (accesorio.selected === true) {
                        return accesorio;
                      } else {
                        accesorio.selected = false;
                        return accesorio;
                      }
                    }
                  );
                  this.formGroup.get('accesorios')?.setValue(this.accesorios);
                  console.log(this.accesorios);
                  console.groupEnd();
                },
                (err: any) => {
                  console.error('fetching accesorios: ', { err });
                }
              );
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
      this.fotos.push({});
      // this.userService
      //   .getUser(this.storageService.getEmailLocalStorage()!)
      //   .subscribe((response) => {
      //     this.formGroup.controls['dniDueno'].patchValue(response.numDocumento);
      //     this.formGroup.controls['correoDueno'].patchValue(response.correo);
      //     this.formGroup.controls['nombreDueno'].patchValue(response.nombre);
      //     this.formGroup.controls['telefonoDueno'].patchValue(
      //       response.numTelefono
      //     );
      //   });
      this.userService.getAccesorios().subscribe(
        (accesorios: Accesorio[][]) => {
          console.group('Accesorios');
          let newAccesorios: Accesorio[] = [];
          accesorios.forEach((accesorio) => newAccesorios.push(...accesorio));
          this.accesorios = newAccesorios.map((accesorio: Accesorio) => {
            accesorio.selected = false;
            return accesorio;
          });

          this.tiposAccesorios = newAccesorios
            .map((a: Accesorio) => a.tipo)
            .filter(this.unique);

          console.log(this.tiposAccesorios);

          this.formGroup.addControl(
            'accesorios',
            new FormControl(this.accesorios)
          );
          console.log(this.accesorios);
          console.groupEnd();
        },
        (err: any) => {
          console.error('fetching accesorios: ', { err });
        }
      );
    }
  }

  onImageChange(e: any, idx: number) {
    const reader = new FileReader();

    /*if (e.target.files && e.target.files.length) {
      for(let i=0; i<File.length; i++){
        const [file] = e.target.files;
        this.fotos[idx].foto = e.target.files;
        reader.readAsDataURL(file[i]);
        reader.onload=(events:any)=>{
          this.fotos.push(events.target.result);
        }
      }*/

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      this.fotos[idx].foto = e.target.files;
      reader.readAsDataURL(file);

      if (idx === 0) {
        this.fotoPrincipalChanged = true;
      }

      reader.onload = () => {
        this.fotos[idx].src = reader.result as string;
      };
      let newPhoto = true;
      this.fotos.forEach((foto) => {
        if (!foto.foto) {
          newPhoto = false;
        }
      });
      if (newPhoto) {
        this.addPhoto();
      }
    }
    console.log(this.fotos);
  }

  getAccesoriosOfTipo(tipo: string): Accesorio[] {
    return this.accesorios.filter((a: Accesorio) => a.tipo === tipo);
  }

  changeStep(id: number) {
    this.step1 = id === 1;
    this.step2 = id === 2;
    this.step3 = id === 3;
    this.step4 = id === 4;
    this.step5 = id === 5;
  }

  calculateBrandLength(marca: string, modelo: string): string {
    const words = modelo.split(' ');
    let totalLength = 0;
    const result = [];
    let i = 0;
    let finished = false;
    while (i < words.length && !finished) {
      if (totalLength + words[i].length <= 30 - marca.length) {
        result.push(words[i]);
        totalLength += words[i].length;
        i += 1;
      } else {
        finished = true;
      }
    }
    return result.join(' ');
  }

  toJSON(): AutoSemiNuevo {
    // las fotos que sobran (sin la primera que es la principal)
    // tmb las que tengan solo 'src' serán los strings de DO
    const carFotos: string[] = this.fotos
      .slice(1)
      .filter((foto: Fotos) => foto.src && foto.foto === undefined)
      .map((foto: Fotos) => foto.src) as string[];
    console.group('Fotos Sin Cambios');
    console.log(carFotos);
    console.groupEnd();
    console.group('Fotos Nuevas');
    console.log(this.fotos.slice(1).filter((foto: Fotos) => foto.foto));
    console.groupEnd();
    console.group('Foto Principal Anterior');
    console.log(this.aux);
    console.groupEnd();
    console.group('Foto Principal Actual');
    console.log(typeof this.fotoPrincipal);
    console.log(this.fotoPrincipal);
    console.groupEnd();
    let body: AutoSemiNuevo = {
      id: this.formGroup.value.id,
      placa: this.formGroup.value.placa,
      serie: this.formGroup.value.serie,
      correoDueno: this.formGroup.value.correoDueno,
      nombreDueno: this.formGroup.value.nombreDueno,
      telefonoDueno: this.formGroup.value.telefonoDueno,
      marca: this.formGroup.value.marca,
      modelo: this.calculateBrandLength(
        this.formGroup.value.marca,
        this.formGroup.value.modelo
      ),
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
      descripcion: this.formGroup.value.descripcion,
      fotoPrincipal: this.create
        ? ''
        : this.fotoPrincipalChanged && typeof this.fotoPrincipal === 'string'
        ? this.fotoPrincipal
        : (this.aux as string),
      fotos: carFotos ? (carFotos as string[]) : [],
      accesorios: this.formGroup.value.accesorios
        .filter((a: Accesorio) => a.selected)
        .map((a: Accesorio) => {
          return {
            id: a.id,
          };
        }),
      locacion: 'Lima',
      validado: true,
      tag: this.formGroup.value.tag,
      registrador: {
        id: this.storageService.getIdLocalStorage(),
      },
    };
    if (this.create) {
      delete body.id;
    }
    console.group('Auto Semi Nuevo');
    console.log(body);
    console.groupEnd();
    return body;
  }

  addPhoto(): void {
    if (this.fotos.length < 15) {
      this.fotos.push({});
    }
  }

  submitActionWrapper(): void {
    console.log(this.fotos);

    if (this.formGroup.invalid || this.fotos.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '¡Formulario inválido!',
        html: `Revisa si faltan campos o llenaste uno mal. ${
          this.fotos.length === 0
            ? 'Por ejemplo: debe haber al menos una foto.'
            : ''
        }`,
      });
    } else {
      if (this.create) {
        this.createActionWrapper();
        return;
      }
      if (this.update) {
        this.updateActionWrapper();
      }
    }
  }

  removePhoto(i: number) {
    if (i === 0) {
      this.fotoPrincipalChanged = true;
    }
    this.fotos.splice(i, 1);
  }

  updateActionWrapper(): void {
    console.log('typeof foto principal: ', typeof this.fotoPrincipal);

    // seteo la foto principal como la primera foto que se ha seleccionado
    // ya sea una nueva que el usuario acaba de subir, o un string de DO
    this.fotoPrincipal =
      this.fotos.length > 0
        ? this.fotos[0].foto
          ? (this.fotos[0].foto as FileList)
          : (this.fotos[0].src as string)
        : String('');

    // foto principal cambió pero es un archivo
    if (this.fotoPrincipalChanged && typeof this.fotoPrincipal === 'object') {
      console.log(this.fotoPrincipal);
      this.updateAction(
        this.toJSON(),
        [...this.fotos.slice(1)],
        true,
        this.fotoPrincipal
      );
      // foto pricipal cambió o no, pero el caso de que sí, ya está manejado en el toJSON
    } else {
      if (this.fotoPrincipalChanged) {
        this.updateAction(this.toJSON(), this.fotos.splice(1), false);
      } else {
        this.updateAction(this.toJSON(), [...this.fotos], false);
      }
    }
  }

  createActionWrapper(): void {
    this.createAction(this.toJSON(), this.fotos, this.uploadedPhotos);
    // if (
    //   this.formGroup.value.terms === true &&
    //   this.formGroup.value.privacy === true
    // ) {
    //   this.createAction(this.toJSON(), this.fotos, this.uploadedPhotos);
    // } else {
    //   Swal.fire({
    //     titleText: 'Oops!',
    //     html: 'Si no aceptas los términos y condiciones y la política de privacidad no podrás subir tu auto a la aplicación.',
    //     allowOutsideClick: true,
    //     icon: 'warning',
    //     showConfirmButton: true,
    //   });
    // }
  }
}
