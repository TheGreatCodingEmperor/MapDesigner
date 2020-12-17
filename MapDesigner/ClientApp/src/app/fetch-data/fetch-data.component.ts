import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  mapSchema = [
    {
      type: "",
      name: "",
      dataSet: null,
      attrs: {},
      parent: null,
      select: null,
      selectAll: null,
      append: null,
      code: null
    }
  ]
  map = { svg: null, rect: null, bar: null, tooltip: null, projection: null, scaleBarZoom: null }
  build(parent: any, schema: object) {
    
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
