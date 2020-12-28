using System.Collections.Generic;

namespace MapDesigner.Models{
    public class SqlQueryData{
        public string Name{get;set;}
        public List<Dictionary<string,dynamic>> Data{get;set;}
    }
    public class JoinLine{
        public string FromeTableName{get;set;}
        public string FromColName{get;set;}
        public string ToTableName{get;set;}
        public string ToColName{get;set;}
    }
    public class SqlQuery{
        public JoinLine[] Lines {get;set;}
        public List<SqlQueryData> Datas {get;set;}
    }
}