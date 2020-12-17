export interface IScaleBarZoom {
    left: number;
    top: number;
}
export class ScaleBarZoom implements IScaleBarZoom {
    left: number = 0.05;
    top: number = 0.85;
}

export interface ISvg {
    id: string;
    width: number;
    height: number;
    fill: string;
}
export class Svg implements ISvg {
    id: string = "svgmap";
    width: number = 200;
    height: number = 200;
    fill: string = "grey";
}

export interface IRect {
    width: number,
    height: number,
    fill: string,
    stroke: string,
    dblclick: string,
    mouseover: string,
    mousemove: string,
    mouseout: string,
    click: string
}
export class Rect implements IRect {
    width: number = 200;
    height: number = 200;
    fill: string = "'white'";
    stroke: string = "'black'";
    dblclick: string = "null";
    mouseover: string = "null";;
    mousemove: string = "null";;
    mouseout: string = "null";;
    click: string = "null";;
}

export interface IBubbles {
    data: object[],
    class: string,
    longLabel: string,
    latLabel: string,
    r: string,
    fill: string,
    stroke: string,
    strokeWidth: string,
    fillOpacity: string,
    dblclick: string,
    mouseover: string,
    mousemove: string,
    mouseout: string,
    click: string
}
export class Bubbles implements IBubbles {
    data: object[] = [];
    class: string = "bubble";
    longLabel: string = "'long'";
    latLabel: string = "'lat'";
    r: string = "5";
    fill: string = "'red'";
    stroke: string = "'black'";
    strokeWidth: string = "0.25";
    fillOpacity: string = "1";
    dblclick: string = "null";
    mouseover: string = `this.hospital = i; //mouse enter
    tooltip.style("opacity", 1);`;
    mousemove: string = `tooltip
    .html(i.name)
    .style("left", d.pageX + 10 + "px")
    .style("top", d.pageY + "px");`;
    mouseout: string = "null";
    click: string = "null";
}

export interface IGlobal {
    json: object,
    dataSet: string,
    filterCondition: object
}
export class Global implements IGlobal {
    json: object = {};
    dataSet: string = "towns";
    filterCondition: object = {
        TOWNNAME: "高雄市"
    }
}

export interface IPath {
    stroke: string,
    strokeWidth: string,
    fill:string,
    id: string,
    class: string,
    dblclick: string,
    mouseover: string,
    mousemove: string,
    mouseleave: string,
    click: string
}
export class Path implements IPath {
    stroke: string = "'none'";
    strokeWidth: string = "0.25";
    fill = "'grey'";
    id: string = "d.properties.TOWNID";
    class: string = "town";
    dblclick: string = "null";
    mouseover: string = `tooltip.style("opacity", 1);
    svg.select("#country"+i.properties.TOWNID).style("fill", "orange");`;
    mousemove: string = `tooltip
    .html(i.properties.COUNTYNAME + i.properties.TOWNNAME)
    .style("left", d.pageX + 10 + "px")
    .style("top", d.pageY + "px");`;
    mouseleave: string = `tooltip.style("opacity", 0);
if(this.townId==i.properties.TOWNID)
svg.select("#country"+i.properties.TOWNID).style("fill", "yellow");
else{
svg.select("#country"+i.properties.TOWNID).style("fill", "grey");
}`;
    click: string = "null";
}