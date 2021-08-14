import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { InventoryListingsComponent } from './components/inventory-listings/inventory-listings.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from './core/services/loader-interceptor.service';
import { SpinnerModule } from './components/shared/spinner/spinner.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from './core/services/storage.service';
import { SidebarComponent } from './components/dashboard/shared/sidebar/sidebar.component';
import { CarRegistrationComponent } from './components/dashboard/car-registration/car-registration.component';
import { DataService } from './core/services/data.service';
import { CommonModule } from '@angular/common';
import { PublishedCarsComponent } from './components/dashboard/published-cars/published-cars.component';
import { RegisterComponent } from './components/register/register.component';
import { ParticularComponent } from './components/register/particular/particular.component';
import { RemaxComponent } from './components/register/remax/remax.component';
import { PublishedCarComponent } from './components/shared/published-car/published-car.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { AutoSemiNuevoComponent } from './components/details/auto-semi-nuevo/auto-semi-nuevo.component';
import { SelectBrandModelComponent } from './components/shared/select-brand-model/select-brand-model.component';
import { NgsRevealModule } from 'ngx-scrollreveal';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OnlyNumbersDirective } from './core/directives/only-numbers.directive';
import { ValidationComponent } from './components/validation/validation.component';
import { BalanceComponent } from './components/dashboard/balance/balance.component';
import { RequestPaymentComponent } from './components/dashboard/balance/request/request.component';
import { CarValidationComponent } from './components/dashboard/admin/car-validation/car-validation.component';
import { UserValidationComponent } from './components/dashboard/admin/user-validation/user-validation.component';
import { CarComplaintComponent } from './components/dashboard/admin/car-complaint/car-complaint.component';
import { CarSaleRegistrationComponent } from './components/dashboard/admin/car-sale-registration/car-sale-registration.component';
import { WithdrawalRequestsComponent } from './components/dashboard/admin/withdrawal-requests/withdrawal-requests.component';
import { UploadComponent } from './components/dashboard/car-registration/upload/upload.component';
import { ValidatedGuard } from './core/guards/validated.guard';
import { AdminCarsComponent } from './components/dashboard/admin/shared/admin-cars/admin-cars.component';
import { ReportersComponent } from './components/dashboard/admin/car-complaint/reporters/reporters.component';
import { CarSponsorComponent } from './components/dashboard/admin/car-sponsor/car-sponsor.component';
import { InterestedCarsComponent } from './components/dashboard/interested-cars/interested-cars.component';
import { VentaDetailsComponent } from './components/dashboard/admin/car-sale-registration/venta-details/venta-details.component';
import { RemaxCarsComponent } from './components/dashboard/shared/remax-cars/remax-cars.component';
import { CarEditingComponent } from './components/dashboard/car-editing/car-editing.component';
import { CarCuComponent } from './components/dashboard/shared/car-cu/car-cu.component';
import { ParticularCarsComponent } from './components/dashboard/shared/particular-cars/particular-cars.component';
import { CarPublishedComponent } from './components/dashboard/car-published/car-published.component';
import { UploadService } from './core/services/upload.service';
import { NormalizePipe } from './core/pipes/normalize.pipe';
import { CuentaComponent } from './components/dashboard/cuenta/cuenta.component';
import { AutoNuevoComponent } from './components/details/auto-nuevo/auto-nuevo.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ReportIncidenceComponent } from './components/dashboard/report-incidence/report-incidence.component';
import { PasswordDirective } from './core/directives/password.directive';
import { TermsComponent } from './components/shared/terms/terms.component';
import { PrivacyComponent } from './components/shared/privacy/privacy.component';
import { ChangeBannerComponent } from './components/dashboard/admin/change-banner/change-banner.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CarAllComponent } from './components/dashboard/admin/car-all/car-all.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) | null = null;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    InventoryListingsComponent,
    VehicleDetailsComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    CarRegistrationComponent,
    PublishedCarsComponent,
    RegisterComponent,
    ParticularComponent,
    RemaxComponent,
    PublishedCarComponent,
    AutoSemiNuevoComponent,
    SelectBrandModelComponent,
    OnlyNumbersDirective,
    ValidationComponent,
    BalanceComponent,
    RequestPaymentComponent,
    CarValidationComponent,
    UserValidationComponent,
    CarComplaintComponent,
    CarSaleRegistrationComponent,
    WithdrawalRequestsComponent,
    UploadComponent,
    AdminCarsComponent,
    ReportersComponent,
    CarSponsorComponent,
    InterestedCarsComponent,
    VentaDetailsComponent,
    RemaxCarsComponent,
    CarEditingComponent,
    CarCuComponent,
    ParticularCarsComponent,
    CarPublishedComponent,
    NormalizePipe,
    CuentaComponent,
    AutoNuevoComponent,
    ReportIncidenceComponent,
    PasswordDirective,
    TermsComponent,
    PrivacyComponent,
    ChangeBannerComponent,
    CarAllComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxSliderModule,
    NgxMatFileInputModule,
    NgsRevealModule,
    SlickCarouselModule,
    DragDropModule,
    NgxMaskModule.forRoot(),
    MatStepperModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    HttpClientModule,
    StorageService,
    DataService,
    ValidatedGuard,
    UploadService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
