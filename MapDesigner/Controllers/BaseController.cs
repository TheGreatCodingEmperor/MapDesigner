using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using MapDesigner.Helpers;
using System;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class BaseController<T,Tkey> : ControllerBase 
    where T:class{
        private readonly MapDesignerContext _mapContext;
        private IBasicEfcoreHelper _efCoreHelper {get;}
        public BaseController(MapDesignerContext mapContext, IBasicEfcoreHelper efCoreHelper){
            _mapContext = mapContext;
            _efCoreHelper = efCoreHelper;
        }
        [HttpGet]
        public virtual async Task<IActionResult> GetDatasAPI () {
            var dbSets = _efCoreHelper.GetList<T>(_mapContext).ToList();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSets, Formatting.Indented));
        }

        [HttpPatch]
        public virtual async Task<IActionResult> PatchDataAPI ([FromBody] T body) {
            try{
                _efCoreHelper.PatchSingle<T>(_mapContext,body,true);
                await _mapContext.SaveChangesAsync ();
               return Ok (JsonConvert.SerializeObject (body, Formatting.Indented)); 
            }
            catch(Exception e){
                return BadRequest (e.ToString());
            }
        }

        [HttpGet ("{Id}")]
        public virtual async Task<IActionResult> GetDataAPI ([FromRoute] Tkey Id) {
            var dbSet = _efCoreHelper.GetSingle<T,Tkey>(_mapContext,Id);
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (dbSet, Formatting.Indented));
        }

        [HttpDelete ("{Id}")]
        public virtual async Task<IActionResult> DeleteDatasAPI ([FromQuery] Tkey Id) {
            await Task.CompletedTask;
            try{
                _efCoreHelper.RemoveSingle<T,Tkey>(_mapContext,Id,true);
                return Ok();
            }
            catch(Exception e){
                return BadRequest(e.ToString());
            }
        }
        public  virtual Tobj DeepClone<Tobj> (Tobj res, Tobj newT) {
            var properties = typeof (Tobj).GetProperties ();
            foreach (var property in properties) {
                property.SetValue (res, property.GetValue (newT));
            }
            return res;
        }
    }
}