import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import {
  Compiler,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  ModuleWithComponentFactories,
  NgModule,
  ViewContainerRef
} from '@angular/core';
declare var $ : any;


@Component({
  selector: 'app-dataset-join-editor',
  templateUrl: './dataset-join-editor.component.html',
  styleUrls: ['./dataset-join-editor.component.css']
})
export class DatasetJoinEditorComponent implements AfterViewInit {
  @ViewChild('exampleDiv',{static:true}) exampleDiv: ElementRef;
  public diagModel: any;

  private cx: number;
  private cy: number;




  constructor() {
  }



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


  getOperatorData($element) {
    var nbInputs = parseInt($element.data('nb-inputs'));
    var nbOutputs = parseInt($element.data('nb-outputs'));
    var data = {
      properties: {
        title: $element.text(),
        inputs: {},
        outputs: {}
      }
    };

    var i = 0;
    for (i = 0; i < nbInputs; i++) {
      data.properties.inputs['input_' + i] = {
        label: 'Input ' + (i + 1)
      };
    }
    for (i = 0; i < nbOutputs; i++) {
      data.properties.outputs['output_' + i] = {
        label: 'Output ' + (i + 1)
      };
    }

    return data;
  }



  operatorI = 0;
  operatorII = 0;
  addNewOperator() {

    var operatorId = 'created_operator_' + this.operatorI;
    var operatorData = {
      top: this.cx,
      left: this.cy,
      properties: {
        title: 'Operator ' + (this.operatorI + 3),
        class: 'flowchart-operators',
        inputs: {
          input_1: {
            label: 'Output 1',
          },
          input_2: {
            label: 'Output 2',
          },
          input_3: {
            label: 'Output 3',
          },
          input_4: {
            label: 'Output 4',
          },
        },
        outputs: {
          output_1: {
            label: 'Output 1',
          },
          output_2: {
            label: 'Output 2',
          },
          output_3: {
            label: 'Output 3',
          },
          output_4: {
            label: 'Output 4',
          },
        }
      }
    }

    this.operatorI++;
    ($(this.exampleDiv.nativeElement) as any).flowchart('createOperator', operatorId, operatorData);
  }

  addNewOperator2() {

    var operatorId = 'created_operator_' + this.operatorI;
    var operatorData = {
      top: this.cx,
      left: this.cy,
      properties: {
        title: 'Operator ' + (this.operatorI + 3),
        class: 'flowchart-operators',
        inputs: {
          input_1: {
            label: 'Input 1',
          },
          input_2: {
            label: 'Input 2',
          },
          input_3: {
            label: 'Input 3',
          },
        },
        outputs: {}
      }
    }

    this.operatorI++;
    ($(this.exampleDiv.nativeElement) as any).flowchart('createOperator', operatorId, operatorData);
  }



  deleteOperationOrLink() {
    ($(this.exampleDiv.nativeElement) as any).flowchart('deleteSelected');
  }

  load() {
    ($(this.exampleDiv.nativeElement) as any).flowchart('deleteSelected');
    var data = JSON.parse(this.diagModel);
    ($(this.exampleDiv.nativeElement) as any).flowchart('setData', data);
  }


  get() {
    ($(this.exampleDiv.nativeElement) as any).flowchart('deleteSelected');
    var data = ($(this.exampleDiv.nativeElement) as any).flowchart('getData');
    this.diagModel = JSON.stringify(data, null, 2);
  }

}

