import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoinLinesService {

  constructor(protected http:HttpClient) { }

  SaveJoinLineAndTables(body:any):Observable<any>{
    return this.http.patch(`${this.baseUrl()}/JoinLines/SaveJoinLineAndTables`, body);
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
