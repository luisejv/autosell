import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarAllComponent } from './components/dashboard/admin/car-all/car-all.component';
import { CarComplaintComponent } from './components/dashboard/admin/car-complaint/car-complaint.component';
import { CarSaleRegistrationComponent } from './components/dashboard/admin/car-sale-registration/car-sale-registration.component';
import { CarSponsorComponent } from './components/dashboard/admin/car-sponsor/car-sponsor.component';
import { CarValidationComponent } from './components/dashboard/admin/car-validation/car-validation.component';
import { ChangeBannerComponent } from './components/dashboard/admin/change-banner/change-banner.component';
import { UserValidationComponent } from './components/dashboard/admin/user-validation/user-validation.component';
import { WithdrawalRequestsComponent } from './components/dashboard/admin/withdrawal-requests/withdrawal-requests.component';
import { BalanceComponent } from './components/dashboard/balance/balance.component';
import { CarEditingComponent } from './components/dashboard/car-editing/car-editing.component';
import { CarPublishedComponent } from './components/dashboard/car-published/car-published.component';
import { CarRegistrationComponent } from './components/dashboard/car-registration/car-registration.component';
import { CuentaComponent } from './components/dashboard/cuenta/cuenta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InterestedCarsComponent } from './components/dashboard/interested-cars/interested-cars.component';
import { PublishedCarsComponent } from './components/dashboard/published-cars/published-cars.component';
import { ReportIncidenceComponent } from './components/dashboard/report-incidence/report-incidence.component';
import { AutoNuevoComponent } from './components/details/auto-nuevo/auto-nuevo.component';
import { AutoSemiNuevoComponent } from './components/details/auto-semi-nuevo/auto-semi-nuevo.component';
import { HomeComponent } from './components/home/home.component';
import { InventoryListingsComponent } from './components/inventory-listings/inventory-listings.component';
import { LoginComponent } from './components/login/login.component';
import { ParticularComponent } from './components/register/particular/particular.component';
import { RegisterComponent } from './components/register/register.component';
import { RemaxComponent } from './components/register/remax/remax.component';
import { PrivacyComponent } from './components/shared/privacy/privacy.component';
import { TermsComponent } from './components/shared/terms/terms.component';
import { ValidationComponent } from './components/validation/validation.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { AdminGuard } from './core/guards/admin.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { NotLoggedInGuard } from './core/guards/not-logged-in.guard';
import { ValidatedGuard } from './core/guards/validated.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'inventory-listings',
    component: InventoryListingsComponent,
  },
  { path: 'terminos-y-condiciones', component: TermsComponent },
  { path: 'politicas-de-privacidad', component: PrivacyComponent },
  { path: 'vehicle-details', component: VehicleDetailsComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'todos-los-autos',
        component: CarAllComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'cuenta',
        component: CuentaComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'registrar-auto',
        component: CarRegistrationComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'editar-auto/:id',
        component: CarEditingComponent,
        canActivate: [LoggedInGuard],
      },
      {
        path: 'autos-publicados',
        component: PublishedCarsComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'publicados-autos',
        component: CarPublishedComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'balance',
        component: BalanceComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'autos-interesantes',
        component: InterestedCarsComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'reportar-incidencia',
        component: ReportIncidenceComponent,
        canActivate: [ValidatedGuard],
      },
      {
        path: 'autos-por-validar',
        component: CarValidationComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'solicitudes-franquicia',
        component: UserValidationComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'registrar-venta',
        component: CarSaleRegistrationComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'autos-reportados',
        component: CarComplaintComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'solicitudes-de-pago',
        component: WithdrawalRequestsComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'autos-patrocinados',
        component: CarSponsorComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'cambiar-banner',
        component: ChangeBannerComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
  { path: 'auth', component: LoginComponent, canActivate: [NotLoggedInGuard] },
  {
    path: 'auto-semi-nuevo',
    component: AutoSemiNuevoComponent,
  },
  {
    path: 'auto-semi-nuevo/:id',
    component: AutoSemiNuevoComponent,
  },
  {
    path: 'auto-nuevo',
    component: AutoNuevoComponent,
  },
  {
    path: 'auto-nuevo/:id',
    component: AutoNuevoComponent,
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate: [NotLoggedInGuard],
    children: [
      {
        path: 'particular',
        component: ParticularComponent,
      },
      {
        path: 'remax',
        component: RemaxComponent,
      },
    ],
  },
  { path: 'validation/:id', component: ValidationComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
