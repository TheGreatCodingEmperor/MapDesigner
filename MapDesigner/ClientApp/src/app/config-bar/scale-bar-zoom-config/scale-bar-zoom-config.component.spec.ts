import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleBarZoomConfigComponent } from './scale-bar-zoom-config.component';

describe('ScaleBarZoomConfigComponent', () => {
  let component: ScaleBarZoomConfigComponent;
  let fixture: ComponentFixture<ScaleBarZoomConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleBarZoomConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleBarZoomConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
