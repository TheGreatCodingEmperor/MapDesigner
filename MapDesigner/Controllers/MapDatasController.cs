using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MapDesigner.Helpers;
using Newtonsoft.Json.Linq;
using MapDesigner.Models;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class MapDatasController : BaseController<MapDatas,int>{

        private MapDesignerContext _mapContext { get; }
        private readonly IBasicEfcoreHelper _efcorHelper;
        private IMapDesignHelper _mapDesignHelper {get;}

        public MapDatasController (MapDesignerContext mapDesigner, 
            IBasicEfcoreHelper efcoreHelper,IMapDesignHelper mapDesignHelper):base( mapDesigner, efcoreHelper) {
            _mapContext = mapDesigner;
            _efcorHelper = efcoreHelper;
            _mapDesignHelper = mapDesignHelper;
        }

        [HttpGet("datasets/{mapId}")]
        public async Task<IActionResult> GetMapDataSets([FromRoute] int mapId){
            var mapSchema = _efcorHelper.GetList<MapDatas>(_mapContext).Where(x => x.MapId == mapId).Select(x => x.DataSetId).ToList();
            await Task.CompletedTask;
            return Ok(mapSchema);
        }

        [HttpPost("innerJoin")]
        public async Task<IActionResult> GetInnerJoin([FromBody] JoinDataSet body){
            var result = _mapDesignHelper.InnerJoin(body.a,body.b,body.aKeyNam,body.bKeyName);
            await Task.CompletedTask;
            return Ok(result);
        }

        [HttpPost("multiJoin")]
        public async Task<IActionResult> MultiJoin([FromBody] SqlQuery body ){
            var result = _mapDesignHelper.MultiJoin(body.Datas,body.Lines);
            if(result.Status!=200){
                return BadRequest(result.Result);
            }
            await Task.CompletedTask;
            return Ok(JsonConvert.SerializeObject(result.Result,Formatting.Indented));
        }
    }
    public class JoinDataSet{
        public SqlQueryData a {get;set;}
        public SqlQueryData b {get;set;}
        public string aKeyNam {get;set;}
        public string bKeyName {get;set;}
    }
}