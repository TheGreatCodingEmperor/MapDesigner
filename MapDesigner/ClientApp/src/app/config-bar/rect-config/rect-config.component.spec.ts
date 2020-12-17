import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectConfigComponent } from './rect-config.component';

describe('RectConfigComponent', () => {
  let component: RectConfigComponent;
  let fixture: ComponentFixture<RectConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
