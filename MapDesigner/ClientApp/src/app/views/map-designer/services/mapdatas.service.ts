import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapdatasService {

  constructor(protected http:HttpClient) { }
  GetMapDataSetsSchema(mapId:string|number):Observable<any>{
    return this.http.get(`${this.baseUrl()}/MapDatas/datasets/schema/${mapId}`);
  }
  public baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }
}
