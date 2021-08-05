import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoSemiNuevo } from '../interfaces/auto-semi-nuevo';
import { Lead } from '../interfaces/lead';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getSponsoredCars(): Observable<any> {
    return this.http.get(this.commonService.sponsoredCarsUrl);
  }
  public getRecentCars(): Observable<any> {
    return this.http.get(this.commonService.getRecentCarsUrl);
  }
  public getBrandCount(): Observable<any> {
    return this.http.get(this.commonService.brandCountUrl);
  }
  public getAvailableVehiclesCount(): Observable<any> {
    return this.http.get(this.commonService.availableVehiclesCountUrl);
  }
  public getSoldVehiclesCount(): Observable<any> {
    return this.http.get(this.commonService.soldVehiclesCountUrl);
  }
  public getUserCount(): Observable<any> {
    return this.http.get(this.commonService.userCountUrl);
  }
  public getFilters(): Observable<any> {
    return this.http.get(this.commonService.filtersUrl);
  }
  public postFormInterested(body: any): Observable<any> {
    return this.http.post(this.commonService.postFormInterestedUrl, body);
  }
  public getUbigeos(): Observable<any> {
    return this.http.get(this.commonService.ubigeosUrl);
  }
  public postPilot(body: HttpParams): Observable<any> {
    return this.http.post(this.commonService.leadPilotUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text',
    });
  }
  public getAllCars(): Observable<any> {
    return this.http.get(this.commonService.getAllCarsUrl);
  }
  public getDNIDetails(body: any): Observable<any> {
    return this.http.post(this.commonService.getDNIDetailsUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  public resendEmail(id: number): Observable<any> {
    return this.http.get(this.commonService.revalidateEmailUrl + `/${id}`);
  }
  public addToNewsletter(body: any): Observable<any> {
    return this.http.post(this.commonService.newsletterUrl, body);
  }
}
