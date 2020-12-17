import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathsConfigComponent } from './paths-config.component';

describe('PathsConfigComponent', () => {
  let component: PathsConfigComponent;
  let fixture: ComponentFixture<PathsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
