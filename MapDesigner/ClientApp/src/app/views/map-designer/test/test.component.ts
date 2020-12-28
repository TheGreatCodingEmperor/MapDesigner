import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JoinHelper } from 'src/app/helpers/join-helper';
declare var $ : any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements AfterViewInit {
  @ViewChild('exampleDiv',{static:true}) exampleDiv: ElementRef;
  tables = [
    {name:"table",cols:["a","b","c"]},
    {name:"table1",cols:[]},
    {name:"table2",cols:[]},
    {name:"table3",cols:[]},
    {name:"table4",cols:[]},
    {name:"table5",cols:[]},
  ];
  public diagModel: any;

  private cx: number;
  private cy: number;

  table:any = null;
  index:number = null;

  private joinHelper = new JoinHelper;

  constructor() { }

  ngAfterViewInit() {
    var container = $('#chart_container');
    this.cx = ($('#exampleDiv') as any).width() / 2;
    this.cy = ($('#exampleDiv') as any).height() / 2;
    ($('#exampleDiv') as any).panzoom({
    });
    ($('#exampleDiv') as any).panzoom('pan', -this.cx + container.width() / 2, -this.cy + container.height() / 2);

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


    setTimeout(() => {
      ($(this.exampleDiv.nativeElement) as any).flowchart({
        data: '',
        multipleLinksOnOutput: false,
      });

    }, 1000);
  }
  addNewOperator(){
    this.joinHelper.AddOperator($(this.exampleDiv.nativeElement),"test",this.cx,this.cy,[]);
  }
  deleteOperationOrLink(){
    this.tables.push(this.joinHelper.GetSelectedOperatorId($(this.exampleDiv.nativeElement)));
    this.joinHelper.Delete($(this.exampleDiv.nativeElement));
  }
  get(){
    console.log(this.joinHelper.GetDatas($(this.exampleDiv.nativeElement)))
  }
  dragstart(table:any,index:number){
    this.table = table;
    this.index = index;
  }
  dragover(ev){
    ev.preventDefault();
  }
  drop(ev){
    this.tables.splice(this.index,1);
    this.joinHelper.AddOperator($(this.exampleDiv.nativeElement),this.table.name,this.cx/2+ev.pageY,this.cy/2+ev.pageX,this.table.cols);
  }
}
