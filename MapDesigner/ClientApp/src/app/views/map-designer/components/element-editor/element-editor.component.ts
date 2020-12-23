import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BubbleTemplate } from 'src/app/helpers/d3-build-helper';

@Component({
  selector: 'app-element-editor',
  templateUrl: './element-editor.component.html',
  styleUrls: ['./element-editor.component.css']
})
export class ElementEditorComponent implements OnInit {
  isCoor = true;

  constructor(public dialogRef: MatDialogRef<ElementEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element:BubbleTemplate,dataSets:{label:string,value:number|string}}) { console.log(data) }

  ngOnInit() {
  }

  close(){
    if(!this.isCoor){
      this.data.element.attrs.cx = "map.path.centroid(d)[0]";
      this.data.element.attrs.cy = "map.path.centroid(d)[1]";
    }
    this.dialogRef.close(this.data.element);
  }

}
