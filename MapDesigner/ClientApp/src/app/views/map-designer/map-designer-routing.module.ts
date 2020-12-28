import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DatasetJoinEditorComponent } from './dataset-join-editor/dataset-join-editor.component';
import { DatasetManageComponent } from './dataset-manage/dataset-manage.component';
import { MapDesignerComponent } from './map-designer/map-designer.component';
import { MapPreviewComponent } from './map-preview/map-preview.component';
import { MapProjectManageComponent } from './map-project-manage/map-project-manage.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
  {
    path:"map" ,children:[
      { path:"designer", component:MapDesignerComponent },
      { path:"project", component:MapProjectManageComponent },
      { path:"dataset", component:DatasetManageComponent },
      { path:"test", component:TestComponent },
      { path:"view", component:MapPreviewComponent },
      { path:"join", component: DatasetJoinEditorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapDesignerRoutingModule { }
