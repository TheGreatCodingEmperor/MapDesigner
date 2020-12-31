import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { JoinHelper } from 'src/app/helpers/join-helper';
import { MapdatasService } from '../services/mapdatas.service';
declare var $: any;
import * as d3 from "d3";
import { JoinLinesService } from '../services/join-lines.service';
import { JoinLines } from '../models/join-lines';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dataset-join-editor',
  templateUrl: './dataset-join-editor.component.html',
  styleUrls: ['./dataset-join-editor.component.css']
})
export class DatasetJoinEditorComponent implements AfterViewInit, OnInit {
  @ViewChild('exampleDiv', { static: true }) exampleDiv: ElementRef;
  /** @summary 此專案所有資料集 */
  tables: { name: string, cols: string[], left?: number, top?: number }[] = [];
  /** @summary 上一次為止設計資料及關係line */
  lines: JoinLines[] = [];
  /** @summary 此專案編號 */
  mapId: number = 0;
  /** @summary 可拖曳(未設計)資料集 */
  displayTables = [];
  /** @summary 不可拖曳(已設計)資料集 */
  selectTables = [];
  public diagModel: any;

  /** @summary 設計方框中心X */
  private cx: number;
  /** @summary 設計方框中心Y */
  private cy: number;

  /** @summary 拖曳中的 資料集(this.tables) */
  table: any = null;
  /**  */
  index: number = null;

  constructor(
    private mapdatasService: MapdatasService,
    private route: ActivatedRoute,
    private joinLineService: JoinLinesService,
    private _snackBar: MatSnackBar,
    /** @summary Jquery FlowChart 功能封裝class */
    private joinHelper: JoinHelper

  ) { }

  //#region Main
  /**
   * @summary 取得資料、build join ui 畫面
   */
  ngOnInit() {
    // this.getMapIdAndLinesAndTables();
  }

  /** @summary 初始化jquery flowchart、 build 已設計畫面 */
  ngAfterViewInit() {
    this.getMapIdAndLinesAndTables();
  }
  //#endregion Main


  /** @summary 右方可拖曳欄位重新篩選 */
  refreshTables() {
    // console.log(this.selectTables)
    this.displayTables = this.tables.filter(x => !this.selectTables.includes(x))
  }

  /** @summary UI刪除選取 table/line */
  deleteOperationOrLink() {
    let selectTableId = this.joinHelper.GetSelectedOperatorId($(this.exampleDiv.nativeElement));
    this.selectTables = this.selectTables.filter(x => x.id != selectTableId);
    this.refreshTables();
    this.joinHelper.Delete($(this.exampleDiv.nativeElement));
  }

  /** @summary 儲存設計結果 table/line 到資料庫 */
  save() {
    this.saveLinesAndTables();
  }

  /** @summary 拖曳起始紀錄拖曳物件 */
  dragstart(table: any, index: number) {
    this.table = table;
  }

  /** @summary 拖曳 */
  dragover(ev) {
    ev.preventDefault();
  }

  /** @summary 拖曳結束 build UI table */
  drop(ev) {
    this.selectTables.push(this.table);
    this.refreshTables();
    // console.log(ev.pageX);
    // console.log(ev);
    this.joinHelper.AddOperator($(this.exampleDiv.nativeElement), this.table.id, this.table.name, ev.offsetX, ev.offsetY, this.table.cols);
  }

  /** @summary 互動彈跳文字視窗 */
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }


  //#region 封裝Method
  /** @summary 取得 Map、lines、tables */
  getMapIdAndLinesAndTables() {
    //從url 取得專案編號
    this.mapId = Number(this.route.snapshot.queryParamMap.get("Id"));
    //API 取得 lines/tables => this.tables/lines
    this.mapdatasService.GetMapDataSetsSchema(this.mapId).subscribe(res => {
      // APT.table => this.tables
      this.tables = res.Tables.map(x => {
        let cols = [];
        if (x.Schama != null) {
          cols = x.Schama.split(",");
        }
        return {
          id: x.TableId,
          name: x.Name,
          cols: cols,
          left: x.Left,
          top: x.Top
        }
      });
      // 將之前已設計過得資料及加入 this.selectTables
      this.selectTables = this.tables.filter(x => x.left != null && x.top != null);
      // 篩選右側可多一資料集
      this.refreshTables();
      //API lines => this.lines
      this.lines = res.Lines;
      this.initialFlowChartAndBuildLastDesign();
    })
  }

  /** @summary 初始化 jquery flowchart 以及 build 之前已設計好的lines/tables */
  initialFlowChartAndBuildLastDesign() {
    // 設計方框
    var container = $('#chart_container');
    // 設計方框中心 x,y
    this.cx = ($('#exampleDiv') as any).width() / 2;
    this.cy = ($('#exampleDiv') as any).height() / 2;
    ($('#exampleDiv') as any).panzoom({
    });
    ($('#exampleDiv') as any).panzoom('pan', -this.cx + container.width() / 2, -this.cy + container.height() / 2);

    // 放大縮小功能初始
    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    container.on('mousewheel.focal', function (e) {
      e.preventDefault();
      var delta = ((e as any).delta || (e.originalEvent as any).wheelDelta) || (e.originalEvent as any).detail;
      var zoomOut: any = delta ? delta < 0 : (e.originalEvent as any).deltaY > 0;
      currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
      ($('#exampleDiv') as any).flowchart('setPositionRatio', possibleZooms[currentZoom]);
      ($('#exampleDiv') as any).panzoom('zoom', possibleZooms[currentZoom], {
        animate: false,
        focal: e
      });
    });

    //根據API tables/lines 畫出關係圖
    this.buildDesignedLinesAndTables();
  }

  /** @summary build 之前已設計好的lines/tables */
  buildDesignedLinesAndTables() {
    let links = [];
    for (let line of this.lines) {
      links.push({
        fromConnector: `${line.FromColName}_out`,
        fromOperator: line.FromTableId,
        fromSubConnector: 0,
        toConnector: `${line.ToColName}_in`,
        toOperator: line.ToTableId
      })
    }
    let tables = {};
    for (let table of this.selectTables) {
      var inputs = {};
      var outputs = {};
      console.log(table.cols);
      for (let col of table.cols) {
        inputs[`${col}_in`] = {};
        inputs[`${col}_in`]["label"] = col;
        outputs[`${col}_out`] = {};
        outputs[`${col}_out`]["label"] = col;
      }
      tables[table.id] = {
        left: table.left,
        top: table.top,
        properties: {
          title: table.name,
          class: "flowchart-operators",
          inputs: inputs,
          outputs: outputs
        }
      };
    }
    console.log({ links: links, operatorTypes: {}, operators: tables });
    ($(this.exampleDiv.nativeElement) as any).flowchart({
      data: { links: links, operatorTypes: {}, operators: tables },
      multipleLinksOnOutput: false,
    });
    $(".flowchart-links-layer").on("dragover", (e) => this.dragover(e));
    $(".flowchart-links-layer").on("drop", (e) => this.drop(e));
  }

  /** @summary 儲存 已設計的 lines、tables */
  saveLinesAndTables() {
    let datas = this.joinHelper.GetDatas($(this.exampleDiv.nativeElement));
    // console.log(datas)
    let lines: any[] = [];
    let tables: { tableId: number, top: number, left: number }[] = [];
    let linksIds = Object.keys(datas.links);
    for (let line of linksIds) {
      let tmp: any = {};
      // tmp.MapId = this.mapId;
      tmp.fromTableId = Number(datas.links[line as string].fromOperator);
      tmp.fromColName = datas.links[line as string].fromConnector.split('_')[0];
      tmp.toTableId = Number(datas.links[line as string].toOperator);
      tmp.toColName = datas.links[line as string].toConnector.split('_')[0];
      lines.push(tmp);
    }
    let operatorIds = Object(datas.operators);
    for (let table in operatorIds) {
      tables.push({
        tableId: Number(table),
        left: datas.operators[table as string].left,
        top: datas.operators[table as string].top
      })
    }
    // console.log({lines:lines,tables:tables})
    this.joinLineService.SaveJoinLineAndTables({ mapId: this.mapId, lines: lines, tables: tables }).subscribe(res => {
      this.openSnackBar("Save Successed!");
    });
  }
  //#endregion 封裝 Method
}
