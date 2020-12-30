using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using MapDesigner.Helpers;
using MapDesigner.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class MapDatasController : BaseController<MapDatas, int> {

        private MapDesignerContext _mapContext { get; }
        private readonly IBasicEfcoreHelper _efcorHelper;
        private IMapDesignHelper _mapDesignHelper { get; }

        public MapDatasController (MapDesignerContext mapDesigner,
            IBasicEfcoreHelper efcoreHelper, IMapDesignHelper mapDesignHelper) : base (mapDesigner, efcoreHelper) {
            _mapContext = mapDesigner;
            _efcorHelper = efcoreHelper;
            _mapDesignHelper = mapDesignHelper;
        }

        [HttpGet ("datasets/{mapId}")]
        /// <summary>
        /// 取得該專案所有 dataset ID 
        /// </summary>
        /// <param name="mapId">專案編號</param>
        /// <returns></returns>
        public async Task<IActionResult> GetMapDataSets ([FromRoute] int mapId) {
            var mapSchema = _efcorHelper.GetList<MapDatas> (_mapContext).Where (x => x.MapId == mapId).Select (x => x.DataSetId).ToList ();
            await Task.CompletedTask;
            return Ok (mapSchema);
        }

        [HttpGet ("datasets/schema/{mapId}")]
        /// <summary>
        /// 取得該專案所有 dataset ID 
        /// </summary>
        /// <param name="mapId">專案編號</param>
        /// <returns></returns>
        public async Task<IActionResult> GetMapDataSetsSchema ([FromRoute] int mapId) {
            var mapSchema = _efcorHelper.GetList<MapDatas> (_mapContext).Where (x => x.MapId == mapId);
            var projectDataSets = mapSchema.Select (x => x.DataSetId).ToList ();

            var result = from table in _efcorHelper.GetList<MapDatas> (_mapContext).Where (x => x.MapId == mapId)
                        join ds in _efcorHelper.GetList<DataSet> (_mapContext)
                        on table.DataSetId equals ds.DataSetId
                        select new {
                            Name = ds.Name,
                            TableId = table.Id,
                            Schama = ds.Schema,
                            Left = table.Left,
                            Top = table.Top
                        };

            var schemas = _efcorHelper.GetList<DataSet> (_mapContext).Where (x => projectDataSets.Contains (x.DataSetId)).ToList ();

            var lines = _efcorHelper.GetList<JoinLines>(_mapContext).Where(x=>x.MapId == mapId).ToList();
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (new{Tables = result,Lines = lines}, Formatting.Indented));
        }

        [HttpPost ("innerJoin")]
        public async Task<IActionResult> GetInnerJoin ([FromBody] JoinDataSet body) {
            var result = _mapDesignHelper.InnerJoin (body.a, body.b, body.aKeyNam, body.bKeyName);
            await Task.CompletedTask;
            return Ok (result);
        }

        [HttpPost ("multiJoin")]
        public async Task<IActionResult> MultiJoin ([FromBody] SqlQuery body) {
            var datas = JsonConvert.DeserializeObject<Dictionary<string, List<Dictionary<string, object>>>> (body.Datas.ToString ());
            var result = _mapDesignHelper.MultiJoin (datas, body.Lines);
            if (result.Status != 200) {
                return BadRequest (result.Result);
            }
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (result.Result, Formatting.Indented));
        }

        [HttpPost ("DataSet/MultiJoin")]
        public async Task<IActionResult> DataSetMultiJoin ([FromBody] DataSetJoinQuery body) {
            var dataSetIds = _efcorHelper.GetList<MapDatas> (_mapContext).Where (x => x.MapId == body.MapId).AsNoTracking ().Select (x => x.DataSetId).ToList ();
            var dataSets = _efcorHelper.GetList<DataSet> (_mapContext).Where (x => dataSetIds.Contains (x.DataSetId) && x.DataType != 1).AsNoTracking ().ToList ();
            var datas = new Dictionary<string, List<Dictionary<string, object>>> ();
            foreach (var data in dataSets) {
                if (data.DataType != 1)
                    datas[data.Name] = JsonConvert.DeserializeObject<List<Dictionary<string, object>>> (data.Data);
            }
            var result = _mapDesignHelper.MultiJoin (datas, body.Lines);
            if (result.Status != 200) {
                return BadRequest (result.Result);
            }
            await Task.CompletedTask;
            return Ok (JsonConvert.SerializeObject (result.Result, Formatting.Indented));
        }
    }
    public class JoinDataSet {
        public SqlQueryData a { get; set; }
        public SqlQueryData b { get; set; }
        public string aKeyNam { get; set; }
        public string bKeyName { get; set; }
    }
}