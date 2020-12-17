import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { D3BuildHelper } from '../helpers/d3-build-helper';
import * as d3 from "d3";
import * as t from "topojson";
import * as d3GeoBar from "d3-geo-scale-bar";

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent implements OnInit {
  schools = [
    {
      level: 2,
      long: 120.28457,
      lat: 22.73341,
      name: "國立高雄大學"
    },
    {
      level: 2,
      long: 120.32067,
      lat: 22.62581,
      name: "高雄師範大學"
    },
    {
      level: 2,
      long: 120.27246,
      lat: 22.61298,
      name: "海洋科大"
    }
  ]

  //醫院位置、資訊
  markers = [
    {
      level: 2,
      long: 120.29715,
      lat: 22.62767,
      name: "高雄市立大同醫院",
      url: "https://www.google.com/search?q=高雄市立大同醫院"
    },
    {
      level: 2,
      long: 120.34103,
      lat: 22.62602,
      name: "國軍高雄總醫院附設民眾診療服務處附設社區復健中心",
      url:
        "https://www.google.com/search?q=國軍高雄總醫院附設民眾診療服務處附設社區復健中心"
    },
    {
      level: 1,
      long: 120.3236,
      lat: 22.62681,
      name: "高雄市立民生醫院",
      url: "https://www.google.com/search?q=高雄市立民生醫院"
    },
    {
      level: 2,
      long: 120.29796,
      lat: 22.61589,
      name: "阮綜合醫療社團法人阮綜合醫院",
      url: "https://www.google.com/search?q=阮綜合醫療社團法人阮綜合醫院"
    },
    {
      level: 1,
      long: 120.32401,
      lat: 22.63353,
      name: "天主教聖功醫療財團法人聖功醫院",
      url: "https://www.google.com/search?q=天主教聖功醫療財團法人聖功醫院"
    },

    {
      level: 1,
      long: 120.29732,
      lat: 22.61483,
      name: "邱外科醫院",
      url: "https://www.google.com/search?q=邱外科醫院/"
    },
    {
      level: 2,
      long: 120.29111,
      lat: 22.65536,
      name: "高雄市立聯合醫院",
      url: "https://www.google.com/search?q=高雄市立聯合醫院"
    },
    {
      level: 1,
      long: 120.28503,
      lat: 22.59038,
      name: "高雄市立旗津醫院",
      url: "https://www.google.com/search?q=高雄市立旗津醫院"
    },
    {
      level: 3,
      long: 120.30964,
      lat: 22.64617,
      name: "財團法人私立高雄醫學大學附設中和紀念醫院",
      url:
        "https://www.google.com/search?q=財團法人私立高雄醫學大學附設中和紀念醫院"
    },
    {
      level: 1,
      long: 120.32898,
      lat: 22.7238,
      name: "健仁醫院",
      url: "https://www.google.com/search?q=健仁醫院"
    },

    {
      level: 2,
      long: 120.36336,
      lat: 22.56758,
      name: "高雄市立小港醫院",
      url: "https://www.google.com/search?q=高雄市立小港醫院"
    },
    {
      level: 2,
      long: 120.29111,
      lat: 22.7022,
      name: "國軍高雄總醫院左營分院",
      url: "https://www.google.com/search?q=國軍高雄總醫院左營分院"
    },
    {
      level: 3,
      long: 120.323,
      lat: 22.67755,
      name: "高雄榮民總醫院",
      url: "https://www.google.com/search?q=高雄榮民總醫院"
    },
    {
      level: 1,
      long: 120.28566,
      lat: 22.78965,
      name: "國軍高雄總醫院岡山分院附設民眾診療服務處",
      url:
        "https://www.google.com/search?q=國軍高雄總醫院岡山分院附設民眾診療服務處"
    },
    {
      level: 1,
      long: 120.29453,
      lat: 22.79699,
      name: "高雄市立岡山醫院",
      url: "https://www.google.com/search?q=高雄市立岡山醫院"
    },

    {
      level: 3,
      long: 120.36444,
      lat: 22.76609,
      name: "義大醫療財團法人義大醫院",
      url: "https://www.google.com/search?q=義大醫療財團法人義大醫院"
    },
    {
      level: 1,
      long: 120.36544,
      lat: 22.76626,
      name: "義大醫療財團法人義大癌治療醫院",
      url: "https://www.google.com/search?q=義大醫療財團法人義大癌治療醫院"
    },
    {
      level: 1,
      long: 120.36304,
      lat: 22.62869,
      name: "高雄市立鳳山醫院",
      url: "https://www.google.com/search?q=高雄市立鳳山醫院"
    },
    {
      level: 1,
      long: 120.36192,
      lat: 22.62552,
      name: "大東醫院",
      url: "https://www.google.com/search?q=大東醫院"
    },
    {
      level: 1,
      long: 120.33567,
      lat: 22.59779,
      name: "杏和醫院",
      url: "https://www.google.com/search?q=杏和醫院"
    },

    {
      level: 1,
      long: 120.38488,
      lat: 22.61787,
      name: "瑞生醫院",
      url: "https://www.google.com/search?q=瑞生醫院"
    },
    {
      level: 1,
      long: 120.3867,
      lat: 22.50382,
      name: "建佑醫院",
      url: "https://www.google.com/search?q=建佑醫院"
    },
    {
      level: 3,
      long: 120.3528,
      lat: 22.64949,
      name: "長庚醫療財團法人高雄長庚紀念醫院",
      url: "https://www.google.com/search?q=長庚醫療財團法人高雄長庚紀念醫院"
    },
    {
      level: 2,
      long: 120.48333,
      lat: 22.88067,
      name: "衛生福利部旗山醫院",
      url: "https://www.google.com/search?q=衛生福利部旗山醫院"
    }
  ];
  private mapBuilder = new D3BuildHelper;
  map = {};
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
      advance:{}
    },
    {
      name: 'svg',
      attrs: {
        fill: "'grey'",
      },
      advance:{}
    },
    {
      name: "rect",
      attrs: {
        fill: "'#0066cc'",
        stroke: "'black'",

        click:`this.map['clicked'](null);this.map.svg.selectAll('.path').style('fill','rgb(221, 140, 129)');`
      },
      advance:{}
    },
    {
      type: 'path',
      name: 'path',
      code: `data.objects.towns.geometries = data.objects.towns.geometries.filter(
        x => x.properties.COUNTYNAME == "高雄市"
      ); data;`,
      data: null,
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
        this.map.svg.select('#path' + d.properties.TOWNID).style('fill',"#ac2b2b")`
      },
      advance:{}
    },
    {
      name: 'scaleBarZoom',
      attrs: {
        left: 0.85,
        top: 0.05,
      },
      advance:{}
    },
    {
      type: 'bubble',
      name: 'markers',
      data: this.markers,
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
      advance:{}
    },
    {
      type: 'bubble',
      name: 'school',
      data: this.schools,
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
      advance:{}
    }
  ];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    var path = this.mapSchema.find(x => x.type == "path");
    this.mapBuilder.map = this.map;
    this.mapBuilder.width = this.width;
    this.mapBuilder.height = this.height;
    this.http.get("assets/villages-10t.json").subscribe((data: any) => {
      console.log(data);
      path.data = data;
      this.rebuildMap();
    })

  }

  addBubbles(name: string, parent: string, selectAll: string, data: any[], elementType: string, attrs: any) {
    this.mapBuilder.dataSetBuildElements(name, parent, selectAll, data, elementType, attrs);
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
      .attr("width", this.width)
      .attr("height", this.height)
      .style("fill", config.attrs.fill)
      .style("position", "relative");
  }

  buildRect() {
    let config = this.mapSchema.find(x => x.name == 'rect');
    this.map["rect"] = this.map["svg"]
      .append("rect")
      // .attr("x", "-10")
      // .attr("y", "-10")
      .attr("width", this.width)
      .attr("height", this.height)
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
    this.mapBuilder.buildPath(config.code, config.data, config.tag, config.attrs);
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
      let x, y, k;

      if (d && this.map["centered"] !== d) {
        console.log(this.map["path"].centroid(d))
        //中心點相同或空白處(無geo item)
        var centroid = this.map["path"].centroid(d);
        x = centroid[0]; //緯度轉x
        y = centroid[1]; //經度轉y
        k = 3; //放大3倍
        this.map["centered"] = d; //中心點(geo item)
      } else {
        x = this.width / 2;
        y = this.height / 2;
        k = 1;
        this.map["centered"] = null;
      }

      this.map['scaleBarZoom'].zoomFactor(k); //比例尺設定改變(刻度)
      this.map["bar"].call(this.map['scaleBarZoom']); //rebuild 比例尺

      console.log(x);
      console.log(y)
      this.map['pathGroup']
        .transition()
        .duration(750) //動畫時間
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k +
          ")translate(" + -x + "," + -y + ")" //平移到中心點，放大k倍，平移到-x,-y
        );

      let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
      for (let bubble of bubbles) {
        this.map[bubble.name]
          .transition()
          .duration(750)
          .attr("transform",
            "translate(" + this.width / 2 + "," + this.height / 2 +
            ")scale(" + k + ")translate(" + -x + "," + -y + ")"
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

    let bubbles = this.mapSchema.filter(x => x.type == 'bubble');
    for (let bubble of bubbles) {
      this.addBubbles(bubble.name, null, "myCircles", bubble.data, "circle", bubble.attrs);
    }
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
}

