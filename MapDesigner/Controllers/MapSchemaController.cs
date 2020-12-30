using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MapDesigner.Helpers;
using MapDesigner.Models;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class MapSchemaController : BaseController<MapSchema,int> {
        private MapDesignerContext _mapContext { get; }
        private IBasicEfcoreHelper _efCoreHelper {get;}

        public MapSchemaController (MapDesignerContext mapDesigner,IBasicEfcoreHelper basicEfcoreHelper):base(mapDesigner,basicEfcoreHelper) {
            _mapContext = mapDesigner;
            _efCoreHelper = basicEfcoreHelper;
        }
        [HttpGet ("MapDesigner/{Id}")]
        public async Task<IActionResult> GetFullSchemaAPI ([FromRoute] int Id) {
            var dbSet = _mapContext.Set<MapSchema> ().SingleOrDefault (x => x.Id == Id);
            var datas = _mapContext.MapDatas.Where (x => x.MapId == Id).AsNoTracking ().Select (x => x.DataSetId).ToArray ();
            var dataSets = _mapContext.DataSet.Where (x => datas.Contains (x.DataSetId)).AsNoTracking ().ToList ();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (new { MapSchema = dbSet, DataSets = dataSets }, Formatting.Indented));
        }

        [HttpPatch ("MapDesigner")]
        public async Task<IActionResult> PatchFullSchemaAPI ([FromBody] MapDesignInfo body) {
            try{
                _efCoreHelper.PatchSingle<MapSchema>(_mapContext,body.MapSchema,false);
                foreach(var data in body.DataSets){
                    _efCoreHelper.PatchSingle<DataSet>(_mapContext,data,false);
                }
                await _mapContext.SaveChangesAsync();
                return Ok ();
            }
            catch(Exception e){
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("MapProjects")]
        public async Task<IActionResult> GetMapProjects(){
            var projects = new List<MapProject>();
            var mapSchemas = _efCoreHelper.GetList<MapSchema>(_mapContext).ToList();
            var mapDatas = _efCoreHelper.GetList<MapDatas>(_mapContext).ToList();
            foreach(var item in mapSchemas){
                projects.Add(new MapProject(){Map = item,DataSets = mapDatas.Where(x=>x.MapId == item.Id).Select(x => x.DataSetId).ToArray()});
            }
            await Task.CompletedTask;
            return Ok(JsonConvert.SerializeObject(projects,Formatting.Indented));
        }

        [HttpPatch("MapProject")]
        public async Task<IActionResult> SaveMapProject([FromBody] MapProject body){
            _efCoreHelper.PatchSingle<MapSchema>(_mapContext,body.Map,false);
            var currentDatas = _efCoreHelper.GetList<MapDatas>(_mapContext).Where(x =>x.MapId == body.Map.Id).ToList();
            foreach(var data in currentDatas){
                if(body.DataSets.Contains(data.DataSetId)){
                    body.DataSets = body.DataSets.Where(x => x!=data.DataSetId).ToArray();
                    continue;
                }
                else{
                    _efCoreHelper.RemoveSingle<MapDatas,int>(_mapContext,data.Id,true);
                }
            }
            foreach(var data in body.DataSets){
                _efCoreHelper.PatchSingle<MapDatas>(_mapContext, new MapDatas(){Id=0, MapId=body.Map.Id,DataSetId=data},true);
            }
            await _mapContext.SaveChangesAsync();
            return Ok();
        }
    }
}