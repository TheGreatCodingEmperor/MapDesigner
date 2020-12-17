using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class WeatherForecastController : ControllerBase {
        private static readonly string[] Summaries = new [] {
            "Freezing",
            "Bracing",
            "Chilly",
            "Cool",
            "Mild",
            "Warm",
            "Balmy",
            "Hot",
            "Sweltering",
            "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private MapDesignerContext _mapDesignerContext { get; }

        public WeatherForecastController (ILogger<WeatherForecastController> logger, MapDesignerContext mapDesigner) {
            _logger = logger;
            _mapDesignerContext = mapDesigner;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get () {
            var rng = new Random ();
            return Enumerable.Range (1, 5).Select (index => new WeatherForecast {
                    Date = DateTime.Now.AddDays (index),
                        TemperatureC = rng.Next (-20, 55),
                        Summary = Summaries[rng.Next (Summaries.Length)]
                })
                .ToArray ();
        }

        [HttpGet ("testdb")]
        public async Task<IActionResult> TestDB () {
            var result =_mapDesignerContext.MapSchema.ToList (); 
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject(result,Formatting.Indented));
        }

        [HttpGet ("schema")]
        public async Task<IActionResult> GetSchema ([FromQuery] int Id) {
            var result = _mapDesignerContext.MapSchema.Where(x => x.Id == Id).SingleOrDefault();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject(result,Formatting.Indented));
        }

        [HttpPost ("SaveNewMap")]
        public async Task<IActionResult> SaveNewMap ([FromBody] MapSchema map) {
            _mapDesignerContext.MapSchema.Add (map);
            await _mapDesignerContext.SaveChangesAsync ();
            return Ok (JsonConvert.SerializeObject(map,Formatting.Indented));
        }

        [HttpPatch ("SaveMap")]
        public async Task<IActionResult> SaveMap ([FromBody] MapSchema map) {
            var exist = _mapDesignerContext.MapSchema.Where (x => x.Id == map.Id).SingleOrDefault ();
            if (exist == null) {
                _mapDesignerContext.MapSchema.Add (map);
            } else {
                var newItem = DeepClone<MapSchema>(exist,map);
                _mapDesignerContext.MapSchema.Update (newItem);
            }
            await _mapDesignerContext.SaveChangesAsync ();
            return Ok (JsonConvert.SerializeObject(map, Formatting.Indented));
        }

        public T DeepClone<T> (T res, T newT)
        {
            var properties = typeof (T).GetProperties();
            foreach(var property in properties){
                property.SetValue(res,property.GetValue(newT));
            }
            return res;
        }
    }
}