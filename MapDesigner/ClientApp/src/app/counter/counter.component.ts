import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';
import * as d3GeoBar from 'd3-geo-scale-bar'

import * as svgExport from 'save-svg-as-png';
import { Bubbles, Global, IBubbles, IGlobal, IPath, IRect, IScaleBarZoom, ISvg, Path, Rect, ScaleBarZoom, Svg } from '../config-bar/config';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {
  globalConfig:IGlobal = new Global;
  svgConfig:ISvg = new Svg;
  scaleBarZoomConfig:IScaleBarZoom = new ScaleBarZoom;
  rectConfig:IRect = new Rect;
  bubblesConfig:IBubbles = new Bubbles;
  pathConfig: IPath = new Path;

  hospital = { name: "", url: "" };//當前選擇 hospital circle
  townId = null;//當前選擇 行政區
  design = true;
  dblclick = false;
  index: number;

  initial:any;

  constructor() { }

  ngOnInit(): void {
      //#region <外框，中心點>
      let width = 900;
      let height = 700;
      let centered;
      //#endregion </外框，中心點>

      //醫院位置、資訊
      var markers = [
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

      /** @summary 行政區paths */ 
      var towns:any;
      /** popup text */
      var tooltip: any;
      /** 3d 投影 2d */
      var projection: any;
      /** 投影後 path element no draw */
      var path: any;
      /** 比例尺 build helper */
      var scaleBarZoom: any;
      /** svg element no draw */
      var svg: any;
      /** svg 空白處 element */
      var rect: any;
      /** 比例尺 after build */
      var bar: any;
      /** 行政區 paths element parent element */
      var townsGroup: any;
      /** 視覺化資料圈圈 */
      var bubbles: any;
      // 
      var filter: any;

      //popup tooltip 參數設定
      tooltip = d3
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

      // 初始化 svg rect path bubbles
      this.initial = () => {
          console.log("initial!!");
          // 3d 投影 2d
          projection = d3
              .geoMercator()
              .center([120.31041, 22.64889]) // 函式是用於設定地圖的中心位置，[107,31] 指的是經度和緯度。
              .scale(30000) //函式用於設定放大的比例。
              .translate([200, 500]); //函式用於設定平移。;

          // 投影後座標轉路徑
          path = d3.geoPath().projection(projection);

          //比例尺參數設定
          scaleBarZoom = d3GeoBar
              .geoScaleBar()
              .projection(projection)
              .size([width, height])
              .left(this.scaleBarZoomConfig.left)
              .top(this.scaleBarZoomConfig.top)
              .tickFormat(d => d3.format(",")(Math.round(d)));

          //svg 向量圖 build
          svg = d3
              .select("#map")
              .append("svg")
              .attr("id", "svgmap")
              .attr("width", width)
              .attr("height", height)
              .style("fill", "grey")
              .style("position", "relative");

          //svg build 空白處
          rect = svg
              .append("rect")
              // .attr("x", "-10")
              // .attr("y", "-10")
              .attr("width", width)
              .attr("height", height)
              .attr("fill", ()=>{
                  return eval(this.rectConfig.fill);
              })
              .attr("stroke",()=>{return eval(this.rectConfig.stroke)})
              .on("contextmenu",(e:Event)=>{
                  if(this.design){
                      e.preventDefault()
                      console.log("right")
                  }
              })
              .on("click", function () {
                  clicked(null);
              });

          //shadow
          filter = svg.append("defs")
              .append("filter")
              .attr("id", "drop-shadow")
              .attr("height", "110%")
              .attr("width", "110%");
          filter.append("feGaussianBlur")
              .attr("in", "offOut")
              .attr("stdDeviation", 10)
              .attr("result", "blurOut");

          filter.append("feOffset")
              .attr("in", "SourceAlpha")
              .attr("dx", 20)
              .attr("dy", 20)
              .attr("result", "offOut");
          filter.append("feBlend")
              .attr("in","SourceGraphic")
              .attr("in2","blurOut")
              .attr("mode","normal")

          // path 路徑 build element
          townsGroup = svg.append("g");
          townsGroup.attr("class", "map");

          //svg build 比例尺
          bar = svg
              .append("g")
              .attr("class", "scale-bar-wrapper")
              .call(scaleBarZoom);

          //marke 醫院 資料 轉circle 屬性設定
          bubbles = svg
              .selectAll("myCircles")
              .data(markers)
              .enter()
              .append("circle")
              .attr("class", "bubbleLabel")
              .attr("cx", function (d) {
                  return projection([d.long, d.lat])[0]; //座標轉 xy 軸 x
              })
              .attr("cy", function (d) {
                  return projection([d.long, d.lat])[1]; //座標轉 xy 軸 y
              })
              .attr("r", 5) //圓形半徑
              .style("fill", "red")//圓心顏色
              .attr("stroke", "#69b3a2") //圓形外圍邊框
              .attr("stroke-width", 3) //邊框寬度
              .attr("fill-opacity", 1) //圓心透明
              .on("contextmenu",(e:Event)=>{
                  if(this.design){
                      e.preventDefault()
                      console.log("right")
                  }
              })
              .on("mouseover", (d: any, i: any) => {
                  eval(this.bubblesConfig.mouseover);
              })
              .on("mousemove", (d, i: any) => {
                  eval(this.bubblesConfig.mousemove);
              })
              .on("mouseleave", (d, i) => {
                  tooltip.style("opacity", 0);
              });

          //匯入json 檔(走http client)
          d3.json(
              "assets/villages-10t.json"
          ).then((topology: any) => {
              //篩選 行政區
              (topology as any).objects.towns.geometries = (topology as any).objects.towns.geometries.filter(
                  x => x.properties.COUNTYNAME == "高雄市"
              );

              // Draw Town 路徑(邊界)
              towns = townsGroup
                  .selectAll("path") //step 3: select element form townsGroup
                  .data(t.feature(topology, (topology as any).objects.towns).features) //geojson 邊界座標，foreach
                  .enter() //step 1:enter townsGroup
                  .append("path") // step 2:append element
                  .attr("d", path)
                  .attr("stroke", "white")
                  .attr("stroke-width", "0.25px")
                  .attr("fill",()=>{
                      return eval(this.pathConfig.fill)
                  })
                  .attr("id", function (d: any, i) {
                      if (d.properties) return `country${d.properties.TOWNID}`;
                  })
                  .attr("class", function (d: any, i) {
                      return `country ${d.properties.TOWNNAME}`;
                  })
                  .on("contextmenu",(e:Event)=>{
                      if(this.design){
                          e.preventDefault()
                          console.log("right")
                      }
                  })
                  .on("mouseover", (d, i) => {
                      eval(this.pathConfig.mouseover);
                  })
                  .on("mousemove", (d, i: any) => {
                      eval(this.pathConfig.mousemove);
                  })
                  .on("mouseleave", (d, i) => {
                      eval(this.pathConfig.mouseleave);
                  })
                  // add an onclick action to zoom into clicked country
                  .on("click", (d, i) => {
                      if (!i || this.townId == i.properties.TOWNID) {
                          this.townId = null;
                          towns.style("fill", "grey");
                      } else {
                          this.townId = i.properties.TOWNID;
                          towns.style("fill", "grey");
                          svg.select(`#country${i.properties.TOWNID}`).style("fill", "yellow");
                          // .attr("stroke-width", "3px")
                      }
                      clicked(i);
                  });

              console.log("ending json calling1");
          });

          // unzoom 點擊 zoom
          d3.select("#zoom-reset-button").on("click", function () {
              clicked(null);
          });
      };

      this.initial();
      //點擊 country/town zoom
      var clicked = (d: any) => {
          var x, y, k;

          if (d && centered !== d) {
              //中心點相同或空白處(無geo item)
              var centroid = path.centroid(d);
              x = centroid[0]; //緯度轉x
              y = centroid[1]; //經度轉y
              k = 3; //放大3倍
              centered = d; //中心點(geo item)
          } else {
              x = width / 2;
              y = height / 2;
              k = 1;
              centered = null;
          }

          scaleBarZoom.zoomFactor(k); //比例尺設定改變(刻度)
          bar.call(scaleBarZoom); //rebuild 比例尺

          townsGroup
              .transition()
              .duration(750) //動畫時間
              .attr(
                  "transform",
                  "translate(" +
                  width / 2 +
                  "," +
                  height / 2 +
                  ")scale(" +
                  k +
                  ")translate(" +
                  -x +
                  "," +
                  -y +
                  ")" //平移到中心點，放大k倍，平移到-x,-y
              );

          bubbles
              .transition()
              .duration(750)
              .attr(
                  "transform",
                  "translate(" +
                  width / 2 +
                  "," +
                  height / 2 +
                  ")scale(" +
                  k +
                  ")translate(" +
                  -x +
                  "," +
                  -y +
                  ")"
              )
              .style("stroke-width", 1 + "px");
          // chooseTown(d);
      };

      //中心城市
      // var chooseTown = d => {
      //     if (!d || this.townId == d.properties.TOWNID) {
      //         this.townId = null;
      //         towns.attr("stroke", "white");
      //     } else {
      //         this.townId = d.properties.TOWNID;
      //         towns.attr("stroke", "white");
      //         svg.select(`#country${d.properties.TOWNID}`).attr("stroke", "orange");
      //         // .attr("stroke-width", "3px")
      //     }
      // };

      console.log("outside json calling1");
  }

  exportPicture() {
      var filename = "export.png";
      svgExport.saveSvgAsPng(document.querySelector('svg'), "export.png")
  }
  rebuild(){
      if(d3.select("#svgmap")){
          d3.select("#svgmap").remove();
      }
      this.initial();
  }
}
