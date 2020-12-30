using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using MapDesigner.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Z.Expressions;

namespace MapDesigner.Helpers{
    public interface IBasicEfcoreHelper{
        public IQueryable<T> GetList<T>(DbContext context)where T: class;
        public T GetSingle<T,Tkey>(DbContext context,Tkey key)where T: class;
        public void PatchSingle<T>(DbContext context,T body, bool transaction=true)where T: class;
        public void PatchList<T>(DbContext context,List<T> body, bool transaction=true)where T:class;
        public void RemoveSingle<T,Tkey>(DbContext context,Tkey key, bool transaction=true)where T: class;
        public LogicLayerResponse MultiJoin (string rawData, JoinLine[] lines);
    }
    public class BasicEfcoreHelper : IBasicEfcoreHelper
    {
        public BasicEfcoreHelper(){
        }
        public IQueryable<T> GetList<T>(DbContext context)where T: class
        {
            return context.Set<T>().AsNoTracking();
        }

        public T GetSingle<T, Tkey>(DbContext context,Tkey key)where T: class
        {
            var keyProperty = typeof(T).GetProperties().FirstOrDefault(x => x.GetCustomAttributes().Any(a => ((KeyAttribute)a) != null));
            return context.Set<T>().SingleOrDefault($"{keyProperty.Name} = {key}");
        }

        public void PatchSingle<T>(DbContext context,T body, bool transaction=true)where T: class
        {
            var keyProperty = typeof(T).GetProperties().FirstOrDefault(x => x.GetCustomAttributes().Any(a => ((KeyAttribute)a) != null));
            var exist = context.Set<T>().SingleOrDefault ($"{keyProperty.Name} = {keyProperty.GetValue(body)}");
            if (exist == null) {
                context.Set<T>().Add (body);
            } else {
                var newItem = DeepClone<T>(exist,body);
                context.Set<T>().Update (newItem);
            }
            if(!transaction){
                context.SaveChanges();
            }
        }

        public void RemoveSingle<T, Tkey>(DbContext context,Tkey key, bool transaction=true)where T:class
        {
            var keyProperty = typeof(T).GetProperties().FirstOrDefault(x => x.GetCustomAttributes().Any(a => ((KeyAttribute)a) != null));
            var rmItem = context.Set<T>().SingleOrDefault ($"{keyProperty.Name} = {key}");
            context.Set<T>().Remove(rmItem);
            if(!transaction){
                context.SaveChanges();
            }
        }
        public T DeepClone<T> (T res, T newT)
        {
            var properties = typeof (T).GetProperties();
            foreach(var property in properties){
                property.SetValue(res,property.GetValue(newT));
            }
            return res;
        }

        public void PatchList<T>(DbContext context, List<T> body, bool transaction=true) where T : class
        {
            foreach(var item in body){
                PatchSingle<T>(context,item,false);
            }
        }

        public LogicLayerResponse MultiJoin (string raw, JoinLine[] lines) {
            var data = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, object>>>>(raw);
            var result = new LogicLayerResponse ();
            try {
                var currentData = new List<string> ();
                var tmp = "";
                for (var i = 0; i < lines.Length; i++) {
                    var fromTable = lines[i].FromeTableName;
                    var toTable = lines[i].ToTableName;
                    var fromCol = lines[i].FromColName;
                    var toCol = lines[i].ToColName;
                    if (i == 0) {
                        tmp += $"data[\"{fromTable}\"].Join(data[\"{toTable}\"], {fromTable}=>{fromTable}[\"{fromCol}\"], {toTable}=>{toTable}[\"{toCol}\"], ({fromTable},{toTable})=>new{{{fromTable},{toTable}}})";
                    } else {
                        tmp += $".Join(data[\"{toTable}\"], query=>query.{fromTable}[\"{fromCol}\"], {toTable}=>{toTable}[\"{toCol}\"], (query,{toTable})=>new{{{Query2dTo1d(currentData.ToArray())}{toTable}}})";
                    }
                    if (currentData.FirstOrDefault (x => x == fromTable) == null) {
                        currentData.Add (fromTable);
                    }
                    if (currentData.FirstOrDefault (x => x == toTable) == null) {
                        currentData.Add (toTable);
                    }
                }
                result.Status = 200;
                result.Result = Eval.Execute (tmp, new { data = data });
            } catch (Exception e) {
                result.Status = 400;
                result.Result = e.ToString ();
            }
            return result;
        }

        public static string Query2dTo1d (string[] tables) {
            var str = "";
            foreach (var table in tables) {
                str += $"query.{table},";
            }
            return str;
        }
    }
}