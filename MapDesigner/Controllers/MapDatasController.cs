using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MapDesigner.Helpers;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class MapDatasController : BaseController<MapDatas,int>{

        private MapDesignerContext _mapContext { get; }
        private readonly IBasicEfcoreHelper _efcorHelper;

        public MapDatasController (MapDesignerContext mapDesigner, 
            IBasicEfcoreHelper efcoreHelper):base( mapDesigner, efcoreHelper) {
            _mapContext = mapDesigner;
            _efcorHelper = efcoreHelper;
        }

        [HttpGet("datasets/{mapId}")]
        public async Task<IActionResult> GetMapDataSets([FromRoute] int mapId){
            var mapSchema = _efcorHelper.GetList<MapDatas>(_mapContext).Where(x => x.MapId == mapId).Select(x => x.DataSetId).ToList();
            await Task.CompletedTask;
            return Ok(mapSchema);
        }
    }
}