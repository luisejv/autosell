import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-particular',
  templateUrl: './particular.component.html',
  styleUrls: ['./particular.component.css'],
})
export class ParticularComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      correo: null,
      password: null,
      rol: null,
    });
  }

  ngOnInit(): void {}

  toJSON(): User {
    return {
      correo: this.formGroup.value.correo,
      password: this.formGroup.value.password,
      rol: 'PARTICULAR',
      form: {
        estado: false,
      },
    };
  }

  registerParticular(): void {
    //TODO: añadir spinner
    const body: User = this.toJSON();
    this.userService.register(body).subscribe(
      (response: User) => {
        Swal.fire({
          titleText: '¡Registrado!',
          html: 'El registro fue exitoso. Por favor verifique su cuenta a través del email que le hemos enviado a su bandeja de entrada. <b>No olvide revisar SPAM.</b>',
          allowOutsideClick: true,
          icon: 'success',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
      (error: HttpErrorResponse) => {
        console.log('[ERROR]: Register Particular:', error);
        if (error.status === 400) {
          Swal.fire({
            titleText: 'Oops!',
            html: 'Ya existe un usuario con ese correo. Intentalo con otro, por favor.',
            allowOutsideClick: true,
            icon: 'error',
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            titleText: 'Oops!',
            html: 'Hubo un error. Intenta nuevamente, por favor.',
            allowOutsideClick: true,
            icon: 'error',
            showConfirmButton: true,
          });
        }
      }
    );
  }
}
