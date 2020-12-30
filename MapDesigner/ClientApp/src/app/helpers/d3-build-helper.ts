import * as d3 from 'd3';
import * as t from "topojson";

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
    dataSetBuildElements(name: string, parent: string, selectAll: string, data: any[], elementType: string, config: object): any;
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
    buildPath(code: string, data: any[], tag: string, config: object): any;

}
export class D3BuildHelper implements IMapBuilder {
    width = 900;
    height = 600;
    public map = {};
    public dataSets = [];
    dataSetBuildElements(name: string, parent: string, selectAll: string, data: any[], elementType: string, config: any) {
        var element = this.map["svg"];
        if (parent) {
            element = this.map[parent];
        }
        element = element.selectAll(selectAll)
            .data(data)
            .enter()
            .append(elementType)
            // .attr("class", (d) => { return eval(attrs.class) })
            // .attr("id", (d) => { return eval(attrs.id) })
            .attr("cx", (d) => {
                return config.advance["cx"]?eval(config.attrs["cx"]):config.attrs["cx"];
            })
            .attr("cy", (d) => {
                return config.advance["cy"]?eval(config.attrs["cy"]):config.attrs["cy"];
            })
            .attr("r", (d) => { return config.advance["r"]?eval(config.attrs["r"]):config.attrs["r"]; }) //圓形半徑
            .style("fill", (d) => { return config.advance["fill"]?eval(config.attrs["fill"]):config.attrs["fill"]; }) //圓心顏色
            .attr("stroke", (d) => { return config.advance["stroke"]?eval(config.attrs["stroke"]):config.attrs["stroke"]; }) //圓形外圍邊框
            .attr("stroke-width", (d) => { return config.advance["strokeWidth"]?eval(config.attrs["strokeWidth"]):config.attrs["strokeWidth"]; }) //邊框寬度
            .attr("fill-opacity", (d) => { return config.advance["fillOpacity"]?eval(config.attrs["fillOpacity"]):config.attrs["fillOpacity"]; }) //圓心透明
            .on("mouseover", (e, d) => {
                eval(config.attrs.mouseover)
            })
            .on("mousemove", (e, d) => {
                eval(config.attrs.mousemove)
            })
            .on("mouseleave", (e, d) => {
                eval(config.attrs.mouseleave)
            })
            .on("click", (e, d) => {
                eval(config.attrs.click);
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
        eval(code);
    }
    buildPath = (code: string, data: any[], tag: string, config: any) => {
        data = this.deepClone(data);
        let afterProceed = eval(code);
        this.map["pathGroup"]
            .selectAll("path")
            .data(t.feature(afterProceed, afterProceed.objects[tag]).features)
            .enter()
            .append("path")
            .attr("d", this.map["path"])
            .attr("id", (d: any) => {
                if(config.advance["id"]) 
                    return eval(config.attrs.id);
                return config.attrs["id"];
            })
            .attr("class",(d: any)=>{ 
                if(config.advance["class"])
                    return eval(config.attrs.class);
                return config.attrs["class"]
             })
            .attr("fill", (d) => { 
                if(config.advance["fill"])
                    return eval(config.attrs.fill) 
                return config.attrs["fill"]
            })
            .attr("stroke", (d) => { 
                if(config.advance["stroke"])
                    return eval(config.attrs.stroke) 
                return config.attrs["stroke"]
            })
            .attr("stroke-width", (d) => { 
                if(config.advance["strokeWidth"])
                    return eval(config.attrs.strokeWidth) 
                return config.attrs["strokeWidth"]
            })
            .on("mouseover", (e, d) => {
                eval(config.attrs.mouseover);
            })
            .on("mousemove", (e, d) => {
                eval(config.attrs.mousemove);
            })
            .on("mouseleave", (e, d) => {
                eval(config.attrs.mouseleave);
            })
            .on("click", (e, d) => {
                eval(config.attrs.click);
            });
    }
    deepClone(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
    attrtypes={
            centerLong:'number',
            centerLat:'number',
            scale:'number',
            translateX:'number',
            translateY:'number',
            fill:'color',
            stroke:'color',
            strokeWidth:'number',
            mouseover:'code',
            mousemove:'code',
            mouseleave:'code',
            click:'code',
            id:'string',
            class:'string',
            left:'number',
            top:'number',
            cx:'number',
            cy:'number',
            r:'number',
            fillOpacity:'number'
        };
}

export class BubbleTemplate{
    type="bubble";
    name="";
    DataSetId=null;
    attrs={
        "cx": "this.map[\"projection\"]([d.long, d.lat])[0]; //座標轉 xy 軸 x",
		"cy": "this.map[\"projection\"]([d.long, d.lat])[1]; //座標轉 xy 軸 y",
		"r": "5",
		"stroke": "#00ffcc",
		"strokeWidth": "0.25",
		"fillOpacity": "0.8",
		"fill": "'red'",
		"mouseover": "this.map[\"tooltip\"].style(\"opacity\", 1);",
		"mousemove": " this.map[\"tooltip\"].html().style(\"top\", e.pageY + \"px\");",
		"mouseleave": "this.map[\"tooltip\"].style(\"opacity\", 0);",
		"click": "this.map.clicked(d)"
    }
    advance= {
		"fill": true,
		"mousemove": true,
		"cx": true,
		"cy": true,
		"stroke": false,
		"mouseover": true,
		"mouseleave": true,
		"click": true
	}
}