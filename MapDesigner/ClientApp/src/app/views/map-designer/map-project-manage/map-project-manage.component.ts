import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjectEditorComponent } from '../components/project-editor/project-editor.component';
import { DataSet } from '../models/dataset';
import { MapProject, MapSchema } from '../models/map-schema';
import { DatasetService } from '../services/dataset.service';
import { MapSchemaService } from '../services/map-schema.service';

@Component({
  selector: 'app-map-project-manage',
  templateUrl: './map-project-manage.component.html',
  styleUrls: ['./map-project-manage.component.css']
})
export class MapProjectManageComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Name', 'actions'];
  realColumns: string[] = ['Id', 'Name'];
  dataSource = [];
  datasetList:DataSet[] = [];

  constructor(
    private mapShcemaService: MapSchemaService,
    private dataSetService:DatasetService,
    private _snackBar:MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getList();
    this.getDataSetList();
  }

  getList() {
    this.mapShcemaService.GetProjectList().subscribe(res => {
      this.dataSource = res;
    })
  }
  getDataSetList(){
    this.dataSetService.GetDatasetList().subscribe(res=>{
      this.datasetList = res;
    })
  }

  gotoDesigner(id: string | number) {
    console.log(id)
    this.router.navigate(['/map/designer'], { queryParams: { Id: id } });
  }

  editProject(project?: MapProject) {
    const dialogRef = this.dialog.open(ProjectEditorComponent, {
      width: '50vw',
      data: {project:project ? project : new MapProject, datalist:this.datasetList}
    });

    dialogRef.afterClosed().subscribe((result:MapProject) => {
      console.log('The dialog was closed');
      console.log(result);
      if(!result)return;
      this.mapShcemaService.SaveProject(result).subscribe(res=>{
        this.getList();
        this.openSnackBar("Save Successed!");
      },error=>{
        this.openSnackBar("Save Failed!");
      });
    });
  }

  removeProject(Id:number|string){
    console.log(Id);
    this.mapShcemaService.DeleteProject(Id).subscribe(
      res=>{
        this.openSnackBar("Delete Successed!");
        this.getList();
      },error=>{
        this.openSnackBar("Delete Failed!");
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}

