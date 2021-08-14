import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SortType } from 'src/app/core/enums/sort-type.enum';
import { AutoInteresado } from 'src/app/core/interfaces/auto-interesado';
import { AutoNuevo } from 'src/app/core/interfaces/auto-nuevo';
import { AutoReportado } from 'src/app/core/interfaces/auto-reportado';
import {
  AutoSemiNuevo,
  SponsoredCar,
} from 'src/app/core/interfaces/auto-semi-nuevo';
import { CommonService } from 'src/app/core/services/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Pagination } from 'src/app/core/superclasses/pagination';

@Component({
  selector: 'app-admin-cars',
  templateUrl: './admin-cars.component.html',
  styleUrls: ['./admin-cars.component.css'],
})
export class AdminCarsComponent
  extends Pagination
  implements OnInit, OnChanges
{
  @Input() name!: string;

  @Input() validationView: boolean = false;
  @Input() reportedView: boolean = false;
  @Input() interestingView: boolean = false;
  @Input() sponsorView: boolean = false;
  @Input() adminView: boolean = false;

  @Input() notValidatedCars: AutoSemiNuevo[] = [];
  @Input() reportedCars: AutoReportado[] = [];
  @Input() interestingCars: AutoInteresado[] = [];
  @Input() sponsoredCars: SponsoredCar[] = [];
  @Input() allCars: (AutoNuevo | AutoSemiNuevo)[] = [];

  @Output() validate = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>(); //admin
  @Output() reportedIsValid = new EventEmitter<number>();
  @Output() mostrarReportadores = new EventEmitter<AutoReportado>();
  @Output() mostrarVentaDetails = new EventEmitter<AutoInteresado>();
  @Output() setSponsorLevel = new EventEmitter<number>();
  @Output() removeSponsor = new EventEmitter<number>();

  list: boolean;
  len: number = 0;

  // * carros
  reportedFilteredCarros: AutoReportado[] = [];

  notValidatedFilteredCarros: AutoSemiNuevo[] = [];

  interestingFilteredCarros: AutoInteresado[] = [];

  sponsoredFilteredCarros: SponsoredCar[] = [];

  allFilteredCars: (AutoNuevo | AutoSemiNuevo)[] = [];

  constructor(
    private loaderService: LoaderService,
    private commonService: CommonService
  ) {
    super();
    if (this.commonService.screenWidth <= 1060) {
      this.list = false;
    } else {
      this.list = true;
    }

    this.commonService.changeLayoutEvent.subscribe(() => {
      this.changeGridView('grid');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.group('ngOnChanges');
    console.dir(changes);
    console.groupEnd();

    if (changes.notValidatedCars && this.notValidatedCars.length > 0) {
      this.notValidatedFilteredCarros = this.notValidatedCars;
      this.len = this.notValidatedFilteredCarros.length;
    } else if (changes.reportedCars && this.reportedCars.length > 0) {
      this.reportedFilteredCarros = this.reportedCars;
      this.len = this.reportedFilteredCarros.length;
    } else if (changes.interestingCars && this.interestingCars.length > 0) {
      this.interestingFilteredCarros = this.interestingCars;
      this.len = this.interestingFilteredCarros.length;
    } else if (changes.sponsoredCars && this.sponsoredCars.length > 0) {
      this.sponsoredFilteredCarros = this.sponsoredCars;
      this.len = this.sponsoredFilteredCarros.length;
    } else if (changes.allCars && this.allCars.length > 0) {
      this.allFilteredCars = this.allCars;
      this.len = this.allCars.length;
    }
    super.updatePagination(this.len);
  }

  ngOnInit(): void {}

  validateCar(id: number): void {
    this.validate.emit(id);
  }

  removeCar(id: number): void {
    this.remove.emit(id);
  }

  markAsValid(id: number): void {
    this.reportedIsValid.emit(id);
  }

  changeSponsorLevel(id: number): void {
    this.setSponsorLevel.emit(id);
  }

  showReporters(auto: AutoReportado): void {
    this.mostrarReportadores.emit(auto);
  }

  sellCar(auto: AutoInteresado): void {
    this.mostrarVentaDetails.emit(auto);
  }

  quitarSponsor(id: number): void {
    this.removeSponsor.emit(id);
  }

  changeGridView(type: string): void {
    this.list = type == 'list';
  }

  filterByName(event: any): void {
    const normalizedQuery: string = this._normalizeValue(event.target.value);
    if (this.validationView) {
      this.notValidatedFilteredCarros = this.notValidatedCars.filter(
        (carro: AutoSemiNuevo) => {
          //TODO: añadir más propiedades? (año, kilometraje, etc)
          return (
            this._normalizeValue(carro.marca).includes(normalizedQuery) ||
            this._normalizeValue(carro.modelo).includes(normalizedQuery)
          );
        }
      );
      this.len = this.notValidatedFilteredCarros.length;
    } else if (this.reportedView) {
      this.reportedFilteredCarros = this.reportedCars.filter(
        (carro: AutoReportado) => {
          //TODO: añadir más propiedades? (año, kilometraje, etc)
          return (
            this._normalizeValue(carro.marca).includes(normalizedQuery) ||
            this._normalizeValue(carro.modelo).includes(normalizedQuery)
          );
        }
      );
      this.len = this.reportedFilteredCarros.length;
    } else if (this.interestingView) {
      this.interestingFilteredCarros = this.interestingCars.filter(
        (carro: AutoInteresado) => {
          //TODO: añadir más propiedades? (año, kilometraje, etc)
          return (
            this._normalizeValue(carro.auto.modelo).includes(normalizedQuery) ||
            this._normalizeValue(carro.auto.modelo).includes(normalizedQuery)
          );
        }
      );
      this.len = this.interestingFilteredCarros.length;
    } else if (this.sponsorView) {
      this.sponsoredFilteredCarros = this.sponsoredCars.filter(
        (carro: SponsoredCar) => {
          //TODO: añadir más propiedades? (año, kilometraje, etc)
          return (
            this._normalizeValue(carro.autoSemiNuevo.marca).includes(
              normalizedQuery
            ) ||
            this._normalizeValue(carro.autoSemiNuevo.modelo).includes(
              normalizedQuery
            )
          );
        }
      );
      this.len = this.sponsoredFilteredCarros.length;
    } else if (this.adminView) {
      this.allFilteredCars = this.allCars.filter(
        (carro: AutoNuevo | AutoSemiNuevo) => {
          //TODO: añadir más propiedades? (año, kilometraje, etc)
          return (
            this._normalizeValue(carro.modelo).includes(normalizedQuery) ||
            this._normalizeValue(carro.marca).includes(normalizedQuery)
          );
        }
      );
      this.len = this.allFilteredCars.length;
    }
    super.updatePagination(this.len);
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  filterSimpleCars(
    cars: AutoSemiNuevo[] | AutoReportado[] | AutoNuevo[],
    byPrice: boolean,
    ascending: boolean
  ) {
    if (byPrice) {
      if (ascending) {
        cars.sort(
          (
            a: AutoSemiNuevo | AutoReportado | AutoNuevo,
            b: AutoSemiNuevo | AutoReportado | AutoNuevo
          ) => {
            return a.precioVenta - b.precioVenta;
          }
        );
      } else {
        cars.sort(
          (
            a: AutoSemiNuevo | AutoReportado | AutoNuevo,
            b: AutoSemiNuevo | AutoReportado | AutoNuevo
          ) => {
            return b.precioVenta - a.precioVenta;
          }
        );
      }
    } else {
      if (ascending) {
        cars.sort(
          (
            a: AutoSemiNuevo | AutoReportado | AutoNuevo,
            b: AutoSemiNuevo | AutoReportado | AutoNuevo
          ) => {
            return (a.anoFabricacion as number) - (b.anoFabricacion as number);
          }
        );
      } else {
        cars.sort(
          (
            a: AutoSemiNuevo | AutoReportado | AutoNuevo,
            b: AutoSemiNuevo | AutoReportado | AutoNuevo
          ) => {
            return (b.anoFabricacion as number) - (a.anoFabricacion as number);
          }
        );
      }
    }
  }

  filterSponsorCars(byPrice: boolean, ascending: boolean) {
    if (byPrice) {
      if (ascending) {
        this.sponsoredCars.sort((a: SponsoredCar, b: SponsoredCar) => {
          return a.autoSemiNuevo.precioVenta - b.autoSemiNuevo.precioVenta;
        });
      } else {
        this.sponsoredCars.sort((a: SponsoredCar, b: SponsoredCar) => {
          return b.autoSemiNuevo.precioVenta - a.autoSemiNuevo.precioVenta;
        });
      }
    } else {
      if (ascending) {
        this.sponsoredCars.sort((a: SponsoredCar, b: SponsoredCar) => {
          return (
            a.autoSemiNuevo.anoFabricacion - b.autoSemiNuevo.anoFabricacion
          );
        });
      } else {
        this.sponsoredCars.sort((a: SponsoredCar, b: SponsoredCar) => {
          return (
            b.autoSemiNuevo.anoFabricacion - a.autoSemiNuevo.anoFabricacion
          );
        });
      }
    }
  }

  filterInterestedCars(byPrice: boolean, ascending: boolean) {
    if (byPrice) {
      if (ascending) {
        this.interestingCars.sort((a: AutoInteresado, b: AutoInteresado) => {
          return a.auto.precioVenta - b.auto.precioVenta;
        });
      } else {
        this.interestingCars.sort((a: AutoInteresado, b: AutoInteresado) => {
          return b.auto.precioVenta - a.auto.precioVenta;
        });
      }
    } else {
      if (ascending) {
        this.interestingCars.sort((a: AutoInteresado, b: AutoInteresado) => {
          return a.auto.anoFabricacion - b.auto.anoFabricacion;
        });
      } else {
        this.interestingCars.sort((a: AutoInteresado, b: AutoInteresado) => {
          return b.auto.anoFabricacion - a.auto.anoFabricacion;
        });
      }
    }
  }

  filterCarros(byPrice: boolean, ascending: boolean) {
    if (this.validationView) {
      this.filterSimpleCars(this.notValidatedCars, byPrice, ascending);
    } else if (this.reportedView) {
      this.filterSimpleCars(this.reportedCars, byPrice, ascending);
    } else if (this.sponsorView) {
      this.filterSponsorCars(byPrice, ascending);
    } else if (this.interestingView) {
      this.filterInterestedCars(byPrice, ascending);
    } else if (this.adminView) {
      this.filterSimpleCars(
        this.allCars as AutoNuevo[] | AutoSemiNuevo[] | AutoReportado[],
        byPrice,
        ascending
      );
    } else {
      console.warn('unknown view (admin-cars.component.ts');
    }
  }

  sortBy(e: any): void {
    const by = e.target.value;
    console.log('sortBy option selected: ', by);

    switch (by) {
      case SortType.PrecioMenorMayor: {
        console.log('precio ascendiente');
        this.filterCarros(true, true);
        break;
      }
      case SortType.PrecioMayorMenor: {
        console.log('precio descendiente');
        this.filterCarros(true, false);
        break;
      }
      case SortType.AnoMenorMayor: {
        console.log('precio ascendiente');
        this.filterCarros(false, true);
        break;
      }
      case SortType.AnoMayorMenor: {
        console.log('precio descendiente');
        this.filterCarros(false, false);
        break;
      }
      default: {
        console.warn('unknown sort type');
      }
    }
  }
}
