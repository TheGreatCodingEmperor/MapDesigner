import { Component, Input, OnInit } from '@angular/core';
import { IGlobal } from '../config';

@Component({
  selector: 'global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.css']
})
export class GlobalConfigComponent implements OnInit {
  @Input()globalConfig:IGlobal;
  constructor() { }

  ngOnInit(): void {
  }

}
