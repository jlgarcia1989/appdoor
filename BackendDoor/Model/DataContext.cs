using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class DataContext : DbContext
    {
        const string connectionString = "workstation id=doordb1.mssql.somee.com;packet size=4096;user id=vrcdev_SQLLogin_1;pwd=imr1y2j85j;data source=doordb1.mssql.somee.com;persist security info=False;initial catalog=doordb1;TrustServerCertificate=True";
       // const string connectionString = "Data Source=.;Initial Catalog=doorDB;Integrated Security=True;TrustServerCertificate=True;User Id=sa;Password=PazziSoftware*";
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }
        public DataContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            //if (!optionsBuilder.IsConfigured)
            //{
            optionsBuilder.UseSqlServer(connectionString);
                base.OnConfiguring(optionsBuilder);
            //}
        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var cascadeFKs = modelBuilder.Model.GetEntityTypes()
       .SelectMany(t => t.GetForeignKeys())
       .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

            foreach (var fk in cascadeFKs)
                fk.DeleteBehavior = DeleteBehavior.Restrict;

            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
        }

        public DbSet<Usuarios> Usuarios { get; set; }

        public DbSet<TiposDocumento> TiposDocumento { get; set; }

        public DbSet<TiposUsuario> TiposUsuario { get; set; }

        public DbSet<RutasConductor> RutasConductor { get; set; }

        public DbSet<UbicacionesRuta> UbicacionesRuta { get; set; }

        public DbSet<EstadosRuta> EstadosRuta { get; set; }

        public DbSet<Ubicaciones> Ubicaciones { get; set; }

        public DbSet<TiposReserva> TiposReserva { get; set; }

        public DbSet<EstadosReserva> EstadosReserva { get; set; }

        public DbSet<RutasReserva> RutasReserva { get; set; }

        public DbSet<TiposEncomienda> TiposEncomienda { get; set; }

        public DbSet<Encomiendas> Encomiendas { get; set; }

        public DbSet<DocumentosUsuario> DocumentosUsuario { get; set; }

        public DbSet<InformacionConductor> InformacionConductor { get; set; }

    }
}
