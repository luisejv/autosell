import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AutoInteresado } from 'src/app/core/interfaces/auto-interesado';
import { AutoNuevo } from 'src/app/core/interfaces/auto-nuevo';
import { AutoReportado } from 'src/app/core/interfaces/auto-reportado';
import {
  AutoSemiNuevo,
  SponsoredCar,
} from 'src/app/core/interfaces/auto-semi-nuevo';

@Component({
  selector: 'app-published-car',
  templateUrl: './published-car.component.html',
  styleUrls: ['./published-car.component.css'],
})
export class PublishedCarComponent implements OnInit, OnChanges {
  @Input() auto!:
    | AutoSemiNuevo
    | AutoReportado
    | AutoInteresado
    | SponsoredCar
    | AutoNuevo;

  @Input() mode: boolean = true;

  @Input() validationView: boolean = false;
  @Input() reportedView: boolean = false;
  @Input() interestingView: boolean = false; // admin sale
  @Input() interesadoView: boolean = false;
  @Input() sponsorView: boolean = false;
  @Input() normalView: boolean = false;
  @Input() particularPublishedView: boolean = false;
  @Input() newCarView: boolean = false;

  @Output() validated = new EventEmitter<number>();

  @Output() removed = new EventEmitter<number>();
  @Output() reportedIsValid = new EventEmitter<number>();
  @Output() showReporters = new EventEmitter<AutoReportado>();

  @Output() sell = new EventEmitter<AutoInteresado>();

  @Output() removeInterested = new EventEmitter<number>();

  @Output() changeSponsorLevel = new EventEmitter<number>();
  @Output() removeSponsor = new EventEmitter<number>();

  // auto validado y interesado = AutoSemiNuevo
  // auto reportado             = Auto Reportado
  autoCasteado!: AutoSemiNuevo | AutoReportado;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('auto interesado: ', this.auto);
    console.log('interesting view: ', this.interestingView);
  }

  get sponsorCar(): SponsoredCar {
    return this.auto as SponsoredCar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.group('Changes');
    console.dir(changes);
    console.groupEnd();

    if (this.normalView || this.particularPublishedView) {
      this.autoCasteado = this.auto as AutoSemiNuevo;
    } else if (this.sponsorView) {
      this.autoCasteado = (this.auto as SponsoredCar).autoSemiNuevo;
    } else if (
      (changes.validationView &&
        changes.validationView.firstChange &&
        this.validationView) ||
      (changes.interesadoView &&
        changes.interesadoView.firstChange &&
        this.interesadoView)
    ) {
      this.autoCasteado = this.auto as AutoSemiNuevo;
    } else if (
      changes.reportedView &&
      changes.reportedView.firstChange &&
      this.reportedView
    ) {
      this.autoCasteado = this.auto as AutoReportado;
    } else if (
      changes.interestingView &&
      changes.interestingView.firstChange &&
      this.interestingView
    ) {
      this.autoCasteado = (this.auto as AutoInteresado).auto as AutoSemiNuevo;
    }
  }

  goToVehicleDetails(): void {
    console.log('clicked on new car');
    if (!this.validationView) {
      if (this.newCarView) {
        this.router.navigate(['/auto-nuevo'], {
          queryParams: {
            id: +(this.auto as AutoNuevo).id,
          },
        });
      } else {
        this.router.navigate(['/auto-semi-nuevo'], {
          queryParams: {
            id: this.autoCasteado.id,
          },
        });
      }
    }
  }

  goToCarEditView(): void {
    this.router.navigateByUrl(
      `/dashboard/editar-carro/${this.autoCasteado.id}`
    );
  }

  emitSeeReporters(): void {
    this.showReporters.emit(this.auto as AutoReportado);
  }

  emitValidationEvent(): void {
    this.validated.emit(+this.autoCasteado.id!);
  }

  emitMarkAsValidEvent(): void {
    this.reportedIsValid.emit(+this.autoCasteado.id!);
  }

  emitRemoveEvent(): void {
    this.removed.emit(+this.autoCasteado.id!);
  }

  emitSaleEvent(): void {
    this.sell.emit(this.auto as AutoInteresado);
  }

  quitarInteresado(): void {
    this.removeInterested.emit((this.auto as AutoSemiNuevo).id);
  }

  sponsorLevelEvent(): void {
    console.log('casteado: ', (this.auto as SponsoredCar).id!);
    this.changeSponsorLevel.emit((this.auto as SponsoredCar).id!);
  }

  quitarSponsor(): void {
    this.removeSponsor.emit((this.auto as SponsoredCar).id);
  }
}
