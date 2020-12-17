import { Component, Input, OnInit } from '@angular/core';
import { IRect } from '../config';

@Component({
  selector: 'rect-config',
  templateUrl: './rect-config.component.html',
  styleUrls: ['./rect-config.component.css']
})
export class RectConfigComponent implements OnInit {
  @Input()rectConfig:IRect;
  constructor() { }

  ngOnInit(): void {
  }

}
