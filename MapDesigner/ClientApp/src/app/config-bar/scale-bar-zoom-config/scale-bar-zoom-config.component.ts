import { Component, Input, OnInit } from '@angular/core';
import { IScaleBarZoom } from '../config';

@Component({
  selector: 'scale-bar-zoom-config',
  templateUrl: './scale-bar-zoom-config.component.html',
  styleUrls: ['./scale-bar-zoom-config.component.css']
})
export class ScaleBarZoomConfigComponent implements OnInit {
  @Input()scaleBarZoomConfig:IScaleBarZoom;
  constructor() { }

  ngOnInit(): void {
  }

}
