import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapDesignerRoutingModule } from './map-designer-routing.module';
import { MapDesignerComponent } from './map-designer/map-designer.component';
import { MaterialModule } from 'src/app/module/material-module';
import { AceEditorModule } from 'ng2-ace-editor';
import { SharedModule } from 'src/app/module/shared-module';


@NgModule({
  declarations: [MapDesignerComponent],
  imports: [
    CommonModule,
    MapDesignerRoutingModule,
    SharedModule,
    AceEditorModule
  ]
})
export class MapDesignerModule { }
