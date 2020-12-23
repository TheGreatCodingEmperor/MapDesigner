import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";
import * as t from "topojson";
import * as d3GeoBar from "d3-geo-scale-bar";
import { BubbleTemplate, D3BuildHelper } from 'src/app/helpers/d3-build-helper';
import { MatDialog } from '@angular/material/dialog';
import { DataEditorComponent } from '../components/data-editor/data-editor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MapSchemaService } from '../services/map-schema.service';
import { MapSchema } from '../models/map-schema';
import { ElementEditorComponent } from '../components/element-editor/element-editor.component';


@Component({
  selector: 'app-map-designer',
  templateUrl: './map-designer.component.html',
  styleUrls: ['./map-designer.component.css']
})
export class MapDesignerComponent implements OnInit {
  private mapBuilder = new D3BuildHelper;
  map = {};
  k = 3;
  width = document.querySelector(".container").clientWidth;
  height = window.innerHeight * 0.7;
  mapSchema = [];
  mapSchemaInfo = new MapSchema;
  dataSets = [];
  zoom: any = null;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private mapSchemaService: MapSchemaService,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit() {
    let width = document.querySelector(".container").clientWidth;
    this.width = width < 700 ? width : 700;
    let height = window.innerHeight;
    this.height = height * 0.7 < 600 ? 600 : height * 0.7;
    var path = this.mapSchema.find(x => x.type == "path");
    // this.http.get(`${this.baseUrl()}/MapSchema/MapDesigner/1`).subscribe((res: any) => {
    let id = Number(this.route.snapshot.queryParamMap.get("Id"));
    this.mapSchemaService.GetMapDesignerInfo(id).subscribe((res: any) => {
      this.mapSchemaInfo = res.MapSchema;
      try {
        this.mapSchema = JSON.parse(res.MapSchema.Schema);
      }
      catch {
        alert("map schema error!");
      }

      this.dataSets = res.DataSets.map(x => {
        let data: any[] = [];
        try {
          data = JSON.parse(x.Data);
        }
        catch {
          alert(`data ${x.Name} error!`);
        }
        return {
          DataSetId: x.DataSetId,
          DataType: x.DataType,
          Name: x.Name,
          name: x.Name,
          schema: x.Schema ? x.Schema.split(',') : null,
          data: data
        }
      });
      this.mapBuilder.map = this.map;
      this.mapBuilder.dataSets = this.dataSets;
      this.rebuildMap();
    });
  }

  rebuildMap() {
    if (d3.select("#svgmap")) {
      this.k = 3;
      d3.select("#svgmap").remove();
    }
    this.buildTooltip();

    this.buildZoom();

    this.buildClicked();

    this.buildProjection();

    this.buildSvg();

    this.buildRect();

    this.buildPathGruop();

    this.buildPathElement();

    this.buildZoomBtn();

    let advanceActions = this.mapSchema.filter(x => x.type == 'code');
    for (let code of advanceActions) {
      this.mapBuilder.advanceAction(code.attrs.code);
    }

    let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
    for (let bubble of bubbles) {
      let data = [];
      try {
        data = this.dataSets.find(x => x.DataSetId == bubble.DataSetId).data;
      } catch {
        alert(`not found DataSetId#{DataSetId}`)
      }
      this.addBubbles(bubble.name, null, "myCircles", data, "circle", bubble);
    }

    this.buildScaleBar();
  }

  addBubbles(name: string, parent: string, selectAll: string, data: any[], elementType: string, config: any) {
    this.mapBuilder.dataSetBuildElements(name, parent, selectAll, data, elementType, config);
  }

  addCode() {
    console.log({ name: "code", type: "code", attrs: { code: "" }, advance: {} })
    this.mapSchema.push({ name: "code", type: "code", attrs: { code: "" }, advance: {} });
  }

  buildProjection() {
    let config = this.mapSchema.find(x => x.name == 'projection');
    this.map["projection"] = d3
      .geoMercator()
      .center([config.attrs.centerLong, config.attrs.centerLat]) // 函式是用於設定地圖的中心位置，[107,31] 指的是經度和緯度。
      .scale(config.attrs.scale) //函式用於設定放大的比例。
      .translate([config.attrs.translateX, config.attrs.translateY]); //函式用於設定平移。;
  }

  buildSvg() {
    let config = this.mapSchema.find(x => x.name == 'svg');
    this.map["svg"] = d3
      .select("#map")
      .append("svg")
      .attr("id", "svgmap")
      .style("width", this.width)
      .style("height", this.height)
      // .attr("width", this.width)
      // .attr("height", this.height)
      .style("fill", config.attrs.fill)
      .style("position", "relative").call(this.zoom);
  }

  buildRect() {
    let config = this.mapSchema.find(x => x.name == 'rect');
    this.map["rect"] = this.map["svg"]
      .append("rect")
      .style("width", this.width)
      .style("height", this.height)
      .on("click", () => {
        eval(config.attrs.click)
      });;
    let attrs = Object.keys(config.attrs);
    for (let attr of attrs) {
      this.map["rect"].attr(attr, () => {
        if (config.advance.fill)
          return eval(config.attrs[attr]);
        else {
          return config.attrs[attr];
        }
      })
    }
  }

  buildPathElement() {
    let config = this.mapSchema.find(x => x.type == 'path');
    // 投影後座標轉路徑
    this.map["path"] = d3.geoPath().projection(this.map["projection"]);
    let data = this.dataSets.find(x => x.name == "villages").data;
    this.mapBuilder.buildPath(config.code, data, config.tag, config);
  }

  buildPathGruop() {
    this.map["pathGroup"] = this.map["svg"].append("g");
    this.map["pathGroup"].attr("class", "map");
  }

  buildScaleBar() {
    let config = this.mapSchema.find(x => x.name == 'scaleBarZoom');
    this.map['scaleBarZoom'] = d3GeoBar
      .geoScaleBar()
      .projection(this.map["projection"])
      .size([this.width, this.height])
      .left(config.attrs.left)
      .top(config.attrs.top)
      .units(d3GeoBar.geoScaleKilometers)
    .tickFormat(d => d3.format(",")(Math.round(d)));

    this.map["bar"] = this.map["svg"]
      .append("g")
      .attr("class", "scale-bar-wrapper")
      .call(this.map['scaleBarZoom']);
  }

  buildClicked() {
    let pathColor = this.mapSchema.find(x => x.type == "path").fill;
    this.map['clicked'] = (d) => {
      console.log(d);
      let x, y;

      if (d && this.map["centered"] !== d) {
        if (this.k < 3) this.k = 3;
        if (d.long && d.lat) {
          x = this.map["projection"]([d.long, d.lat])[0];
          y = this.map["projection"]([d.long, d.lat])[1];
        }
        else {
          // console.log(this.map["path"].centroid(d))
          //中心點相同或空白處(無geo item)
          var centroid = this.map["path"].centroid(d);
          x = centroid[0]; //緯度轉x
          y = centroid[1]; //經度轉y   
        }
        //中心點(geo item)
        this.map["centered"] = d;
      } else {
        x = this.width / 2;
        y = this.height / 2;
        this.k = 1;
        this.map["centered"] = null;
      }

      this.map['scaleBarZoom'].zoomFactor(this.k); //比例尺設定改變(刻度)
      this.map["bar"].call(this.map['scaleBarZoom']); //rebuild 比例尺
      this.map['svg'].selectAll('.path').style('fill', pathColor);

      this.map['pathGroup']
        .transition()
        .duration(750) //動畫時間
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + this.k +
          ")translate(" + -x + "," + -y + ")" //平移到中心點，放大k倍，平移到-x,-y
        );

      let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
      for (let bubble of bubbles) {
        this.map[bubble.name]
          .transition()
          .duration(750)
          .attr("transform",
            "translate(" + this.width / 2 + "," + this.height / 2 +
            ")scale(" + this.k + ")translate(" + -x + "," + -y + ")"
          )
          .style("stroke-width", bubble.attrs.strokeWidth + "px");
      }
    };
  }

  buildTooltip() {
    this.map["tooltip"] = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  }

  removeElement(text) {
    console.log(text);
    if (this.map[text]) {
      this.map[text].remove();
      this.mapSchema.splice(this.mapSchema.findIndex(x => x.name == text), 1);
    }
    else {
      alert("not found element");
    }
  }

  attrKeys(schema: any) {
    return Object.keys(schema.attrs);
  }

  saveSchema() {
    let body = {};
    this.mapSchemaInfo.Schema = JSON.stringify(this.mapSchema)
    body["MapSchema"] = this.mapSchemaInfo;
    body["DataSets"] = [];
    // this.http.patch(`${this.baseUrl()}/MapSchema`, { Id: 1, Name: 'Demo', Schema: JSON.stringify(this.mapSchema) }, {}).subscribe(res => {
    //   console.log(res)
    // });
    let dataSets = this.dataSets.filter(x => x.DataType != 1);
    console.log(dataSets)
    for (let data of dataSets) {
      let save: any = {};
      save.DataSetId = data.DataSetId;
      save.DataType = data.DataType;
      save.Name = data.name;
      save.Schema = data.schema.join(',');
      save.Data = JSON.stringify(data.data);
      body["DataSets"].push(save);
      // this.http.patch(`${this.baseUrl()}/DataSet`, save).subscribe(res => { }, error => { });
    }
    // this.http.patch(`${this.baseUrl()}/MapSchema/MapDesigner`, body).subscribe(res => { this.openSnackBar("Save Successed!") }, error => {
    //   this.openSnackBar("Save Failed");
    // });
    this.mapSchemaService.SaveMapDesignerInfo(body).subscribe(res => { this.openSnackBar("Save Successed!") }, error => {
      this.openSnackBar("Save Failed");
    });
  }

  centerScale() {
    let d = this.map["centered"];
    let x, y;

    if (d) {
      // console.log(this.map["path"].centroid(d))
      if (d.long && d.lat) {
        x = this.map["projection"]([d.long, d.lat])[0];
        y = this.map["projection"]([d.long, d.lat])[1];
      }
      //中心點相同或空白處(無geo item)
      else {
        var centroid = this.map["path"].centroid(d);
        x = centroid[0]; //緯度轉x
        y = centroid[1]; //經度轉y
      }
    } else {
      x = this.width / 2;
      y = this.height / 2;
    }

    this.map['scaleBarZoom'].zoomFactor(this.k); //比例尺設定改變(刻度)
    this.map["bar"].call(this.map['scaleBarZoom']); //rebuild 比例尺

    this.map['pathGroup']
      .transition()
      .duration(750) //動畫時間
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + this.k +
        ")translate(" + -x + "," + -y + ")" //平移到中心點，放大k倍，平移到-x,-y
      );
    let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
    for (let bubble of bubbles) {
      this.map[bubble.name]
        .transition()
        .duration(750)
        .attr("transform",
          "translate(" + this.width / 2 + "," + this.height / 2 +
          ")scale(" + this.k + ")translate(" + -x + "," + -y + ")"
        )
        .style("stroke-width", bubble.attrs.strokeWidth + "px").attr("r", 3);
    }
  }

  buildZoom() {
    this.zoom = d3
      .zoom()
      .on("zoom", event => {
        // event.transform.k = this.k;

        this.map['scaleBarZoom'].zoomFactor(event.transform.k); //比例尺設定改變(刻度)
        this.map["bar"].call(this.map['scaleBarZoom']); //rebuild 比例尺
        this.map["pathGroup"].attr("transform", event.transform);
        let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
        for (let bubble of bubbles) {
          this.map[bubble.name].attr("transform", event.transform);
        }
      })
      .scaleExtent([1, 40]);
  }

  buildZoomBtn() {
    d3.select("#zoom_in").on("click", () => {
      if (this.k <= 10) {
        this.k += 2;
        this.centerScale();
      }
    });
    d3.select("#zoom_out").on("click", () => {
      if (this.k >= 3) {
        this.k -= 2;
        this.centerScale();
      }
    });
    d3.select("#zoom_none").on("click", () => {
      this.map['clicked'](null);
    });
  }
  openDialog(DataSetId: string | number): void {
    let data = this.dataSets.find(x => x.DataSetId == DataSetId);
    const dialogRef = this.dialog.open(DataEditorComponent, {
      width: '50vw',
      data: { schema: data.schema, data: data.data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.table = result;
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
  openElementDialog() {
    const dialogRef = this.dialog.open(ElementEditorComponent, {
      width: '50vw',
      data: { element: new BubbleTemplate, dataSets: this.dataSets.map(x => { return { label: x.name, value: x.DataSetId } }) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (!result) return;
      console.log(result);
      this.mapSchema.push(result);
    });
  }
}

