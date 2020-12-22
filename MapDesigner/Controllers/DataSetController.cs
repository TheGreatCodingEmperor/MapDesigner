using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using MapDesigner.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MapDesigner.Controllers {
    [ApiController]
    [Route ("[controller]")]
    public class DataSetController : BaseController<DataSet,int> {
        private MapDesignerContext _mapContext { get; }
        private readonly IBasicEfcoreHelper _efcorHelper;
        public DataSetController ( 
            MapDesignerContext mapDesigner, 
            IBasicEfcoreHelper efcoreHelper):base( mapDesigner, efcoreHelper) {
            _mapContext = mapDesigner;
            _efcorHelper = efcoreHelper;
        }
    }
}