import { Component, Input, OnInit } from '@angular/core';
import { ISvg } from '../config';

@Component({
  selector: 'svg-config',
  templateUrl: './svg-config.component.html',
  styleUrls: ['./svg-config.component.css']
})
export class SvgConfigComponent implements OnInit {
  @Input() svgConfig: ISvg;
  constructor() { }

  ngOnInit(): void {
  }

}
