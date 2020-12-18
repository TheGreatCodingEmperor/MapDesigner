import * as d3 from 'd3';
import { json } from 'd3';
import * as t from "topojson";

import { Bubbles, D3Element, IBubbles, IPath } from '../config-bar/config';

export interface IMapSchema {
    name: string,
    parent?: string,
    select?: string,
    selectAll?: string,
    elementType: string,
    dataSet?: any[],
    attrs?: object,
    action: any
}
export interface IMapBuilder {
    /**
     * @summary 根據 data build elements
     * @param name element 名稱(key)
     * @param parent select節點 ex:map["key"]，預設 map["svg"]
     * @param select select 條件
     * @param data 資料集
     * @param elementType append element type
     * @param attrs element 內容參數
     */
    dataSetBuildElements(name: string, parent: string, selectAll: string, data: string, elementType: string, attrs: object): any;
    /**
     * @summary foreach data 執行 action
     * @param parent select節點 ex:map["key"]
     * @param select select 條件
     * @param data 資料集
     * @param action 執行動作
     */
    datasetAction(parent: string, select: string, data: any[], action: string): any;
    /**
     * @summary 初學者 foreach data 設定 attrs
     * @param parent select節點 ex:map["key"]
     * @param select select 條件
     * @param data 資料集
     * @param action 執行動作
    */
    action(parent: string, select: string, data: any[], attrs: object): any;
    /**
        @summary 進階 執行 script
    */
    advanceAction(code: string): any;
    /**
     * @summary 畫出path、定義地圖區塊
     * @param code 資料前處理
     * @param data 資料(topojson)
     * @param attrs element 內容參數
     */
    buildPath(code: string, data: any[], tag: string, attrs: object): any;
}
export class D3BuildHelper implements IMapBuilder {
    width = 900;
    height = 600;
    public map = {};
    public dataSets = [];
    dataSetBuildElements(name: string, parent: string, selectAll: string, data: string, elementType: string, attrs: any) {
        var element = this.map["svg"];
        if (parent) {
            element = this.map[parent];
        }
        element = element.selectAll(selectAll)
            .data(this.dataSets.find(x => x.name == data).data)
            .enter()
            .append(elementType)
            // .attr("class", (d) => { return eval(attrs.class) })
            // .attr("id", (d) => { return eval(attrs.id) })
            .attr("cx", (d) => {
                return eval(attrs.cx)
            })
            .attr("cy", (d) => {
                return eval(attrs.cy)
            })
            .attr("r", (d) => { return eval(attrs.r) }) //圓形半徑
            .style("fill", (d) => { return eval(attrs.fill) }) //圓心顏色
            .attr("stroke", (d) => { return eval(attrs.stroke) }) //圓形外圍邊框
            .attr("stroke-width", (d) => { return eval(attrs.strokeWidth) }) //邊框寬度
            .attr("fill-opacity", (d) => { return eval(attrs.fillOpacity) }) //圓心透明
            .on("mouseover", (e, d) => {
                eval(attrs.mouseover)
            })
            .on("mousemove", (e, d) => {
                eval(attrs.mousemove)
            })
            .on("mouseleave", (e, d) => {
                eval(attrs.mouseleave)
            })
            .on("click", (e, d) => {
                eval(attrs.click);
            });
        this.map[name] = element;
    }
    datasetAction(parent: any, select: string, data: any[], action: string) {
        throw new Error('Method not implemented.');
    }
    action(parent: any, select: string, data: any[], attrs: object) {
        throw new Error('Method not implemented.');
    }
    advanceAction(code: string) {
        throw new Error('Method not implemented.');
    }
    buildPath = (code: string, data: any[], tag: string, attrs: any) => {
        data = this.deepClone(data);
        let afterProceed = eval(code);
        this.map["pathGroup"]
            .selectAll("path")
            .data(t.feature(afterProceed, afterProceed.objects[tag]).features)
            .enter()
            .append("path")
            .attr("d", this.map["path"])
            .attr("id", (d: any) => { return eval(attrs.id) })
            .attr("class",(d: any)=>{ return eval(attrs.class) })
            .attr("fill", (d) => { return eval(attrs.fill) })
            .attr("stroke", (d) => { return eval(attrs.stroke) })
            .attr("stroke-width", (d) => { return eval(attrs.strokeWidth) })
            .on("mouseover", (e, d) => {
                eval(attrs.mouseover);
            })
            .on("mousemove", (e, d) => {
                eval(attrs.mousemove);
            })
            .on("mouseleave", (e, d) => {
                eval(attrs.mouseleave);
            })
            .on("click", (e, d) => {
                eval(attrs.click);
            });
    }
    deepClone(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
}