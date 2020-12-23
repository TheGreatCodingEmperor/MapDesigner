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
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

