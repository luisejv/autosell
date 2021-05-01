import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

const AngularMaterial = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatChipsModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatTableModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [AngularMaterial],
  exports: [AngularMaterial],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class MaterialModule {}
