import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSet } from '../../models/dataset';
import { DataEditorComponent } from '../data-editor/data-editor.component';

@Component({
  selector: 'app-topojson-editor',
  templateUrl: './topojson-editor.component.html',
  styleUrls: ['./topojson-editor.component.css']
})
export class TopojsonEditorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TopojsonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataSet) { console.log(data) }

  ngOnInit() {
  }

}
