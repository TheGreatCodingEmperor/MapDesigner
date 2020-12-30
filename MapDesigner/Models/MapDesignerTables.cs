using System.ComponentModel.DataAnnotations;

public class DataSet{
    [Key]
    public int DataSetId {get;set;}
    public int DataType {get;set;}
    public string Schema {get;set;} 
    public string Name {get;set;}
    public string Data {get;set;}
}
public class MapSchema{
    [Key]
    public int Id {get;set;}
    public string Name {get;set;}
    public string Schema {get;set;} 
}
public class MapDatas{
    [Key]
    public int Id {get;set;}
    public int MapId {get;set;}
    public int DataSetId {get;set;}
    public int? Top {get;set;}
    public int? Left {get;set;}
}
public class JoinLines{
    [Key]
    public long LineId {get;set;}
    public int MapId {get;set;}
    public int FromTableId {get;set;}
    public string FromColName {get;set;}
    public int ToTableId {get;set;}
    public string ToColName {get;set;}
}