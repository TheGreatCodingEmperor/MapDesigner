import { Component, Input, OnInit } from '@angular/core';
import { IPath } from '../config';

@Component({
  selector: 'paths-config',
  templateUrl: './paths-config.component.html',
  styleUrls: ['./paths-config.component.css']
})
export class PathsConfigComponent implements OnInit {
  @Input()pathConfig:IPath;
  constructor() { }

  ngOnInit(): void {
  }

}
