public class DataSet{
    public int DataSetId {get;set;}
    public int DataType {get;set;}
    public string Schema {get;set;} 
    public string Name {get;set;}
    public string Data {get;set;}
}
public class MapSchema{
    public int Id {get;set;}
    public string Name {get;set;}
    public string Schema {get;set;} 
}
public class MapDatas{
    public int Id {get;set;}
    public int MapId {get;set;}
    public int DataSetId {get;set;}
}