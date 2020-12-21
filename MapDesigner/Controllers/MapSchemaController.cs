using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class MapSchemaController : ControllerBase {
        private MapDesignerContext _mapContext { get; }

        public MapSchemaController (MapDesignerContext mapDesigner) {
            _mapContext = mapDesigner;
        }

        [HttpGet]
        public async Task<IActionResult> GetDatasAPI () {
            var dbSets = _mapContext.Set<MapSchema> ().AsNoTracking ().ToList ();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        public async Task<IActionResult> PatchDataAPI ([FromBody] MapSchema body) {
            var exist = _mapContext.Set<MapSchema> ().SingleOrDefault (x => x.Id == body.Id);
            if (exist == null) {
                _mapContext.MapSchema.Add (body);
            } else {
                var newItem = DeepClone (exist, body);
                _mapContext.Set<MapSchema> ().Update (newItem);
            }
            await _mapContext.SaveChangesAsync ();
            return Ok (JsonConvert.SerializeObject (body, Formatting.Indented));
        }

        [HttpGet ("{Id}")]
        public async Task<IActionResult> GetDataAPI ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<MapSchema> ().SingleOrDefault (x => x.Id == Id);
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

        [HttpPatch ("MapDesigner/{Id}")]
        public async Task<IActionResult> PatchFullSchemaAPI ([FromRoute] int MapId, [FromBody] dynamic body) {
            // try {
            //     var exist = _mapContext.Set<MapSchema> ().SingleOrDefault (x => x.Id == body["MapSchema"].Id);
            //     if (exist == null) {
            //         _mapContext.MapSchema.Add (body);
            //     } else {
            //         var newItem = DeepClone (exist, body);
            //         _mapContext.Set<MapSchema> ().Update (newItem);
            //     }
            //     foreach (var dataset in body["DataSets"]) {
            //         var existd = _mapContext.Set<DataSet> ().SingleOrDefault (x => x.DataSetId == body.DataSetId);
            //         if (exist == null) {
            //             _mapContext.DataSet.Add (body);
            //         } else {
            //             var newItem = DeepClone (exist, body);
            //             _mapContext.Set<DataSet> ().Update (newItem);
            //         }
            //     }
            //     await _mapContext.SaveChangesAsync ();
            // } catch (Exception e) {
            //     return BadRequest (e.ToString ());
            // }
            await Task.CompletedTask;
            return Ok ();
        }

        [HttpDelete ("{Id}")]
        public async Task<IActionResult> DeleteDatasAPI ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<MapSchema> ().Where (x => x.Id == Id).SingleOrDefault ();
            if (dbSet != null) {
                _mapContext.Set<MapSchema> ().Remove (dbSet);
                await _mapContext.SaveChangesAsync ();
                return Ok ();
            } else {
                return NotFound ();
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