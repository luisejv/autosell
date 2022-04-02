import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { User } from 'src/app/core/interfaces/user';
import { DataService } from 'src/app/core/services/data.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remax',
  templateUrl: './remax.component.html',
  styleUrls: ['./remax.component.css'],
})
export class RemaxComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private storageService: StorageService
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
      email: this.formGroup.value.correo,
      password: this.formGroup.value.password,
      rol: 'REMAX',
      form: {
        estado: false,
      },
    };
  }

  registerRemax(): void {
    //TODO: añadir el spinner
    const body: User = this.toJSON();
    this.userService.register(body).subscribe(
      (response: User) => {
        Swal.fire({
          titleText: '¡Registrado!',
          html: 'Tu solicitud está siendo procesada. Te llegará un correo con los siguientes pasos.',
          allowOutsideClick: true,
          icon: 'success',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
      (error: any) => {
        console.log(`[ERROR]: Register Remax, ${error}`);
        Swal.fire({
          titleText: 'Error!',
          html: 'Try again please.',
          allowOutsideClick: true,
          icon: 'error',
          showConfirmButton: true,
        });
      }
    );
  }
}
