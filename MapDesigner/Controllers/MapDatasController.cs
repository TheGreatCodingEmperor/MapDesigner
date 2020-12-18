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
    public class MapDatasController : ControllerBase {
        private MapDesignerContext _mapContext { get; }

        public MapDatasController (MapDesignerContext mapDesigner) {
            _mapContext = mapDesigner;
        }

        [HttpGet]
        public async Task<IActionResult> GetDatas () {
            var dbSets = _mapContext.Set<MapDatas> ().AsNoTracking ().ToList ();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        public async Task<IActionResult> PatchData ([FromBody] MapDatas body) {
            var exist = _mapContext.Set<MapDatas> ().SingleOrDefault (x => x.Id == body.Id);
            if (exist == null) {
                _mapContext.MapDatas.Add (exist);
            } else {
                // var newItem = DeepClone (exist, body);
                _mapContext.Set<MapDatas> ().Update (body);
            }
            await _mapContext.SaveChangesAsync ();
            return Ok (JsonConvert.SerializeObject (exist, Formatting.Indented));
        }

        [HttpGet ("{Id}")]
        public async Task<IActionResult> GetData ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<MapDatas> ().SingleOrDefault (x => x.Id == Id);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSet, Formatting.Indented));
        }

        [HttpDelete ("{Id}")]
        public async Task<IActionResult> DeleteDatas ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<MapDatas> ().Where (x => x.Id == Id).SingleOrDefault ();
            if (dbSet != null) {
                _mapContext.Set<MapDatas> ().Remove (dbSet);
                await _mapContext.SaveChangesAsync ();
                return Ok ();
            } else {
                return NotFound ();
            }
        }
    }
}