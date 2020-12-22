import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProjectManageComponent } from './map-project-manage.component';

describe('MapProjectManageComponent', () => {
  let component: MapProjectManageComponent;
  let fixture: ComponentFixture<MapProjectManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProjectManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProjectManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
