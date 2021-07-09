import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css'],
})
export class CuentaComponent implements OnInit {
  profileFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorage: StorageService,
    private router: Router
  ) {
    this.profileFormGroup = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('[0-9]')]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.userService
      .getUser(this.localStorage.getEmailLocalStorage()!)
      .subscribe((response: User) => {
        this.profileFormGroup.controls['dni'].setValue(response.numDocumento);
        this.profileFormGroup.controls['nombre'].setValue(response.nombre);
        this.profileFormGroup.controls['apellidos'].setValue(
          response.apellidos
        );
        this.profileFormGroup.controls['telefono'].setValue(
          response.numTelefono
        );
        this.profileFormGroup.controls['email'].setValue(response.correo);
        this.profileFormGroup.controls['password'].setValue(response.password);
      });
    this.profileFormGroup.controls['dni'].disable();
    this.profileFormGroup.controls['nombre'].disable();
    this.profileFormGroup.controls['apellidos'].disable();
  }

  saveChanges(): void {
    const body: User = {
      id: this.localStorage.getIdLocalStorage()!,
      correo: this.profileFormGroup.value.email,
      numTelefono: this.profileFormGroup.value.telefono,
      password: this.profileFormGroup.value.password,
    };
    this.userService.putUser(body).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado!',
          text: 'Información personal guardada correctamente',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/dashboard');
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Hubo un error actualizando su información, por favor inténtelo más tarde.',
          showConfirmButton: true,
        });
      }
    );
  }

  ngOnInit(): void {}
}
