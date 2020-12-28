import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataSet } from '../../models/dataset';
import { MapProject, MapSchema } from '../../models/map-schema';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css']
})
export class ProjectEditorComponent implements OnInit {
  mapDatas = [];

  constructor(public dialogRef: MatDialogRef<ProjectEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {project:MapProject,datalist:DataSet[]},
    private router:Router
    ) { console.log(data) }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(this.data.project);
  }

  getoJoin(){
    this.router.navigate(["/map/join"],{queryParams:{Id:this.data.project.Map.Id}});
    this.dialogRef.close();
  }
}
