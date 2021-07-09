import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AutoInteresado } from 'src/app/core/interfaces/auto-interesado';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { InteresadoCompra } from 'src/app/core/interfaces/interesado-compra';
import { InteresadoReventa } from 'src/app/core/interfaces/interesado-reventa';
import { Venta } from 'src/app/core/interfaces/venta';
import { AdminService } from 'src/app/core/services/admin.service';
import { CommonService } from 'src/app/core/services/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UploadService } from 'src/app/core/services/upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta-details',
  templateUrl: './venta-details.component.html',
  styleUrls: ['./venta-details.component.css'],
})
export class VentaDetailsComponent implements OnInit {
  formGroup!: FormGroup;
  constancia!: File;
  constanciaUrl!: string;
  interesadosCompra: InteresadoCompra[] = [];
  filteredInteresadosCompra: InteresadoCompra[] = [];
  interesadosReventa: InteresadoReventa[] = [];
  filteredInteresadosReventa: InteresadoReventa[] = [];

  constructor(
    public dialogRef: MatDialogRef<VentaDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AutoInteresado,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private adminService: AdminService
  ) {
    console.group('Dialog Data');
    console.dir(data);
    console.groupEnd();
    this.interesadosCompra = this.data.interesadosCompra;
    this.interesadosReventa = this.data.interesadosReventa;
    console.log('interesadosCompra: ', {
      interesadosCompra: this.interesadosCompra,
    });
    // console.log('interesadosCompra: ', { interesadosCompra: this.interesadosReventa });
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      vendidoPorRevendedor: [null, [Validators.required]],
      vendedor: [null, [Validators.required, this.vendedorMatch.bind(this)]],
      comprador: null,
      constanciaFoto: [null, [Validators.required]],
      comisionGeneral: [
        null,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      precioFinalVenta: [null, [Validators.required, Validators.min(0)]],
    });
    this.disableInputs();
  }

  private vendedorMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (
      this.interesadosReventa && // existe
      this.interesadosReventa.indexOf(selection) < 0 && // existe dentro de la lista
      !control.errors?.required && // no esta vacío
      selection != ''
    ) {
      return { requireMatch: true };
    }
    return null;
  }

  private compradorMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (
      this.interesadosCompra && // existe
      this.interesadosCompra.indexOf(selection) < 0 && // existe dentro de la lista
      !control.errors?.required && // no esta vacío
      selection != ''
    ) {
      return { requireMatch: true };
    }
    return null;
  }

  public showInteresadoCompra = (interesado?: InteresadoCompra) => {
    if (interesado) {
      return (
        interesado?.nombres +
        ' ' +
        interesado?.apellidos +
        ' - ' +
        interesado?.dni
      );
    } else {
      return '';
    }
  };

  public showInteresadoReventa = (interesado?: InteresadoReventa) => {
    if (interesado) {
      // NOTE: ni nombre ni apellidos deberia ser null
      if (interesado!.usuario.nombre && interesado!.usuario.apellidos) {
        return `${interesado?.usuario.nombre} ${interesado!.usuario.apellidos}`;
      } else {
        return `${interesado?.usuario.correo}`;
      }
    } else {
      return '';
    }
  };

  disableInputs(): void {
    if (this.interesadosCompra.length === 0) {
      this.formGroup.controls['comprador'].setValue('No hay compradores');
      this.formGroup.controls['comprador'].disable();
    }
    if (this.interesadosReventa.length === 0) {
      this.formGroup.controls['vendedor'].setValue('No hay revendedores');
      this.formGroup.controls['vendedor'].disable();
    }
  }

  resetForm(e: any): void {
    const revendedor = e.value;

    if (this.formGroup.value.vendidoPorRevendedor) {
      this.formGroup = this.fb.group({
        vendidoPorRevendedor: [revendedor, [Validators.required]],
        vendedor: null,
        comprador: [
          null,
          [Validators.required, this.compradorMatch.bind(this)],
        ],
        constanciaFoto: [null, [Validators.required]],
        comisionGeneral: [
          null,
          [Validators.required, Validators.min(0), Validators.max(1)],
        ],
        precioFinalVenta: [null, [Validators.required, Validators.min(0)]],
      });
    } else {
      this.formGroup = this.fb.group({
        vendidoPorRevendedor: [revendedor, [Validators.required]],
        vendedor: [null, [Validators.required, this.vendedorMatch.bind(this)]],
        comprador: null,
        constanciaFoto: [null, [Validators.required]],
        comisionGeneral: [null, [Validators.required]],
        precioFinalVenta: [null, [Validators.required]],
      });
    }
    this.disableInputs();
  }

  filterInteresados(e: any) {
    const queryFilter = this._normalizeValue(e.target.value);

    if (this.formGroup.value.vendidoPorRevendedor) {
      // interesadosReventa
      this.filteredInteresadosReventa = this.interesadosReventa.filter(
        (interesado: InteresadoReventa) => {
          return (
            this._normalizeValue(interesado.usuario.nombre!).includes(
              queryFilter
            ) ||
            this._normalizeValue(interesado.usuario.correo).includes(
              queryFilter
            )
          );
        }
      );
      console.log(
        'filteredInteresadosReventa: ',
        this.filteredInteresadosReventa
      );
      console.log('interesadosReventa: ', this.interesadosReventa);
    } else {
      // interesadosCompra
      this.filteredInteresadosCompra = this.interesadosCompra.filter(
        (interesado: InteresadoCompra) => {
          return (
            this._normalizeValue(interesado.nombres).includes(queryFilter) ||
            // this._normalizeValue(interesado.apellidos).includes(queryFilter) ||
            this._normalizeValue(interesado.dni).includes(queryFilter) ||
            this._normalizeValue(interesado.correo).includes(queryFilter)
          );
        }
      );
      console.log(
        'filteredInteresadosCompra: ',
        this.filteredInteresadosCompra
      );
      console.log('interesadosCompra: ', this.interesadosCompra);
    }
  }

  private _normalizeValue(value?: string): string {
    if (value) {
      return value.toLowerCase().replace(/\s/g, '');
    } else {
      return '';
    }
  }

  addPhoto(e: any): void {
    this.constancia = e.target.files[0];
    console.log(this.constancia);
  }

  showSuccess(): void {
    Swal.fire({
      title: 'Venta registrada',
      html: 'La venta se registró con éxito',
      icon: 'success',
    });
  }

  showFailure(): void {
    Swal.fire({
      title: 'Ocurrió un error',
      html: 'No se pudo registrar la venta. Inténtalo más tarde o contacta al administrador',
      icon: 'error',
    });
  }

  debug(e: any) {
    console.log(this.formGroup.get('comisionGeneral')?.errors!);
  }

  registrarVenta(): void {
    if (this.constancia) {
      this.loaderService.setIsLoadingSWAL(
        true,
        'Registrando la venta',
        'Espere unos momentos'
      );
      const form = this.formGroup.value;
      const body: Venta = {
        autoSemiNuevo: this.data.auto,
        comprador: !form.vendidoPorRevendedor
          ? {
              correo: form.comprador.correo,
              nombre: form.comprador.nombre,
              telefono: form.comprador.numTelefono,
            }
          : null,
        vendedor: form.vendidoPorRevendedor
          ? { correo: form.vendedor.usuario.correo }
          : null,
        ciudadCompra: this.data.auto.locacion!,
        comisionGeneral: form.comisionGeneral,
        precioFinalVenta: form.precioFinalVenta,
      };

      const bodyForm = new FormData();
      bodyForm.set('file', this.constancia);
      bodyForm.set('ventaSemiNuevo', JSON.stringify(body));

      console.group('Sale Registrarion JSON');
      console.dir(body);
      console.groupEnd();

      this.adminService.registrarVenta(bodyForm).subscribe(
        (res: any) => {
          console.group('Car Registration Response');
          console.dir(res);
          console.groupEnd();
          this.loaderService.setIsLoadingSWAL(false);
          this.showSuccess();
          this.closeDialog();
        },
        (err: any) => {
          console.error('registering car sale: ', err);
          this.loaderService.setIsLoadingSWAL(false);
          this.showFailure();
          this.closeDialog();
        }
      );
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops!',
        text: 'Debe subir una foto constancia de la venta.',
        showConfirmButton: true,
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
