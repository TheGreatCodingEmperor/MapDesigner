using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text.Json;
using MapDesigner.Models;
using Newtonsoft.Json;
using Z.Expressions;

namespace MapDesigner.Helpers {
    public interface IMapDesignHelper {
        public object InnerJoin (SqlQueryData a, SqlQueryData b, string aKeyName, string bKeyName);
        public LogicLayerResponse MultiJoin (List<SqlQueryData> lists, JoinLine[] lines);
    }
    public class MapDesignHelper : IMapDesignHelper {
        private IDynamicCompileHelper _dynamicCompileHelper {get;}
        public MapDesignHelper(IDynamicCompileHelper dynamic){
            _dynamicCompileHelper = dynamic;
        }

        public object InnerJoin (SqlQueryData a, SqlQueryData b, string aKeyName, string bKeyName) {
            var query = from aRow in a.Data
            from bRow in b.Data
            where JsonEquals (aRow[aKeyName], bRow[bKeyName])
            select new Dictionary<string, object> () {
                [a.Name] = aRow, [b.Name] = bRow };
            return query;
        }

        public LogicLayerResponse MultiJoin (List<SqlQueryData> lists, JoinLine[] lines) {
            if(lists.Count()<2||lists.Count()!=lines.Length+1){
                return new LogicLayerResponse(){Status=400,Result="Join relation Error!"};
            }
            
            var fromTable = new List<string>();
            var whereCon =new List<string>();
            var selectData = new List<string>();
            for(var i=0;i<lists.Count() ; i++){
                fromTable.Add($"from {lists[i].Name} in data[{i}] ");
                selectData.Add($"{lists[i].Name}={lists[i].Name}");
            }
            for(var i=0;i<lines.Count();i++){
                whereCon.Add($"where {lines[i].FromeTableName}[FromColName[{i}]] == {lines[i].ToTableName}[ToColName[{i}]] ");
            }
            
            var code = $"try{{ var query = {String.Join(" ",fromTable)} {String.Join(" ",whereCon)} Select new {{ {String.Join(",",selectData)} }};return query; }}catch(Exception e){{return e.ToString();}} ";
            code = code.ToString();
            var data = lists.Select(x => x.Data).ToArray();
            var FromColName = lines.Select(x => x.FromColName).ToArray();
            var ToColName = lines.Select(x => x.ToColName).ToArray();
            var logicResult = Eval.Execute<dynamic>(code, new { data=data,FromColName = FromColName, ToColName = ToColName} );

            var result = new LogicLayerResponse(){Status=200,Result = logicResult};
            return result;
        }

        public bool JsonEquals (JsonElement x, JsonElement y) {
            if (x.ValueKind != y.ValueKind)
                return false;
            switch (x.ValueKind) {
                case JsonValueKind.Null:
                case JsonValueKind.True:
                case JsonValueKind.False:
                case JsonValueKind.Undefined:
                    return true;

                    // Compare the raw values of numbers, and the text of strings.
                    // Note this means that 0.0 will differ from 0.00 -- which may be correct as deserializing either to `decimal` will result in subtly different results.
                    // Newtonsoft's JValue.Compare(JTokenType valueType, object? objA, object? objB) has logic for detecting "equivalent" values, 
                    // you may want to examine it to see if anything there is required here.
                    // https://github.com/JamesNK/Newtonsoft.Json/blob/master/Src/Newtonsoft.Json/Linq/JValue.cs#L246
                case JsonValueKind.Number:
                    return x.GetRawText () == y.GetRawText ();

                case JsonValueKind.String:
                    return x.GetString () == y.GetString (); // Do not use GetRawText() here, it does not automatically resolve JSON escape sequences to their corresponding characters.

                    // case JsonValueKind.Array:
                    //     return x.EnumerateArray ().SequenceEqual (y.EnumerateArray (), this);

                case JsonValueKind.Object:
                    {
                        // Surprisingly, JsonDocument fully supports duplicate property names.
                        // I.e. it's perfectly happy to parse {"Value":"a", "Value" : "b"} and will store both
                        // key/value pairs inside the document!
                        // A close reading of https://tools.ietf.org/html/rfc8259#section-4 seems to indicate that
                        // such objects are allowed but not recommended, and when they arise, interpretation of 
                        // identically-named properties is order-dependent.  
                        // So stably sorting by name then comparing values seems the way to go.
                        var xPropertiesUnsorted = x.EnumerateObject ().ToList ();
                        var yPropertiesUnsorted = y.EnumerateObject ().ToList ();
                        if (xPropertiesUnsorted.Count != yPropertiesUnsorted.Count)
                            return false;
                        var xProperties = xPropertiesUnsorted.OrderBy (p => p.Name, StringComparer.Ordinal);
                        var yProperties = yPropertiesUnsorted.OrderBy (p => p.Name, StringComparer.Ordinal);
                        foreach (var (px, py) in xProperties.Zip (yProperties)) {
                            if (px.Name != py.Name)
                                return false;
                            if (!Equals (px.Value, py.Value))
                                return false;
                        }
                        return true;
                    }

                default:
                    throw new System.Text.Json.JsonException (string.Format ("Unknown JsonValueKind {0}", x.ValueKind));
            }
        }
    }
}