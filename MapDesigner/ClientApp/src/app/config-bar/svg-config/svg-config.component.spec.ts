import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgConfigComponent } from './svg-config.component';

describe('SvgConfigComponent', () => {
  let component: SvgConfigComponent;
  let fixture: ComponentFixture<SvgConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
