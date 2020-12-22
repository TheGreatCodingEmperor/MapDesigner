import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopojsonEditorComponent } from './topojson-editor.component';

describe('TopojsonEditorComponent', () => {
  let component: TopojsonEditorComponent;
  let fixture: ComponentFixture<TopojsonEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopojsonEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopojsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
