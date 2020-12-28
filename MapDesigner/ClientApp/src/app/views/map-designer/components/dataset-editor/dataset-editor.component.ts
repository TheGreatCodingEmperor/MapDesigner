import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSet } from '../../models/dataset';
import * as XLSX from 'xlsx';
import * as t from "topojson";

@Component({
  selector: 'app-dataset-editor',
  templateUrl: './dataset-editor.component.html',
  styleUrls: ['./dataset-editor.component.css']
})
export class DatasetEditorComponent implements OnInit {
  dataPages = [];
  import = {};
  schema = [];

  constructor(
    public dialogRef: MatDialogRef<DatasetEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataSet) {
  }

  ngOnInit() {
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.import = jsonData;
      if (this.data.DataType == 0)
        this.dataPages = Object.keys(jsonData);
      else{
        this.import = data;
        console.log(data)
        let dataJson = JSON.parse(data as string);
        dataJson.objects.towns.geometrics = dataJson.objects.towns.geometries.filter(x=>x.properties.COUNTYNAME=="高雄市")
        console.log(JSON.stringify(t.feature(dataJson, dataJson.objects['towns']).features))
      }
      // const dataString = JSON.stringify(jsonData);
      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
    }
    reader.readAsBinaryString(file);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  handleChange(e) {
    this.schema = Object.keys(this.data.Data[0]);
  }

  get someText(){
    if(this.import)
      return JSON.stringify(this.import).slice(0, 300).concat("...");
  }

  save() {
    if (this.schema) {
      this.data.Schema = this.schema.join(',');
    }
    try{
      this.data.Data = JSON.stringify(this.data.Data);
    }
    catch{}
    this.dialogRef.close(this.data);
  }
}
