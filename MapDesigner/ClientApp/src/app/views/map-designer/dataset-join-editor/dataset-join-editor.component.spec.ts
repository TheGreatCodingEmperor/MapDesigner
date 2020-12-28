import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetJoinEditorComponent } from './dataset-join-editor.component';

describe('DatasetJoinEditorComponent', () => {
  let component: DatasetJoinEditorComponent;
  let fixture: ComponentFixture<DatasetJoinEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetJoinEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetJoinEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
