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
    public class MapSchemaController : ControllerBase {
        private MapDesignerContext _mapContext { get; }
        private IBasicEfcoreHelper _efCoreHelper {get;}

        public MapSchemaController (MapDesignerContext mapDesigner,IBasicEfcoreHelper basicEfcoreHelper) {
            _mapContext = mapDesigner;
            _efCoreHelper = basicEfcoreHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetDatasAPI () {
            var dbSets = _efCoreHelper.GetList<MapSchema>(_mapContext);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        public async Task<IActionResult> PatchDataAPI ([FromBody] MapSchema body) {
            try{
                _efCoreHelper.PatchSingle<MapSchema,int>(_mapContext,body,true);
                await _mapContext.SaveChangesAsync ();
               return Ok (JsonConvert.SerializeObject (body, Formatting.Indented)); 
            }
            catch(Exception e){
                return BadRequest (e.ToString());
            }
        }

        [HttpGet ("{Id}")]
        public async Task<IActionResult> GetDataAPI ([FromRoute] int Id) {
            var dbSet = _efCoreHelper.GetSingle<MapSchema,int>(_mapContext,Id);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSet, Formatting.Indented));
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
        public async Task<IActionResult> PatchFullSchemaAPI ([FromBody] MapAllShcema body) {
            try{
                _efCoreHelper.PatchSingle<MapSchema,int>(_mapContext,body.MapSchema,false);
                foreach(var data in body.DataSets){
                    _efCoreHelper.PatchSingle<DataSet,int>(_mapContext,data,false);
                }
                await _mapContext.SaveChangesAsync();
                return Ok ();
            }
            catch(Exception e){
                return BadRequest(e.ToString());
            }
        }

        [HttpDelete ("{Id}")]
        public async Task<IActionResult> DeleteDatasAPI ([FromQuery] int Id) {
            await Task.CompletedTask;
            try{
                _efCoreHelper.RemoveSingle<MapSchema,int>(_mapContext,Id,true);
                return Ok();
            }
            catch(Exception e){
                return BadRequest(e.ToString());
            }
        }
        public T DeepClone<T> (T res, T newT) {
            var properties = typeof (T).GetProperties ();
            foreach (var property in properties) {
                property.SetValue (res, property.GetValue (newT));
            }
            return res;
        }
    }
}