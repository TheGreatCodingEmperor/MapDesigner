import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IBubbles } from '../config';

@Component({
  selector: 'bubbles-config',
  templateUrl: './bubbles-config.component.html',
  styleUrls: ['./bubbles-config.component.css']
})
export class BubblesConfigComponent implements AfterViewInit {
  @Input() bubblesConfig: IBubbles;
  constructor() { }

  ngAfterViewInit(): void {
  }

}
