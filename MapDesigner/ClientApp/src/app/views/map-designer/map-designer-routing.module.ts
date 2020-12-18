import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapDesignerComponent } from './map-designer/map-designer.component';


const routes: Routes = [
  {
    path:"map",component:MapDesignerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapDesignerRoutingModule { }
