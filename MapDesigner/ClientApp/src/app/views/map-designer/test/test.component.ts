import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements AfterViewInit {
  @ViewChild('iframe', { static: true }) iframe: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    var iframe = document.querySelector("iframe");
    var elmnt = iframe.contentWindow.document;
    console.log(iframe)
    console.log(iframe.contentDocument);
    (<HTMLElement>iframe.contentWindow.document.querySelector('app-nav-menu')).style.display = 'none';
    // myFrame.style.display = 'none';
  }

}
