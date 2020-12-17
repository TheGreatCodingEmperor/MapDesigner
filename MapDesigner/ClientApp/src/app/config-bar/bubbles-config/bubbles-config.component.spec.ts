import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblesConfigComponent } from './bubbles-config.component';

describe('BubblesConfigComponent', () => {
  let component: BubblesConfigComponent;
  let fixture: ComponentFixture<BubblesConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubblesConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubblesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
