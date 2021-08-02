import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AutoSemiNuevo,
  SponsoredCar,
} from 'src/app/core/interfaces/auto-semi-nuevo';
import { CarSearchFilter } from 'src/app/core/interfaces/car-search-filter';
import { ClientService } from 'src/app/core/services/client.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Filter } from 'src/app/core/interfaces/client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NormalizePipe } from 'src/app/core/pipes/normalize.pipe';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('availableVehicles') availableVehicles!: ElementRef;
  @ViewChild('brandCount') brandCount!: ElementRef;
  @ViewChild('userCount') userCount!: ElementRef;
  @ViewChild('soldVehicles') soldVehicles!: ElementRef;

  carrocerias: string[] = [];
  recentCars: AutoSemiNuevo[] = [];
  sponsoredCars: AutoSemiNuevo[] = [];
  fetchingCarrocerias: boolean = true;

  filters!: Filter[];
  filteredBrands!: string[];
  filteredModels!: string[];
  filterFormGroup: FormGroup;

  changedCarType: boolean = false;

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    autoplay: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  slideConfig3 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: false,
  };

  constructor(
    private router: Router,
    private storageService: StorageService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.filterFormGroup = this.fb.group({
      carType: 'OTRO',
      carSubset: 'ALL',
      carBrand: '',
      carModel: '',
      carMaxPrice: '',
      carMinYear: '',
    });

    this.clientService.getAvailableVehiclesCount().subscribe(
      (res: number) => {
        this.availableVehicles?.nativeElement.setAttribute('data-percent', res);
      },
      (error: any) => {
        console.error('error when fetching available cars');
      }
    );
    this.clientService.getBrandCount().subscribe(
      (res: number) => {
        this.brandCount?.nativeElement.setAttribute('data-percent', res);
      },
      (error: any) => {
        console.error('error when fetching brand count');
      }
    );
    this.clientService.getUserCount().subscribe(
      (res: number) => {
        this.userCount?.nativeElement.setAttribute('data-percent', res);
      },
      (error: any) => {
        console.error('error when fetching user count');
      }
    );
    this.clientService.getSoldVehiclesCount().subscribe(
      (res: number) => {
        this.soldVehicles?.nativeElement.setAttribute('data-percent', res);
      },
      (error: any) => {
        console.error('error when fetching vehicle count');
      }
    );
  }

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    this.clientService.getSponsoredCars().subscribe(
      (response: SponsoredCar[]) => {
        console.log('Response Sponsored: ', response);
        this.sponsoredCars = response.map(
          (elem: SponsoredCar) => elem.autoSemiNuevo
        );
        console.log(this.sponsoredCars);
      },
      (error: any) => {
        console.log('Error fetching sponsoredCars: ', error);
      }
    );

    this.clientService.getFilters().subscribe(
      (response: Filter[]) => {
        console.log('Filtros: ', response);
        this.filters = response.map((filter: Filter) => {
          return {
            marca: NormalizePipe.prototype.transform(filter.marca),
            modelo: NormalizePipe.prototype.transform(filter.modelo),
            tipoCarroceria: NormalizePipe.prototype.transform(
              filter.tipoCarroceria
            ),
            tipoCarro: filter.tipoCarro,
          };
        });
        this.filteredBrands = this.filters
          .map((elem) => NormalizePipe.prototype.transform(elem.marca))
          .filter((v, i, a) => a.indexOf(v) == i);
        this.carrocerias = response
          .map((elem: Filter) =>
            NormalizePipe.prototype.transform(elem.tipoCarroceria)
          )
          .filter((v, i, a) => a.indexOf(v) == i);
        // this.carrocerias.push('OTRO');
        console.log('Marcas: ', this.filteredBrands);
        console.log('Carrocerias: ', this.carrocerias);
        setTimeout(() => {
          $('#marcas').selectpicker('refresh');
          $('#modelos').selectpicker('refresh');
          this.fetchingCarrocerias = false;
        }, 500);
      },
      (error) => {
        console.group('In getting filters');
        console.error(error);
        console.groupEnd();
      }
    );

    this.clientService.getRecentCars().subscribe(
      (response: AutoSemiNuevo[]) => {
        console.log({ recentCars: response });
        this.recentCars = response;
        this.loaderService.setIsLoading(false);
      },
      (error: any) => {
        console.log('Error fetching recentCars: ', error);
      }
    );
  }

  get carType(): string {
    return this.filterFormGroup.get('carType')?.value;
  }

  get carSubset(): string {
    return this.filterFormGroup.get('carSubset')?.value;
  }

  get carBrand(): string {
    return this.filterFormGroup.get('carBrand')?.value;
  }

  get carModel(): string {
    return this.filterFormGroup.get('carModel')?.value;
  }

  get carMaxPrice(): string {
    return this.filterFormGroup.get('carMaxPrice')?.value;
  }

  get carMinYear(): string {
    return this.filterFormGroup.get('carMinYear')?.value;
  }

  // Cambiar Carroceria
  changeCarType(type: string): void {
    console.warn(type);
    this.changedCarType = true;
    this.filterFormGroup.controls['carType'].setValue(type);
    console.log(this.filterFormGroup.get('carType')?.value);
    this.filteredBrands = this.filters
      .filter((elem: Filter) => {
        return (
          (type == 'OTRO' || elem.tipoCarroceria == type) &&
          (this.carSubset == 'ALL' || elem.tipoCarro == this.carSubset)
        );
      })
      .map((elem) => elem.marca)
      .filter((v, i, a) => a.indexOf(v) == i);
    this.filteredModels = [];
    this.filterFormGroup.get('carBrand')?.setValue('');
    this.filterFormGroup.get('carModel')?.setValue('');
    setTimeout(() => {
      $('#marcas').selectpicker('refresh');
      $('#modelos').selectpicker('refresh');
    }, 250);
    console.log(this.filteredBrands);
  }

  // Cambiar Usados, Nuevos, Todos
  changeCarSubset(subset: string): void {
    this.filterFormGroup.controls['carSubset'].setValue(subset);
    console.log(
      'Car Subset: ',
      this.filterFormGroup.controls['carSubset'].value
    );
    this.filteredBrands = this.filters
      ?.filter((elem) =>
        this.carType != 'OTRO'
          ? this.carType === elem.tipoCarroceria &&
            (this.carSubset == 'ALL' || elem.tipoCarro == this.carSubset)
          : this.carSubset == 'ALL' || elem.tipoCarro == this.carSubset
      )
      .map((elem) => elem.marca)
      .filter((v, i, a) => a.indexOf(v) == i);
    this.filteredModels = [];
    this.filterFormGroup.get('carBrand')?.setValue('');
    this.filterFormGroup.get('carModel')?.setValue('');
    setTimeout(() => {
      $('#modelos').selectpicker('refresh');
    }, 500);
    setTimeout(() => {
      $('#marcas').selectpicker('refresh');
    }, 500);
  }

  // Cambiar marca
  changeCarBrand(e: any): void {
    const brand: string = e.target.value;
    console.log('Change Car Brand Event: ', e.target.value);
    console.log(this.filterFormGroup.get('carBrand')?.value);
    this.filteredModels = this.filters
      .filter((elem) =>
        this.carType != 'OTRO'
          ? elem.marca == brand &&
            elem.tipoCarroceria == this.carType &&
            (this.carSubset == 'ALL' || elem.tipoCarro == this.carSubset)
          : elem.marca == brand &&
            (this.carSubset == 'ALL' || elem.tipoCarro == this.carSubset)
      )
      .map((elem) => NormalizePipe.prototype.transform(elem.modelo))
      .filter((v, i, a) => a.indexOf(v) == i);
    console.log('filtered models');
    console.log(this.filteredModels);
    setTimeout(() => {
      $('#modelos').selectpicker('refresh');
    }, 500);
  }

  yearFilter(type: string): void {
    if (
      Number(this.filterFormGroup.get(type)?.value) >
      new Date().getFullYear() + 1
    ) {
      this.filterFormGroup.get(type)?.setValue('');
    }
  }

  goToCarSearch(carSubset: string): void {
    const body: CarSearchFilter = {
      carSubset: carSubset,
    };
    this.router.navigate(['/inventory-listings'], {
      queryParams: body,
    });
  }

  goToListings(): void {
    let body: CarSearchFilter = {
      carSubset: this.filterFormGroup.value.carSubset,
    };
    if (this.changedCarType) body.carType = this.filterFormGroup.value.carType;
    if (this.carBrand != '')
      body.carBrand = this.filterFormGroup.value.carBrand;
    if (this.carModel != '')
      body.carModel = this.filterFormGroup.value.carModel;
    if (this.carMaxPrice != '')
      body.carMaxPrice = Number(this.filterFormGroup.value.carMaxPrice);
    if (this.carMinYear != '')
      body.carMinYear = Number(this.filterFormGroup.value.carMinYear);
    this.router.navigate(['/inventory-listings'], {
      queryParams: body,
    });
  }

  goToCarRegistration(): void {
    if (this.storageService.isLoggedIn()) {
      console.log('redirect to car-registration');
      this.router.navigateByUrl('/dashboard/registrar-auto');
    } else {
      this.router.navigateByUrl('/auth');
    }
  }

  goToVehicleDetails(carId: number | undefined): void {
    this.router.navigate(['/auto-semi-nuevo'], {
      queryParams: {
        id: carId,
      },
    });
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

  getBannerImg(carType: string) {
    switch (carType) {
      case 'SEDAN': {
        return '/assets/media/general/banner-images/V_Carros-01.svg';
      }
      case 'COUPE': {
        return '/assets/media/general/banner-images/V_Carros-02.svg';
      }
      case 'HATCHBACK': {
        return '/assets/media/general/banner-images/V_Carros-03.svg';
      }
      case 'SUV': {
        return '/assets/media/general/banner-images/V_Carros-04.svg';
      }
      case 'PICKUP': {
        return '/assets/media/general/banner-images/V_Carros-05.svg';
      }
      case 'VAN': {
        return '/assets/media/general/banner-images/V_Carros-06.svg';
      }
      case 'PANEL': {
        return '/assets/media/general/banner-images/V_Carros-07.svg';
      }
      case 'CAMION': {
        return '/assets/media/general/banner-images/V_Carros-08.svg';
      }
      default: {
        return '/assets/media/general/banner-images/V_Carros-02.svg';
      }
    }
  }

  round(kilometraje: number) {
    const kiloToShow = kilometraje / 1000;
    return Math.round(kiloToShow * 10) / 10;
  }
}
