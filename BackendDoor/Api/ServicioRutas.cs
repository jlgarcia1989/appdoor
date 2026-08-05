using Api.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Model;
using System.Runtime.Intrinsics.Arm;
using System.Text.RegularExpressions;

namespace Api
{
    public class ServicioRutas
    {
        public List<Ubicaciones> ObtenerUbicacionesReserva(int idUsuario,int idEstadoReserva, DataContext dtx)
        {
            try
            {
                var ubicacionUsuario = (from rr in dtx.RutasReserva
                                       join rc in dtx.RutasConductor on rr.IdRutaConductor equals rc.IdRutaConductor
                                       join ur in dtx.UbicacionesRuta on rc.IdRutaConductor equals ur.IdRutaConductor
                                       join u in dtx.Ubicaciones on ur.IdUbicacion equals u.IdUbicacion
                                       where rr.IdUsuario == idUsuario && rr.IdEstadoReserva == idEstadoReserva
                                        select u).ToList();
                return ubicacionUsuario;
            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<Ubicaciones>? ObtenerUbicaciones( DataContext dtx)
        {
            try
            {
                return dtx.Ubicaciones.ToList();

            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<RutasConductor>? ObtenerRutasConductor(int idUsuario, int idEstadoRuta,DataContext dtx)
        {
            try
            {

                return dtx.RutasConductor.Where(u => u.IdUsuario == idUsuario && u.IdEstadoRuta== idEstadoRuta).ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }

        public RutasConductor CrearReservaRuta(ReservaRutaDto rutaReserva, AutoMapper.IMapper mapper, DataContext dtx)
        {
            try
            {

                using (var context = dtx)
                {

                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                      
                        var model = mapper.Map<RutasReserva>(rutaReserva);
                        RutasConductor ruta;
                        var rutasEncontradas = dtx.RutasConductor.Where(u => u.Descripcion.Trim() == rutaReserva.Descripcion.Trim()).ToList();
                        if (rutasEncontradas.Count > 0)
                        {
                            Random rnd = new Random();
                            int index = rnd.Next(rutasEncontradas.Count);
                            ruta = rutasEncontradas[index];
                            model.IdRutaConductor = ruta.IdRutaConductor;
                            dtx.RutasReserva.Add(model);
                            }
                        else
                        {
                            ruta = new RutasConductor { Descripcion = rutaReserva.Descripcion, IdEstadoRuta = 3 };
                            dtx.RutasConductor.Add(ruta);
                            dtx.SaveChanges();
                            model.IdRutaConductor = ruta.IdRutaConductor;
                            dtx.RutasReserva.Add(model);
                            }
                            dtx.SaveChanges();
                            transaction.Commit();
                            return ruta;

                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return null;
                        }
                    }

                }
            }
            catch (Exception)
            {
                return null;
            }

        }

        public RutasReserva CancelarReservaRuta(int idReservaRuta,  DataContext dtx)
        {
            try
            {

                var rr =  dtx.RutasReserva.Where(u => u.IdRutaReserva  == idReservaRuta ).FirstOrDefault () ;
                
                if (rr != null)
                {
                    rr.IdEstadoReserva = 2;
                    dtx.Entry(rr).State = EntityState.Modified;
                    dtx.SaveChanges();
                }
              
                return rr;
            }
            catch (Exception)
            {
                return null;
            }

        }

        


        public List<UbicacionesRuta>? CrearRutaConductor(RutaConductorDto rutaConductor, DataContext dtx)
        {
            try
            {

                using (var context = dtx)
                {

                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            string descripcion = "";
                            var ubicaciones = (from u in context.Ubicaciones
                                              where u.IdUbicacion == rutaConductor.IdUbicacionOrigen || u.IdUbicacion == rutaConductor.IdUbicacionDestino
                                              select u ).ToList();

                            descripcion = string.Concat(ubicaciones.First( u => u.IdUbicacion == rutaConductor.IdUbicacionOrigen).Nombre , "-", ubicaciones.First(u => u.IdUbicacion == rutaConductor.IdUbicacionDestino).Nombre );

                            var validarExistencia = dtx.RutasConductor.Any(rc => rc.Descripcion.Equals(descripcion) && rc.IdEstadoRuta == 1 && rc.IdUsuario== rutaConductor.IdUsuario);

                            if (validarExistencia)
                            {
                                return null;
                            }

                            var ruta = context.RutasConductor.Add(new RutasConductor() { Descripcion  = descripcion, IdEstadoRuta=1, IdUsuario = rutaConductor.IdUsuario });
                            context.SaveChanges();
                            foreach (var ubicacion in ubicaciones)
                            {
                                context.UbicacionesRuta.Add(new UbicacionesRuta()
                                {
                                    IdRutaConductor = ruta.Entity.IdRutaConductor,
                                    IdUbicacion= ubicacion.IdUbicacion,
                                    
                                });
                            }
                            context.SaveChanges();

                            transaction.Commit();

                            return context.UbicacionesRuta.ToList();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                          
                        }
                    }
                }
                return null;

            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<EstadosRuta> ObtenerEstadosRuta(DataContext dtx)
        {
            try
            {

                return dtx.EstadosRuta.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<EstadosReserva> ObtenerEstadosReserva(DataContext dtx)
        {

            try
            {

                return dtx.EstadosReserva.ToList();
            }
            catch (Exception)
            {
                return null;
            }
         
        }

        public List<TiposReserva> ObtenerTiposReserva(DataContext dtx)
        {

            try
            {

                return dtx.TiposReserva.ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }


        public object? ObtenerReservasPorUsuario(int idUsuario,int idtipoUsuario,int idRutaConductor, DataContext context)
        {
            try
            {
               var  e =  from dr in context.RutasReserva  join
                         rc in context.RutasConductor  on dr.IdRutaConductor equals rc.IdRutaConductor
                         where (idtipoUsuario == 1 ? dr.IdUsuario == idUsuario && dr.FechaHora >= DateTime.Now.AddDays(-60) : dr.IdRutaConductor == idRutaConductor)
                       select new
                       {
                           idReserva = dr.IdRutaReserva,
                           conductor = dr.RutaConductor.Usuario.Nombre ,
                           descripcionRuta = dr.RutaConductor.Descripcion,
                           idEstadoRuta = dr.RutaConductor.IdEstadoRuta,
                           descripcionEstado = dr.EstadoReserva.Descripcion  ,
                           idEstadoReserva = dr.IdEstadoReserva,
                           fechaHora = dr.FechaHora,
                           idTipoReserva = dr.IdTipoReserva,
                           cantidadPasajeros= dr.CantidadPasajeros ,
                           direccionOrigen =dr.DireccionOrigen ,
                           direccionDestino = dr.DireccionDestino,
                           encomiendas = dr.Encomiendas 

                       };

                if (idtipoUsuario != 1)
                {
                    e = e.GroupBy(p => p.idReserva).Select(grp => grp.FirstOrDefault());
                }
                return e;

            }
            catch (Exception)
            {
                return null;
            }
        }

       
    }
}
