import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapDesignerRoutingModule } from './map-designer-routing.module';
import { MapDesignerComponent } from './map-designer/map-designer.component';
import { MaterialModule } from 'src/app/module/material-module';
import { AceEditorModule } from 'ng2-ace-editor';
import { SharedModule } from 'src/app/module/shared-module';
import { DataEditorComponent } from './components/data-editor/data-editor.component';
import { MapProjectManageComponent } from './map-project-manage/map-project-manage.component';
import { DatasetManageComponent } from './dataset-manage/dataset-manage.component';
import { TopojsonEditorComponent } from './components/topojson-editor/topojson-editor.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { DatasetEditorComponent } from './components/dataset-editor/dataset-editor.component';


@NgModule({
  declarations: [MapDesignerComponent, DataEditorComponent, MapProjectManageComponent, DatasetManageComponent, TopojsonEditorComponent, ProjectEditorComponent, DatasetEditorComponent],
  entryComponents:[
    DataEditorComponent,
    TopojsonEditorComponent,
    ProjectEditorComponent,
    DatasetEditorComponent
  ],
  imports: [
    CommonModule,
    MapDesignerRoutingModule,
    SharedModule,
    AceEditorModule
  ]
})
export class MapDesignerModule { }
