import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";
import * as t from "topojson";
import * as d3GeoBar from "d3-geo-scale-bar";
import { D3BuildHelper } from 'src/app/helpers/d3-build-helper';
import { MatDialog } from '@angular/material/dialog';
import { DataEditorComponent } from '../components/data-editor/data-editor.component';


@Component({
  selector: 'app-map-designer',
  templateUrl: './map-designer.component.html',
  styleUrls: ['./map-designer.component.css']
})
export class MapDesignerComponent implements OnInit {
  public baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }

  private mapBuilder = new D3BuildHelper;
  map = {};
  k = 3;
  width = document.querySelector(".container").clientWidth;
  height =  window.innerHeight*0.7;
  mapSchema = [];
  dataSets = [];

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    let width = document.querySelector(".container").clientWidth;
    this.width = width<700?width:700;
    let height = window.innerHeight;
    this.height = height*0.7<600?600:height*0.7;
    var path = this.mapSchema.find(x => x.type == "path");
    this.http.get(`${this.baseUrl()}/MapSchema/MapDesigner/1`).subscribe((res:any)=>{
      try{
        this.mapSchema = JSON.parse(res.MapSchema.Schema);
      }
      catch{
        alert("map schema error!");
      }
      
      this.dataSets = res.DataSets.map(x =>{ 
        let data:any[] = [];
        try{
          data = JSON.parse(x.Data);
        }
        catch{
          alert(`data ${x.Name} error!`);
        }
        return {
          DataSetId:x.DataSetId,
          DataType:x.DataType,
          Name:x.Name,
          name:x.Name,
          schema:x.Schema?x.Schema.split(','):null,
          data:data
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

    this.buildClicked();

    this.buildProjection();

    this.buildSvg();

    this.buildRect();

    this.buildPathGruop();

    this.buildPathElement();

    

    this.buildZoomBtn();

    let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
    for (let bubble of bubbles) {
      let data = [];
      try{
        data = this.dataSets.find(x=> x.DataSetId == bubble.DataSetId).data;
      }catch{
        alert(`not found DataSetId#{DataSetId}`)
      }
      this.addBubbles(bubble.name, null, "myCircles", data, "circle", bubble);
    }
    
    this.buildScaleBar();
  }

  addBubbles(name: string, parent: string, selectAll: string, data: any[], elementType: string, config: any) {
    this.mapBuilder.dataSetBuildElements(name, parent, selectAll, data, elementType, config);
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
      .style("position", "relative");
  }

  buildRect() {
    let config = this.mapSchema.find(x => x.name == 'rect');
    this.map["rect"] = this.map["svg"]
      .append("rect")
      // .attr("x", "-10")
      // .attr("y", "-10")
      // .attr("width", this.width)
      // .attr("height", this.height)
      .style("width", this.width)
      .style("height", this.height)
      .on("click", () => {
        eval(config.attrs.click)
      });;
      let attrs = Object.keys(config.attrs);
      for(let attr of attrs){
        this.map["rect"].attr(attr,()=>{
          if(config.advance.fill)
          return eval(config.attrs[attr]);
          else{
            return config.attrs[attr];
          }
        })
      }
  }

  buildPathElement() {
    let config = this.mapSchema.find(x => x.type == 'path');
    // 投影後座標轉路徑
    this.map["path"] = d3.geoPath().projection(this.map["projection"]);
    // d3.json("assets/villages-10t.json").then((data: any) => {
    //   // data.objects.towns.geometries = data.objects.towns.geometries.filter(
    //   //   x => x.properties.COUNTYNAME == "高雄市"
    //   // );

    //   // `data.objects.towns.geometries = data.objects.towns.geometries.filter(
    //   //   x => x.properties.COUNTYNAME == "屏東縣"
    //   // ); data;`
    //   this.mapBuilder.buildPath(this.pathCondition, data, null);
    // });
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
      .tickFormat(d => d3.format(",")(Math.round(d)));

    this.map["bar"] = this.map["svg"]
      .append("g")
      .attr("class", "scale-bar-wrapper")
      .call(this.map['scaleBarZoom']);
  }

  buildClicked() {
    this.map['clicked'] = (d) => {
      let x, y;

      if (d && this.map["centered"] !== d) {
        if (this.k < 3) this.k = 3;
        // console.log(this.map["path"].centroid(d))
        //中心點相同或空白處(無geo item)
        var centroid = this.map["path"].centroid(d);
        x = centroid[0]; //緯度轉x
        y = centroid[1]; //經度轉y
        // this.k = 3; //放大3倍
        this.map["centered"] = d; //中心點(geo item)
      } else {
        x = this.width / 2;
        y = this.height / 2;
        this.k = 1;
        this.map["centered"] = null;
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
          .style("stroke-width", bubble.attrs.strokeWidth + "px");
      }
    };
  }

  buildTooltip() {
    this.map["tooltip"] = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 1)
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
    this.http.patch(`${this.baseUrl()}/MapSchema`, { Id: 1, Name: 'Demo', Schema: JSON.stringify(this.mapSchema) }, {}).subscribe(res => {
      console.log(res)
    });
    let dataSets = this.dataSets.filter(x => x.DataType!=1);
    console.log(dataSets)
    for(let data of dataSets){
      let save:any = {};
      save.DataSetId = data.DataSetId;
      save.DataType = data.DataType;
      save.Name = data.name;
      save.Schema = data.schema.join(',');
      save.Data = JSON.stringify(data.data);
      this.http.patch(`${this.baseUrl()}/DataSet`,save).subscribe(res=>{},error=>{});
    }
  }

  centerScale(k: number) {
    let d = this.map["centered"];
    let x, y;

    if (d) {
      // console.log(this.map["path"].centroid(d))
      //中心點相同或空白處(無geo item)
      var centroid = this.map["path"].centroid(d);
      x = centroid[0]; //緯度轉x
      y = centroid[1]; //經度轉y
    } else {
      x = this.width/2;
      y = this.height/2;
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

  buildZoomBtn() {
    d3.select("#zoom_in").on("click",()=>{
      if (this.k <= 10) {
        this.k+=2;
        this.centerScale(this.k);
      }
    });
    d3.select("#zoom_out").on("click",()=>{
      if (this.k >= 3) {
        this.k-=2;
        this.centerScale(this.k);
      }
    });
    d3.select("#zoom_none").on("click",()=>{
      this.map['clicked'](null);
    });
  }
  openDialog(DataSetId:string|number): void {
    let data = this.dataSets.find(x => x.DataSetId == DataSetId);
    const dialogRef = this.dialog.open(DataEditorComponent, {
      width: '50vw',
      data: {schema: data.schema, data: data.data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.table = result;
    });
  }
}

