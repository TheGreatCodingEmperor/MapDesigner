using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class BaseController<T,Tkey> : ControllerBase 
    where T:class{
        private readonly MapDesignerContext _mapContext;
        public BaseController(MapDesignerContext mapContext){
            _mapContext = mapContext;
        }
        // [HttpGet]
        // public async Task<IActionResult> GetDatas(){
        //     var dbSets = _mapContext.Set<T>().AsNoTracking().ToList();
        //     await Task.CompletedTask;
        //     return Ok(JsonConvert.SerializeObject(dbSets,Formatting.Indented));
        // }
        // [HttpPatch]
        // public async Task<IActionResult> PatchData([FromBody] T body){
        //    var exist = _mapContext.Set<T>().SingleOrDefault (x => x.Id == body.Id);
        //     if (exist == null) {
        //         _mapContext.MapSchema.Add (exist);
        //     } else {
        //         var newItem = DeepClone(exist,exist);
        //         _mapContext.Set<T>().Update (newItem);
        //     }
        //     await _mapContext.SaveChangesAsync ();
        //     return Ok (JsonConvert.SerializeObject(exist, Formatting.Indented));
        // }
        // [HttpGet("{Id}")]
        // public async Task<IActionResult> GetData([FromQuery] Tkey Id){
        //     var dbSet = _mapContext.Set<T>().SingleOrDefault(x => x.Id == Id);
        //     await Task.CompletedTask;
        //     return Ok(JsonConvert.SerializeObject(dbSet,Formatting.Indented));
        // }
        // [HttpDelete("{Id}")]
        // public async Task<IActionResult> DeleteDatas([FromQuery] int Id){
        //     var dbSet = _mapContext.Set<T>().Where(x => x.Id == Id).SingleOrDefault();
        //     if(dbSet!=null){
        //         _mapContext.Set<T>().Remove(dbSet);
        //         await _mapContext.SaveChangesAsync();
        //         return Ok();
        //     }
        //     else{
        //         return NotFound();
        //     }
        // }
        // public T DeepClone (T res, T newT)
        // {
        //     var properties = typeof (T).GetProperties();
        //     foreach(var property in properties){
        //         property.SetValue(res,property.GetValue(newT));
        //     }
        //     return res;
        // }
    }
}