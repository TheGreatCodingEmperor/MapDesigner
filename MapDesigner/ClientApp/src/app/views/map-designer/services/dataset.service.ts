import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(protected http:HttpClient) { }
  GetDatasetList():Observable<any>{
    return this.http.get(`${this.baseUrl()}/DataSet`);
  }
  SaveDataset(body:any):Observable<any>{
    return this.http.patch(`${this.baseUrl()}/DataSet`, body);
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