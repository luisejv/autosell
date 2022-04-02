import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { Fotos } from '../dashboard/shared/car-cu/car-cu.component';

@Component({
  selector: 'app-upload-car',
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.css'],
})
export class UploadCarComponent implements OnInit {
  fotos: Fotos[] = [];
  update: boolean = true;
  formGroup: FormGroup;
  fotoPrincipalChanged: boolean = true;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(/[\w\W]+/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/[\w\W]+/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [Validators.required, Validators.maxLength(9), Validators.minLength(9)],
      ],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      kilometraje: ['', [Validators.required]],
      anio: [
        '',
        [
          Validators.required,
          Validators.min(1980),
          Validators.max(this.getMaxYear()),
        ],
      ],
      placa: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      mensaje: [''],
    });
    this.fotos.push({});
  }

  ngOnInit(): void {}

  getMaxYear(): number {
    return new Date().getFullYear() + 1;
  }

  onImageChange(e: any, idx: number) {
    const reader = new FileReader();

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

  toJSON(): any {
    const carFotos: string[] = this.fotos
      .slice(1)
      .filter((foto: Fotos) => foto.src && foto.foto === undefined)
      .map((foto: Fotos) => foto.src) as string[];
    const body: any = {
      placa: this.formGroup.value.placa,
      serie: this.formGroup.value.serie,
      correoDueno: this.formGroup.value.email,
      nombreDueno:
        this.formGroup.value.nombres + ' ' + this.formGroup.value.apellidos,
      telefonoDueno: this.formGroup.value.telefono,
      marca: this.formGroup.value.marca,
      modelo: this.formGroup.value.modelo,
      anoFabricacion: this.formGroup.value.anio,
      kilometraje: this.formGroup.value.kilometraje,
      descripcion: this.formGroup.value.mensaje,
      fotos: carFotos ? (carFotos as string[]) : [],
      validado: false,
    };
    return body;
  }

  removePhoto(i: number) {
    if (i === 0) {
      this.fotoPrincipalChanged = true;
    }
    this.fotos.splice(i, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fotos, event.previousIndex, event.currentIndex);
  }

  addPhoto(): void {
    if (this.fotos.length < 5) {
      this.fotos.push({});
    }
  }

  getShowError(field: string): boolean {
    return (
      this.formGroup.get(field)?.touched &&
      this.formGroup.get(field)?.errors?.required
    );
  }

  submit() {
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
      this.postCar(this.toJSON());
    }
  }

  postCar(body: any): void {
    this.loaderService.setIsLoadingSWAL(
      true,
      'Registrando su auto',
      'Espere unos momentos'
    );
    let cont = 0;

    const _fotos = this.fotos.filter((foto) => {
      return foto.foto;
    });

    const formData = new FormData();

    if (_fotos.length > 0) {
      _fotos.forEach((foto: Fotos, idx: number) => {
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
      (response: any) => {
        console.group('Response');
        console.log(response);
        console.groupEnd();
        this.loaderService.setIsLoadingSWAL(false);
        Swal.fire({
          titleText: '¡Éxito!',
          html: 'Su auto ha sido registrado. En las próximas 24hrs un asesor se comunicará con usted para hacer que la venta sea efectiva',
          allowOutsideClick: true,
          icon: 'success',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/');
        });
      },
      (error: any) => {
        this.loaderService.setIsLoadingSWAL(false);
        if (error.status === 226) {
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
