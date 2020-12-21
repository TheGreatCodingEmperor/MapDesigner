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
}