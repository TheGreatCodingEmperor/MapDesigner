using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System;
using MapDesigner.Models;
using Z.Expressions;

namespace MapDesigner.Helpers{
    public interface IDynamicCompileHelper
    {
        public LogicLayerResponse LogicCalculation(string code);
    }
    public class DynamicCompileHelper:IDynamicCompileHelper{
        public DynamicCompileHelper(){
        }

        /// <summary>
        /// 邏輯層取值
        /// </summary>
        /// <param name="code">邏輯公式</param>
        /// <param name="ssc">SSC Signals</param>
        /// <returns></returns>
        public LogicLayerResponse LogicCalculation (string code) {
           
            string result = "";
            //計算結果
            try {
                var tmp = Eval.Execute<dynamic> (code);
                if (tmp is string) {
                    result = tmp;
                } else {
                    result = tmp.ToString ();
                }
            } catch (Exception e) {
                Console.WriteLine(e.ToString());
                return new LogicLayerResponse () { Status = 400, Result = "Logic Error" };
            }

            return new LogicLayerResponse () { Status = 200, Result = result };
        }
    }
}