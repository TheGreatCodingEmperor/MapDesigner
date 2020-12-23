import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataEditorComponent } from '../components/data-editor/data-editor.component';
import { DatasetEditorComponent } from '../components/dataset-editor/dataset-editor.component';
import { TopojsonEditorComponent } from '../components/topojson-editor/topojson-editor.component';
import { DataSet } from '../models/dataset';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-dataset-manage',
  templateUrl: './dataset-manage.component.html',
  styleUrls: ['./dataset-manage.component.css']
})
export class DatasetManageComponent implements OnInit {
  displayedColumns: string[] = ['DataSetId','DataType','Name','Schema','Remove']
  dataColumns = ['DataSetId','DataType','Name','Schema'];
  dataSource = [];

  constructor(
    private datasetService: DatasetService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar
  ) { }

  ngOnInit() {
    this.getlist();
  }

  getlist(){
    this.datasetService.GetDatasetList().subscribe(res=>{
      this.dataSource = res;
    })
  }

  openDialog(dataSet: DataSet): void {
    const dialogRef = this.dialog.open(DataEditorComponent, {
      width: '50vw',
      data: { schema: dataSet.Schema.split(','), data: JSON.parse(dataSet.Data) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.table = result;
    });
  }

  showContent(dataSet: DataSet){
    console.log(dataSet)
    // const dialogRef = this.dialog.open(TopojsonEditorComponent, {
    //   width: '50vw',
    //   data: dataSet
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   // this.table = result;
    // });
  }

  editDataSet(){
    const dialogRef = this.dialog.open(DatasetEditorComponent, {
      width: '50vw',
      data: new DataSet
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(!result)return;
      console.log(result);
      this.datasetService.SaveDataset(result).subscribe(res=>{
        this.openSnackBar("Save Success!");
        this.getlist();
      },error=>{
        this.openSnackBar("Save Failed!");
      });
    });
  }

  removeDataset(Id:number|string){
    this.datasetService.DeleteDataset(Id).subscribe(
      res=>{
        this.openSnackBar("Delete Successed!");
        this.getlist();
      },
      error=>{
        this.openSnackBar("Delete Failed!");
        this.getlist();
      }
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
