import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { D3BuildHelper } from '../helpers/d3-build-helper';
import * as d3 from "d3";
import * as t from "topojson";
import * as d3GeoBar from "d3-geo-scale-bar";

export interface IMap {
  /** @summary 增加圓點 */
  addBubbles: (name: string, parent: string, selectAll: string, data: any[], elementType: string, attrs: any) => {};
  /** @summary 投影點(座標+平移) */
  buildProjection: () => {};
  /** @summary SVG Element */
  buildSvg: () => {};
  /** @summary SVG 背景(除陸地外) */
  buildRect: () => {};
  /** @summary 陸地個區塊+外部邊線 */
  buildPathElement: () => {};
  /** @summary 陸地個區塊容器*/
  buildPathGruop: () => {};
  /** @summary 比例尺 */
  buildScaleBar: () => {};
  /** @summary 點擊觸發 */
  buildClicked: () => {};
  /** @summary pop up 文字 */
  buildTooltip: () => {};
  /** @summary 建立map */
  rebuildMap: () => {};
}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent implements OnInit {
  dataSets = [];

  private mapBuilder = new D3BuildHelper;
  map = {};
  k = 3;
  width = 900;
  height = 700;
  dataSet = null;
  pathCondition = "data";
  mapSchema = [
    {
      name: 'projection',
      attrs: {
        centerLong: 120.31041,
        centerLat: 22.64889,
        scale: 30000,
        translateX: 200,
        translateY: 500,
      },
      advance: {}
    },
    {
      name: 'svg',
      attrs: {
        fill: "'grey'",
      },
      advance: {}
    },
    {
      name: "rect",
      attrs: {
        fill: "'#0066cc'",
        stroke: "'black'",

        click: `this.map['clicked'](null);this.map.svg.selectAll('.path').style('fill','rgb(221, 140, 129)');`
      },
      advance: {}
    },
    {
      type: 'path',
      name: 'path',
      code: `data.objects.towns.geometries = data.objects.towns.geometries.filter(
        x => x.properties.COUNTYNAME == "高雄市"
      ); data;`,
      data: 'villages',
      tag: 'towns',
      attrs: {
        id: "'path' + d.properties.TOWNID",
        class: "'path'",
        fill: "'rgb(221, 140, 129)'",
        stroke: "'white'",
        strokeWidth: "0.5",

        mouseover: `this.map["tooltip"].style("opacity", 1);this.map.svg.select('#path' + d.properties.TOWNID).style('fill','yellow')`,
        mousemove: ` this.map["tooltip"]
        .html( d.properties.COUNTYNAME + d.properties.TOWNNAME)
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + "px");`,
        mouseleave: `
        this.map["tooltip"].style("opacity", 0);
        let color = 'rgb(221, 140, 129)';
        if(this.map.centered == d)color = "#ac2b2b";
        this.map.svg.select('#path' + d.properties.TOWNID).style('fill',color)`,
        click: `
        this.map['clicked'](d);
        this.map.svg.selectAll('.path').style('fill','rgb(221, 140, 129)');
        this.map.svg.select('#path' + this.map.centered.properties.TOWNID).style('fill',"#ac2b2b")`
      },
      advance: {}
    },
    {
      name: 'scaleBarZoom',
      attrs: {
        left: 0.85,
        top: 0.05,
      },
      advance: {}
    },
    {
      type: 'bubble',
      name: 'markers',
      data: 'schools',
      attrs: {
        cx: `this.map["projection"]([d.long, d.lat])[0]; //座標轉 xy 軸 x`,
        cy: `this.map["projection"]([d.long, d.lat])[1]; //座標轉 xy 軸 y`,
        r: `5`,
        stroke: `'#69b3a2'`,
        strokeWidth: `1`,
        fillOpacity: `1`,
        fill: `'red'`,

        mouseover: `this.map["tooltip"].style("opacity", 1);`,
        mousemove: ` this.map["tooltip"]
        .html(d.name)
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + "px");`,
        mouseleave: `this.map["tooltip"].style("opacity", 0);`,
        click: ``
      },
      advance: {}
    },
    {
      type: 'bubble',
      name: 'school',
      data: 'hospitals',
      attrs: {
        cx: `this.map["projection"]([d.long, d.lat])[0]; //座標轉 xy 軸 x`,
        cy: `this.map["projection"]([d.long, d.lat])[1]; //座標轉 xy 軸 y`,
        r: `5`,
        stroke: `'#69b3a2'`,
        strokeWidth: `1`,
        fillOpacity: `1`,
        fill: `'green'`,

        mouseover: `this.map["tooltip"].style("opacity", 1);`,
        mousemove: ` this.map["tooltip"]
        .html(d.name)
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + "px");`,
        mouseleave: `this.map["tooltip"].style("opacity", 0);`,
        click: ``
      },
      advance: {}
    }
  ];

  constructor(
    private http: HttpClient,
  ) {

  }

  ngOnInit() {
    var path = this.mapSchema.find(x => x.type == "path");
    this.mapBuilder.map = this.map;
    this.mapBuilder.dataSets = this.dataSets;
    // this.mapBuilder.width = this.width;
    // this.mapBuilder.height = this.height;
    this.http.get("https://localhost:5001/DataSet").subscribe((res:any[])=>{
      this.dataSets = res.map(x =>{ return {name:x.Name,schema:x.Schema,data:JSON.parse(x.Data)}});
      this.mapBuilder.dataSets = this.dataSets;
      path.data = "";
      this.rebuildMap();
    });
    // this.http.get("assets/villages-10t.json").subscribe((data: any) => {
    //   console.log(data);
    //   path.data = data;
    //   this.rebuildMap();
    // })

  }

  rebuildMap() {
    if (d3.select("#svgmap")) {
      d3.select("#svgmap").remove();

    }
    this.buildTooltip();

    this.buildClicked();

    this.buildProjection();

    this.buildSvg();

    this.buildRect();

    this.buildPathGruop();

    this.buildPathElement();

    this.buildScaleBar();

    this.buildZoomBtn();

    let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
    for (let bubble of bubbles) {
      this.addBubbles(bubble.name, null, "myCircles", bubble.data, "circle", bubble.attrs);
    }
  }

  addBubbles(name: string, parent: string, selectAll: string, dataTag: string, elementType: string, attrs: any) {
    this.mapBuilder.dataSetBuildElements(name, parent, selectAll, dataTag, elementType, attrs);
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
      .attr("fill", () => {
        return eval(config.attrs.fill);
      })
      .attr("stroke", () => {
        return eval(config.attrs.stroke);
      })
      .on("click", () => {
        eval(config.attrs.click)
      });
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
    this.mapBuilder.buildPath(config.code, data, config.tag, config.attrs);
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
        console.log(this.map["path"].centroid(d))
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
          .style("stroke-width", 1 + "px");
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
    this.http.patch("https://localhost:5001/WeatherForecast/SaveMap", { Id: 1, Name: 'Demo', Schema: JSON.stringify(this.mapSchema) }, {}).subscribe(res => {
      console.log(res)
    });
  }

  centerScale(k: number) {
    let d = this.map["centered"];
    let x, y;

    if (d) {
      console.log(this.map["path"].centroid(d))
      //中心點相同或空白處(無geo item)
      var centroid = this.map["path"].centroid(d);
      x = centroid[0]; //緯度轉x
      y = centroid[1]; //經度轉y
    } else {
      return;
    }

    this.map['scaleBarZoom'].zoomFactor(k); //比例尺設定改變(刻度)
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
        .style("stroke-width", 1 + "px").attr("r", 3);
    }
  }

  buildZoomBtn() {
    d3.select("#zoom_in").on("click",()=>{
      if (this.k <= 10) {
        this.k++;
        this.centerScale(this.k);
      }
    });
    d3.select("#zoom_out").on("click",()=>{
      if (this.k > 3) {
        this.k--;
        this.centerScale(this.k);
      }
    });
    d3.select("#zoom_none").on("click",()=>{
      this.map['clicked'](null);
    });
  }
}

