import * as d3 from 'd3';

export interface IMapSchema {
    type:string,
    name: string,
    dataSet: any[],
    attrs: object,
    parent?: string,
    select?: string,
    selectAll?: string,
    append?: string,
    code?: string
  }
export class D3BuildHelper{
    public mapSchemas:IMapSchema[]=[]
    build(parent:any,schema:IMapSchema){
        var element = parent;
        if(schema.select){
            element = element.select(schema.select);
        }
        else{
            
        }
    }
}