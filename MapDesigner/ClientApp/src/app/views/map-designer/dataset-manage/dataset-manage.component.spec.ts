import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetManageComponent } from './dataset-manage.component';

describe('DatasetManageComponent', () => {
  let component: DatasetManageComponent;
  let fixture: ComponentFixture<DatasetManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
