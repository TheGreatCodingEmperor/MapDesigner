import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MapProject, MapSchema } from '../models/map-schema';

@Injectable({
  providedIn: 'root'
})
export class MapSchemaService {
  constructor(protected http:HttpClient) { }
  GetProjectList():Observable<any>{
    return this.http.get(`${this.baseUrl()}/MapSchema/MapProjects`);
  }
  SaveProject(body:MapProject):Observable<any>{
    return this.http.patch(`${this.baseUrl()}/MapSchema/MapProject`,body);
  }
  GetMapList():Observable<any>{
    return this.http.get(`${this.baseUrl()}/MapSchema`);
  }
  SaveMapSingle(body:MapSchema):Observable<any>{
    return this.http.patch(`${this.baseUrl()}/MapSchema`,body);
  }
  DeleteProject(id:number|string):Observable<any>{
    return this.http.delete(`${this.baseUrl()}/MapSchema/${id}`);
  }
  GetMapDesignerInfo(mapId:number):Observable<any>{
    return this.http.get(`${this.baseUrl()}/MapSchema/MapDesigner/${mapId}`);
  }
  SaveMapDesignerInfo(body:any):Observable<any>{
    return this.http.patch(`${this.baseUrl()}/MapSchema/MapDesigner`, body);
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
