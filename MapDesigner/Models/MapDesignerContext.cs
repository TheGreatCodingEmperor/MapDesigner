
using Microsoft.EntityFrameworkCore;

public class MapDesignerContext : DbContext
{
    public MapDesignerContext(DbContextOptions<MapDesignerContext> options)
        : base(options)
    { }
    public DbSet<MapSchema> MapSchema { get; set; }
    public DbSet<DataSet> DataSet { get; set; }
}