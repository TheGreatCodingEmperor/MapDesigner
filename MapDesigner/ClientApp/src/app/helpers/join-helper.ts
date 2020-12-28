export interface IJoinHelper {
    AddOperator(element: any, name: string, cx: number, cy: number): any;
    Delete(element:any): any;
    GetDatas(element:any): any;
    SetDatas(): any;
}
export class JoinHelper implements IJoinHelper {
    AddOperator(element: any, name: string, cx: number, cy: number) {
        var operatorId = 'created_operator_' + name;
        var operatorData = {
            top: cx,
            left: cy,
            properties: {
                title: 'Operator ' + name,
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
        // this.operatorI++;
        element.flowchart('createOperator', operatorId, operatorData);
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