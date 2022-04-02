import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { AdminService } from 'src/app/core/services/admin.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { StorageService } from 'src/app/core/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sell-details',
  templateUrl: './sell-details.component.html',
  styleUrls: ['./sell-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SellDetailsComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SellDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AutoSemiNuevo,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private storageService: StorageService,
    private adminService: AdminService,
    private cdRef: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      comision: [null, [Validators.required]],
      precioFinalVenta: [null, [Validators.required, Validators.min(0)]],
      canalVenta: [null, [Validators.required]],
      ruc: [null],
      documento: [null],
      nombreComprador: [null, [Validators.required]],
      dniOrRuc: [true],
    });
  }

  ngOnInit(): void {}

  registrarVenta(): void {
    this.loaderService.setIsLoadingSWAL(
      true,
      'Registrando la venta',
      'Espere unos momentos'
    );
    const form = this.formGroup.value;
    const body = {
      id: this.data.id,
      sellout: {
        id: this.storageService.getIdLocalStorage(),
      },
      canalVenta: form.canalVenta,
      detalleVenta: form.detalleVenta,
      ruc: form.ruc,
      documento: form.documento,
      nombreComprador: form.nombreComprador,
      precioFinalVenta: form.precioFinalVenta,
      comision: +form.comision / 100,
    };

    this.adminService.registrarVenta(body).subscribe(
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
  }

  errorInComision(): boolean {
    console.log(+this.formGroup.get('comision')?.value / 100 > 100);
    return +this.formGroup.get('comision')?.value / 100 > 100;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  resetPersonalInfo(e: any): void {
    if (e.value) {
      this.formGroup.controls['ruc'].setValue(null);
    } else {
      this.formGroup.controls['documento'].setValue(null);
    }
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
}
