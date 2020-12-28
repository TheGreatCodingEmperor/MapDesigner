export interface IJoinHelper {
    AddOperator(element: any, name: string, cx: number, cy: number,cols:string[]): any;
    Delete(element:any): any;
    GetSelectedOperatorId(element:any):any;
    GetDatas(element:any): any;
    SetDatas(): any;
}
export class JoinHelper implements IJoinHelper {
    AddOperator(element: any, name: string, cx: number, cy: number, cols:string[]) {
        var operatorId = name;
        let inputs = {}
        let outputs = {};
        for(let col of cols){
            inputs[`${col}_in`] ={};
            inputs[`${col}_in`]["label"] = col;
            outputs[`${col}_out`] ={};
            outputs[`${col}_out`]["label"] = col;
        }
        var operatorData = {
            top: cx,
            left: cy,
            properties: {
                title: name,
                class: 'flowchart-operators',
                inputs: inputs,
                outputs: outputs
            }
        }
        // this.operatorI++;
        element.flowchart('createOperator', operatorId, operatorData);
    }
    GetSelectedOperatorId(element:any){
        return element.flowchart('getSelectedOperatorId');
    }
    Delete(element:any) {
        element.flowchart('deleteSelected');
    }
    GetDatas(element:any) {
        return element.flowchart('getData');
    }
    SetDatas() {
        throw new Error("Method not implemented.");
    }
}