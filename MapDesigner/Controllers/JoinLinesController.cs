using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using MapDesigner.Helpers;
using MapDesigner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class JoinLinesController : BaseController<JoinLines, long> {

        private MapDesignerContext _mapContext { get; }
        private readonly IBasicEfcoreHelper _efcorHelper;

        public JoinLinesController (MapDesignerContext mapDesigner, IBasicEfcoreHelper basicEfcoreHelper) : base (mapDesigner, basicEfcoreHelper) {
            _mapContext = mapDesigner;
            _efcorHelper = basicEfcoreHelper;
        }

        [HttpPatch ("SaveJoinLineAndTables")]
        /// <summary>
        /// 儲存 UI 操作 Join 完的設計內容
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        public async Task<IActionResult> SaveJoinLineAndTables ([FromBody] JoinLineBody body) {
            var currentMapDatas = _efcorHelper.GetList<MapDatas> (_mapContext).ToList ();
            foreach(var table in currentMapDatas){
                table.Left = null;
                table.Top = null;
                var inputData = body.Tables.Where(x => x.TableId == table.Id).SingleOrDefault();
                if(inputData!=null){
                    table.Top = inputData.Top;
                    table.Left = inputData.Left;
                }
                _efcorHelper.PatchSingle<MapDatas>(_mapContext,table,true);
            }
            await _mapContext.SaveChangesAsync();
            
            var currentLines = _efcorHelper.GetList<JoinLines> (_mapContext).Where (x => x.MapId == body.MapId).ToList ();
            for (var i = 0; i < body.Lines.Length; i++) {
                if (i < currentLines.Count ()) {
                    currentLines[i].FromTableId = (int) body.Lines[i].FromTableId;
                    currentLines[i].ToTableId = (int) body.Lines[i].ToTableId;
                    currentLines[i].FromColName = body.Lines[i].FromColName;
                    currentLines[i].ToColName = body.Lines[i].ToColName;
                    _efcorHelper.PatchSingle<JoinLines>(_mapContext,currentLines[i],true);
                }
                else{
                    var newLine = new JoinLines();
                    newLine.LineId = 0;
                    newLine.MapId = body.MapId;
                    newLine.FromTableId = (int) body.Lines[i].FromTableId;
                    newLine.ToTableId = (int) body.Lines[i].ToTableId;
                    newLine.FromColName = body.Lines[i].FromColName;
                    newLine.ToColName = body.Lines[i].ToColName;
                    _efcorHelper.PatchSingle<JoinLines>(_mapContext,newLine,true);
                }
            }
            var currentN = currentLines.Count();
            var removeN = currentN-body.Lines.Length;
            for(var i = 0;i<removeN;i++){
                _efcorHelper.RemoveSingle<JoinLines,long>(_mapContext,currentLines[currentN-i-1].LineId,true);
            }
            await _mapContext.SaveChangesAsync();
            return Ok();
        }
    }
    public class JoinLineBody {
        public int MapId { get; set; }
        public JoinLine[] Lines { get; set; }
        public JoinUITable[] Tables {get;set;}
    }
    public class JoinUITable{
        public int TableId {get;set;}
        public int? Top {get;set;}
        public int? Left {get;set;}
    }
}