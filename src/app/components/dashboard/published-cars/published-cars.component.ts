import { LabelType, Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AutoSemiNuevo } from 'src/app/core/interfaces/auto-semi-nuevo';
import { CarSearchFilter } from 'src/app/core/interfaces/car-search-filter';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UserService } from 'src/app/core/services/user.service';
import { DataService } from 'src/app/core/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from 'src/app/core/services/client.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Filter } from 'src/app/core/interfaces/client';
import { Ubigeo } from 'src/app/core/interfaces/ubigeo';
import { SortType } from 'src/app/core/enums/sort-type.enum';
import { Pagination } from 'src/app/core/superclasses/pagination';
import { Filters } from 'src/app/core/enums/filters';
import { NormalizePipe } from 'src/app/core/pipes/normalize.pipe';

@Component({
  selector: 'app-published-cars',
  templateUrl: './published-cars.component.html',
  styleUrls: ['./published-cars.component.css'],
})
export class PublishedCarsComponent extends Pagination implements OnInit {
  @Input() filters!: CarSearchFilter;

  // * filters
  carrocerias!: string[];
  filterFormGroup: FormGroup;
  filteredBrands!: string[];
  filteredModels!: string[];
  carFilters!: Filter[];
  appliedFilters!: Filters[];

  // * cars
  carros: AutoSemiNuevo[] = [];
  filteredCarros: AutoSemiNuevo[] = [];
  auxFilteredCarros: AutoSemiNuevo[] = [];

  // * datos
  tiposTransmision: string[];
  tiposCombustible: string[];
  tiposCarroceria: string[];
  anos!: string[];
  departamentos: string[];
  tiposTracciones: string[];

  // * ngx slider
  minPrice!: number;
  maxPrice!: number;
  options!: Options;
  minKilometraje!: number;
  maxKilometraje!: number;
  optionsKilometraje!: Options;
  minYear!: number;
  maxYear!: number;
  optionsYear!: Options;

  // * Grid - Listings
  list: boolean = true;

  // * booleans
  loadingCars: boolean = false;

  constructor(
    private userService: UserService,
    private loaderService: LoaderService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private clientService: ClientService,
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

    this.appliedFilters = [];
    this.tiposTracciones = this.dataService.tiposTracciones;
    this.anos = this.dataService.anos;
    this.tiposTransmision = this.dataService.tiposTransmision;
    this.tiposCombustible = this.dataService.tiposCombustible;
    this.tiposCarroceria = this.dataService.tiposCarroceria;
    this.departamentos = this.dataService.departamentos;
    this.filterFormGroup = this.fb.group({
      carBrand: '',
      carModel: '',
      carType: '',
      carSubset: '',
      carMinYear: '',
      carTransmission: '',
      carFuelType: '',
      carDepartamentos: '',
      carTraction: '',
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    this.loadingCars = true;

    // console.group('Filtros desde Home');
    // console.log(this.filters);
    // console.groupEnd();

    this.clientService.getFilters().subscribe(
      (response: Filter[]) => {
        console.log('Filtros: ', response);
        this.carFilters = response.map((filter: Filter) => {
          return {
            marca: NormalizePipe.prototype.transform(filter.marca),
            modelo: NormalizePipe.prototype.transform(filter.modelo),
            tipoCarroceria: NormalizePipe.prototype.transform(
              filter.tipoCarroceria
            ),
            tipoCarro: filter.tipoCarro,
          };
        });

        if (this.subset === 'ALL') {
          this.filteredBrands = this.carFilters
            .map((elem: Filter) => elem.marca)
            .filter((v, i, a) => a.indexOf(v) == i);
        } else {
          this.filteredBrands = this.carFilters
            .filter((f: Filter) => {
              return f.tipoCarro.includes(this.subset);
            })
            .map((elem: Filter) => elem.marca)
            .filter((v, i, a) => a.indexOf(v) == i);
        }

        this.carrocerias = this.carFilters
          .map((elem: Filter) => elem.tipoCarroceria)
          .filter((v, i, a) => a.indexOf(v) == i);
        this.carrocerias.push('OTRO');
        console.log('Marcas: ', this.filteredBrands);
        console.log('Carrocerias: ', this.carrocerias);

        // carType: carrocería
        // carBrand: marca

        if (this.carroceria !== '') {
          if (this.marca !== '') {
            // carrocería y marca
            // console.log('a');
            this.filteredModels = this.carFilters
              .filter(
                (elem: Filter) =>
                  elem.tipoCarroceria === this.carroceria &&
                  elem.marca === this.marca
              )
              .map((fil: Filter) => fil.modelo);
          } else {
            // carrocería
            // console.log('b');
            this.filteredModels = this.carFilters
              .filter((elem: Filter) => elem.tipoCarroceria === this.carroceria)
              .map((fil: Filter) => fil.modelo);
          }
        } else {
          if (this.marca !== '') {
            // marca
            // console.log('c');
            this.filteredModels = this.carFilters
              .filter((elem: Filter) => elem.marca === this.marca)
              .map((fil: Filter) => fil.modelo);
          } else {
            // ni marca ni carrocería
            // console.log('d');
            this.filteredModels = [];
          }
        }

        console.group('Modelos');
        console.log(this.filteredModels);
        console.groupEnd();
      },
      (error) => {
        console.group('In getting filters');
        console.error(error);
        console.groupEnd();
      }
    );

    if (this.filters?.carMaxPrice) {
      this.maxPrice = this.filters.carMaxPrice!;
    } else {
      this.maxPrice = 50000;
    }
    this.minPrice = 0;

    this.minKilometraje = 0;
    this.maxKilometraje = 500000; // 500 000 km

    if (this.filters?.carMinYear) {
      this.minYear = this.filters?.carMinYear;
    } else {
      this.minYear = 2000;
    }

    this.maxYear = new Date().getFullYear() + 1;

    this.updatePriceSliderOptions();
    this.updateKilometrajeSliderOptions();
    this.updateYearSliderOptions();

    // console.group('Marca y Modelo de Home');
    // console.log(this.marca);
    // console.log(this.modelo);
    // console.groupEnd();

    this.filterFormGroup = this.fb.group({
      carSubset: this.subset,
      carBrand: this.marca,
      carModel: this.modelo,
      carType: this.carroceria,
      carMinYear: this.desde,
      carTransmission: '',
      carFuelType: '',
      carDepartamentos: '',
      carTraction: '',
    });

    switch (this.filters?.carSubset) {
      case 'ALL': {
        // console.log('ALL');
        this.getAllCars(true);
        break;
      }
      case 'NEW': {
        // console.log('NEW');
        this.getNewCars(true);
        break;
      }
      case 'USED': {
        // console.log('USED');
        this.getUsedcars(true);
        break;
      }
      default: {
        console.warn('unknown carSubset');
        this.userService.getAutosSemiNuevosValidados().subscribe(
          (response: AutoSemiNuevo[]) => {
            this.carros = response;

            console.group('Autos Semi Nuevos');
            console.dir(this.carros);
            console.groupEnd();

            // console.group('Carrocerías');
            // console.log(this.carros.map((carro) => carro.tipoCarroceria));
            // console.groupEnd();

            this.filteredCarros = response;

            super.updatePagination(this.filteredCarros.length);
          },
          (error: any) => {
            console.error(
              'when fetching all semi nuevos validados in published-car.component.ts: ',
              error
            );
          }
        );
      }
    }
    console.groupEnd();
  }

  changeGridView(type: string): void {
    this.list = type == 'list';
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  filterResponse(): void {
    let filterTypes: Filters[] = [];

    if (this.filters.carBrand) {
      filterTypes.push(Filters.CarBrand);
    }
    if (this.filters.carModel) {
      filterTypes.push(Filters.CarModel);
    }
    if (this.filters.carMaxPrice) {
      filterTypes.push(Filters.SliderPrice);
    }
    if (this.filters.carType) {
      filterTypes.push(Filters.CarType);
    }
    if (this.filters.carMinYear) {
      filterTypes.push(Filters.CarYearFrom);
    }

    this.filterCarsBy(filterTypes);
  }

  filterByName(event: any): void {
    const normalizedQuery: string = this._normalizeValue(event.target.value);
    this.filteredCarros = this.auxFilteredCarros.filter(
      (carro: AutoSemiNuevo) => {
        return (
          this._normalizeValue(carro.marca).includes(normalizedQuery) ||
          this._normalizeValue(carro.modelo).includes(normalizedQuery) ||
          (carro.anoFabricacion
            ? this._normalizeValue(carro.anoFabricacion!.toString()).includes(
                normalizedQuery
              )
            : true)
        );
      }
    );
    super.updatePagination(this.filteredCarros.length);
  }

  changeCarSubset(e: any): void {
    const subset: string = e.value;
    switch (subset) {
      case 'ALL': {
        this.getAllCars(false);
        break;
      }
      case 'NEW': {
        this.getNewCars(false);
        break;
      }
      case 'USED': {
        this.getUsedcars(false);
        break;
      }
    }

    this.filteredBrands = this.carFilters
      .filter(
        (elem: Filter) =>
          this.carSubset?.value == 'ALL' ||
          elem.tipoCarro == this.carSubset?.value
      )
      .map((elem) => NormalizePipe.prototype.transform(elem.marca))
      .filter((v, i, a) => a.indexOf(v) == i);
    this.filterFormGroup.get('carBrand')?.setValue('');
    this.filterFormGroup.get('carModel')?.setValue('');
    this.filteredModels = [];
    this.resetFilters();
    this.appliedFilters = [];
    super.updatePagination(this.filteredCarros.length);
  }

  changeBrand(e: any): void {
    let indexOfModelFilter = this.appliedFilters.indexOf(Filters.CarModel);
    if (indexOfModelFilter !== -1) {
      this.appliedFilters.splice(indexOfModelFilter, 1);
    }
    this.filterCarsBy(Filters.CarBrand);
    this.filteredModels = this.carFilters
      ?.filter((elem: Filter) => {
        if (this.carType?.value !== '') {
          if (this.carSubset?.value !== '') {
            return this.carType?.value != 'OTRO'
              ? elem.marca == this.carBrand?.value &&
                  elem.tipoCarroceria == this.carType?.value &&
                  (this.carSubset?.value == 'ALL' ||
                    elem.tipoCarro == this.carSubset?.value)
              : elem.marca == this.carBrand?.value &&
                  (this.carSubset?.value == 'ALL' ||
                    elem.tipoCarro == this.carSubset?.value);
          } else {
            return this.carType?.value != 'OTRO'
              ? elem.marca == this.carBrand?.value &&
                  elem.tipoCarroceria == this.carType?.value
              : elem.marca == this.carBrand?.value;
          }
        } else {
          if (this.carSubset?.value !== '') {
            return (
              elem.marca == this.carBrand?.value &&
              (this.carSubset?.value == 'ALL' ||
                elem.tipoCarro == this.carSubset?.value)
            );
          } else {
            return elem.marca == this.carBrand?.value;
          }
        }
      })
      .map((elem) => elem.modelo)
      .filter((v, i, a) => a.indexOf(v) == i);
    this.carModel?.setValue('');
  }

  changeModel(e: any): void {
    this.filterCarsBy(Filters.CarModel);
  }

  changeCarroceria(e: any): void {
    this.filterCarsBy(Filters.CarType);
  }

  filterCarsBy(type: Filters | Filters[]): void {
    if (typeof type === 'object') {
      type.forEach((tipo: Filters) => {
        if (this.appliedFilters.indexOf(tipo) === -1) {
          this.appliedFilters.push(tipo);
          // console.log('adding filter...: ', tipo);
        }
      });
    } else if (typeof type === 'number') {
      if (this.appliedFilters.indexOf(type) === -1) {
        this.appliedFilters.push(type);
        // console.log('adding filter...: ', type);
      }
    }

    // console.log('Aplying filters: ', this.appliedFilters);
    // TODO: quizas mostrar un loader mientras filtra

    let aux: AutoSemiNuevo[] = this.carros;

    this.appliedFilters.forEach((filtro: Filters) => {
      switch (filtro) {
        case Filters.CarBrand: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.marca.includes(this.carBrand?.value)
          );
          // console.log('brand: ', aux);
          break;
        }
        case Filters.CarModel: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.modelo.includes(this.carModel?.value)
          );
          // console.log('model: ', aux);
          break;
        }
        case Filters.CarType: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            NormalizePipe.prototype
              .transform(auto.tipoCarroceria)
              .includes(this.carType?.value)
          );
          // console.log('carroceria: ', aux);
          break;
        }
        case Filters.CarYearFrom: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.anoFabricacion
              ? auto.anoFabricacion >= this.carMinYear?.value
              : true
          );
          // console.log('año desde: ', aux);
          break;
        }
        case Filters.CarTransmission: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.tipoCambios
              ? auto.tipoCambios.includes(this.carTransmission?.value)
              : true
          );
          break;
        }
        case Filters.CarFuelType: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.tipoCombustible
              ? auto.tipoCombustible.includes(this.carFuelType?.value)
              : true
          );
          break;
        }
        case Filters.CarTraction: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.tipoTraccion
              ? auto.tipoTraccion.includes(this.carTraction?.value)
              : true
          );
          break;
        }
        case Filters.CarDepartments: {
          aux = aux.filter((auto: AutoSemiNuevo) => {
            if (auto.locacion) {
              let buleano: boolean = false;
              this.carDepartamentos?.value.forEach((departamento: string) => {
                buleano = buleano || auto.locacion!.includes(departamento);
              });
              return buleano;
            } else {
              return true;
            }
          });
          break;
        }
        case Filters.SliderKilometraje: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.kilometraje
              ? auto.kilometraje >= this.minKilometraje &&
                auto.kilometraje <= this.maxKilometraje
              : true
          );
          // console.log('slider kilometraje: ', aux);
          break;
        }
        case Filters.SliderPrice: {
          aux = aux.filter(
            (auto: AutoSemiNuevo) =>
              auto.precioVenta >= this.minPrice &&
              auto.precioVenta <= this.maxPrice
          );
          // console.log(
          //   'maxPrice: ',
          //   this.maxPrice,
          //   'this.minPrice: ',
          //   this.minPrice
          // );
          // console.log('slider price: ', aux);
          break;
        }
        case Filters.SliderYear: {
          aux = aux.filter((auto: AutoSemiNuevo) =>
            auto.anoFabricacion
              ? auto.anoFabricacion >= this.minYear &&
                auto.anoFabricacion <= this.maxYear
              : true
          );
          // console.log('slider year: ', aux);
          break;
        }
      }
    });

    console.log('filtered: ', this.filteredCarros);

    this.filteredCarros = aux;
    this.auxFilteredCarros = this.filteredCarros;
    super.updatePagination(this.filteredCarros.length);
  }

  changeTransmision(e: any): void {
    this.filterCarsBy(Filters.CarTransmission);
  }

  changeCombustible(e: any): void {
    this.filterCarsBy(Filters.CarFuelType);
  }

  changeTraccion(e: any): void {
    this.filterCarsBy(Filters.CarTraction);
  }

  changeDepartamentos(e: any): void {
    this.filterCarsBy(Filters.CarDepartments);
  }

  changeAnoFrom(e: any): void {
    this.filterCarsBy(Filters.CarYearFrom);
    this.minYear = +e.value;
    this.updateYearSliderOptions();
  }

  sortBy(e: any): void {
    const by = e.target.value;
    console.log('sortBy option selected: ', by);

    switch (by) {
      case SortType.PrecioMenorMayor: {
        console.log('precio ascendiente');

        this.filteredCarros.sort((a: AutoSemiNuevo, b: AutoSemiNuevo) => {
          return a.precioVenta - b.precioVenta;
        });

        break;
      }
      case SortType.PrecioMayorMenor: {
        console.log('precio descendiente');

        this.filteredCarros.sort((a: AutoSemiNuevo, b: AutoSemiNuevo) => {
          return b.precioVenta - a.precioVenta;
        });
        break;
      }
      case SortType.AnoMenorMayor: {
        console.log('precio ascendiente');

        this.filteredCarros.sort((a: AutoSemiNuevo, b: AutoSemiNuevo) => {
          return a.anoFabricacion - b.anoFabricacion;
        });

        break;
      }
      case SortType.AnoMayorMenor: {
        console.log('precio descendiente');

        this.filteredCarros.sort((a: AutoSemiNuevo, b: AutoSemiNuevo) => {
          return b.anoFabricacion - a.anoFabricacion;
        });

        break;
      }
      default: {
        console.warn('unknown sort type');
      }
    }
  }

  resetFilters(all: boolean = false): void {
    this.carBrand?.setValue('');
    this.carModel?.setValue('');
    this.carMaxPrice?.setValue('');
    this.carMinYear?.setValue('');
    this.carTransmission?.setValue('');
    this.carFuelType?.setValue('');
    if (all) {
      this.carSubset?.setValue('');
    }
    this.carType?.setValue('');
    this.carDepartamentos?.setValue('');

    this.filteredCarros = [];
    this.auxFilteredCarros = [];

    this.minPrice = 0;
    this.maxPrice = 50000;

    this.minKilometraje = 0;
    this.maxKilometraje = 500000;

    this.minYear = 2000;
    this.maxYear = new Date().getFullYear() + 1;

    this.updatePriceSliderOptions();
    this.updateKilometrajeSliderOptions();
    this.updateYearSliderOptions();

    this.filteredModels = [];
    this.appliedFilters = [];
  }

  getUsedcars(shouldFilterCars?: boolean): void {
    this.loadingCars = true;
    this.userService.getAutosSemiNuevosValidados().subscribe(
      (response: AutoSemiNuevo[]) => {
        this.carros = response.map((auto: AutoSemiNuevo) => {
          return {
            ...auto,
            marca: NormalizePipe.prototype.transform(auto.marca),
            modelo: NormalizePipe.prototype.transform(auto.modelo),
            tipoCarroceria: NormalizePipe.prototype.transform(
              auto.tipoCarroceria
            ),
          };
        });

        if (shouldFilterCars) {
          this.filterResponse();
        } else {
          this.filteredCarros = this.carros;
        }

        this.auxFilteredCarros = this.filteredCarros;
        super.updatePagination(this.filteredCarros.length);
      },
      (error: any) => {
        console.error(
          'when fetching all semi nuevos validados in published-car.component.ts: ',
          error
        );
      },
      () => {
        this.loadingCars = false;
      }
    );
  }

  getAllCars(shouldFilterCars?: boolean): void {
    this.loadingCars = true;
    this.clientService.getAllCars().subscribe(
      (response: AutoSemiNuevo[]) => {
        this.carros = response.map((auto: AutoSemiNuevo) => {
          return {
            ...auto,
            marca: NormalizePipe.prototype.transform(auto.marca),
            modelo: NormalizePipe.prototype.transform(auto.modelo),
            tipoCarroceria: NormalizePipe.prototype.transform(
              auto.tipoCarroceria
            ),
          };
        });

        if (shouldFilterCars) {
          this.filterResponse();
        } else {
          this.filteredCarros = this.carros;
        }

        this.auxFilteredCarros = this.filteredCarros;
        super.updatePagination(this.filteredCarros.length);
      },
      (error: any) => {
        console.error(
          'when fetching all semi nuevos validados in published-car.component.ts: ',
          error
        );
      },
      () => {
        this.loadingCars = false;
      }
    );
  }

  getNewCars(shouldFilterCars?: boolean): void {
    this.loadingCars = true;
    this.userService.getAutosNuevos().subscribe(
      (response: AutoSemiNuevo[]) => {
        this.carros = response.map((auto: AutoSemiNuevo) => {
          return {
            ...auto,
            marca: NormalizePipe.prototype.transform(auto.marca),
            modelo: NormalizePipe.prototype.transform(auto.modelo),
            tipoCarroceria: NormalizePipe.prototype.transform(
              auto.tipoCarroceria
            ),
          };
        });

        if (shouldFilterCars) {
          this.filterResponse();
        } else {
          this.filteredCarros = this.carros;
        }

        this.auxFilteredCarros = this.filteredCarros;
        super.updatePagination(this.filteredCarros.length);
      },
      (error: any) => {
        console.error(
          'when fetching all semi nuevos validados in published-car.component.ts: ',
          error
        );
      },
      () => {
        this.loadingCars = false;
      }
    );
  }

  // * filtros que vienen de Home

  get subset(): string {
    return typeof this.filters?.carSubset !== 'undefined'
      ? this.filters.carSubset
      : '';
  }

  get marca(): string {
    return typeof this.filters?.carBrand !== 'undefined'
      ? this.filters.carBrand
      : '';
  }

  get modelo(): string {
    return typeof this.filters?.carModel !== 'undefined'
      ? this.filters.carModel
      : '';
  }

  get carroceria(): string {
    return typeof this.filters?.carType !== 'undefined'
      ? this.filters.carType
      : '';
  }

  get desde(): string {
    return typeof this.filters?.carMinYear !== 'undefined'
      ? this.filters.carMinYear.toString()
      : '';
  }

  get maxPrecio(): string {
    return typeof this.filters?.carMaxPrice !== 'undefined'
      ? this.filters.carMaxPrice.toString()
      : '';
  }

  // * filtros que el usuario va a aplicar

  get carBrand() {
    return this.filterFormGroup.get('carBrand');
  }

  get carModel() {
    return this.filterFormGroup.get('carModel');
  }

  get carMaxPrice() {
    return this.filterFormGroup.get('carMaxPrice');
  }

  get carMinYear() {
    return this.filterFormGroup.get('carMinYear');
  }

  get carTransmission() {
    return this.filterFormGroup.get('carTransmission');
  }

  get carFuelType() {
    return this.filterFormGroup.get('carFuelType');
  }

  get carType() {
    return this.filterFormGroup.get('carType');
  }

  get carSubset() {
    return this.filterFormGroup.get('carSubset');
  }

  get carDepartamentos() {
    return this.filterFormGroup.get('carDepartamentos');
  }

  get carTraction() {
    return this.filterFormGroup.get('carTraction');
  }

  yearSliderChanged(e: any) {
    this.filterCarsBy(Filters.SliderYear);
  }

  kilometrajeSliderChanged(e: any) {
    this.filterCarsBy(Filters.SliderKilometraje);
  }

  priceSliderChanged(e: any): void {
    this.filterCarsBy(Filters.SliderPrice);
  }

  updatePriceSliderOptions(): void {
    this.options = {
      floor: this.minPrice,
      ceil: this.maxPrice,
      step: 1000,
    };
  }

  updateYearSliderOptions(): void {
    this.optionsYear = {
      floor: this.minYear,
      ceil: this.maxYear,
      step: 1,
    };
  }

  updateKilometrajeSliderOptions(): void {
    this.optionsKilometraje = {
      floor: this.minKilometraje,
      ceil: this.maxKilometraje,
      step: 10000,
    };
  }
}
