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
    public class DataSetController : ControllerBase {
        private MapDesignerContext _mapContext { get; }

        public DataSetController (MapDesignerContext mapDesigner) {
            _mapContext = mapDesigner;
        }

        [HttpGet]
        public async Task<IActionResult> GetDatas () {
            var dbSets = _mapContext.Set<DataSet> ().AsNoTracking ().ToList ();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        public async Task<IActionResult> PatchData ([FromBody] DataSet body) {
            var exist = _mapContext.Set<DataSet> ().SingleOrDefault (x => x.DataSetId == body.DataSetId);
            if (exist == null) {
                _mapContext.DataSet.Add (body);
            } else {
                var newItem = DeepClone (exist, body);
                _mapContext.Set<DataSet> ().Update (newItem);
            }
            await _mapContext.SaveChangesAsync ();
            return Ok (JsonConvert.SerializeObject (body, Formatting.Indented));
        }

        [HttpGet ("{Id}")]
        public async Task<IActionResult> GetData ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<DataSet> ().SingleOrDefault (x => x.DataSetId == Id);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSet, Formatting.Indented));
        }

        [HttpDelete ("{Id}")]
        public async Task<IActionResult> DeleteDatas ([FromQuery] int Id) {
            var dbSet = _mapContext.Set<DataSet> ().Where (x => x.DataSetId == Id).AsNoTracking ().SingleOrDefault ();
            if (dbSet != null) {
                _mapContext.Set<DataSet> ().Remove (dbSet);
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