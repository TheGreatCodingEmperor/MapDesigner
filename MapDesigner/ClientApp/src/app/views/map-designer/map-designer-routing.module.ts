import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DatasetManageComponent } from './dataset-manage/dataset-manage.component';
import { MapDesignerComponent } from './map-designer/map-designer.component';
import { MapProjectManageComponent } from './map-project-manage/map-project-manage.component';


const routes: Routes = [
  {
    path:"map" ,children:[
      { path:"designer", component:MapDesignerComponent },
      { path:"project", component:MapProjectManageComponent },
      { path:"dataset", component:DatasetManageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapDesignerRoutingModule { }
