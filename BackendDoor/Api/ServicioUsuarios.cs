using Api.Request;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Model;
using System.Reflection.Metadata;

namespace Api
{
    public class ServicioUsuarios
    {
       
        public Usuarios? CrearUsuario(Usuarios usuario,DataContext dtx)
        {
            try
            {
                dtx.Usuarios.Add(usuario);
                dtx.SaveChanges();
                return usuario;
            }
            catch (Exception)
            {
                return null;
            }

        }

        public Usuarios? ActivarUsuario(int idUsuario,bool activar, DataContext dtx)
        {
            try
            {
                var usuario = dtx.Usuarios.First(u => u.IdUsuario == idUsuario);

                if (usuario != null)
                {
                    usuario.Activo = activar;
                    dtx.Entry(usuario).State = EntityState.Modified;
                    dtx.SaveChanges();
                }
                return usuario;
            }
            catch (Exception)
            {
                return null;
            }

        }

        

        public Usuarios? EditarUsuario(Usuarios usuario,int id, DataContext dtx)
        {
            try
            {
                var usuarioEncontrado = dtx.Usuarios.Find(id);
                if (usuarioEncontrado == null)
                {
                    return null;
                }
                usuarioEncontrado.Nombre = usuario.Nombre;
                usuarioEncontrado.PrimerApellido = usuario.PrimerApellido;
                usuarioEncontrado.SegundoApellido = usuario.SegundoApellido;
                usuarioEncontrado.Direccion = usuario.Direccion;
                usuarioEncontrado.Activo = usuario.Activo;
                usuarioEncontrado.Correo = usuario.Correo;
                usuarioEncontrado.FechaNacimiento = usuario.FechaNacimiento;
                usuarioEncontrado.IdTipoUsuario = usuario.IdTipoUsuario;
                usuarioEncontrado.UrlImagen = usuario.UrlImagen;
                dtx.Entry(usuarioEncontrado).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                dtx.SaveChanges();

          
                return usuarioEncontrado;
            }
            catch (Exception)
            {
                return null;
            }

        }

        public UsuarioDto ObtenerUsuario(string numeroCelular, DataContext dtx, IMapper mapper)
        {
            try
            {
                var listadoUsuarios = dtx.Usuarios.Where(u => u.NumeroCelular == numeroCelular);

                var usuario =  listadoUsuarios.First(u => u.NumeroCelular == numeroCelular);
                var model = mapper.Map<UsuarioDto>(usuario);
               

                if (listadoUsuarios.Any( u => u.IdTipoUsuario == 2) )
                {
                    model.EsConductor = true;
                }



                return model;
            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<TiposUsuario>? ObtenerTiposUsuario( DataContext dtx)
        {
            try
            {
                return dtx.TiposUsuario.ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }

        public DocumentoDto ObtenerDocumentosUsuario(int  idUsuario, int idTipoDocumento, DataContext dtx, IMapper mapper)
        {
            try
            {
                var documento = new DocumentoDto();
                var listadoDocumentosUsuario = dtx.DocumentosUsuario.Where(u => u.IdUsuario == idUsuario && u.IdTipoDocumento == idTipoDocumento).ToList();
                if (listadoDocumentosUsuario.Count() > 0)
                {
                    var informacionConducto = dtx.InformacionConductor.First(u => u.IdInformacionConductor == listadoDocumentosUsuario.First().IdInformacionConductor);

                    documento.Licencia = informacionConducto.Licencia;
                    documento.Placa = informacionConducto.Placa;
                    documento.TipoVehiculo = informacionConducto.TipoVehiculo;
                    List<string> Urls = new List<string>();
                    foreach (var item in listadoDocumentosUsuario)
                    {
                        Urls.Add(item.UrlDocumento);

                    }
                    documento.UrlDocumentos = Urls;
                }

                
                return documento;
            }
            catch (Exception)
            {
                return null;
            }

        }


        

        public List<DocumentosUsuario>? GuardarDocumentos(List<DocumentosUsuario> documentos, List<DocumentosUsuario> documentosEncontrados, InformacionConductor informacionConductor , DataContext dtx)
        {
            try
            {

                using (var context = dtx)
                {

                    using (var transaction = context.Database.BeginTransaction())
                    {
                        try
                        {
                            if (informacionConductor.IdInformacionConductor != 0)
                            {
                                dtx.Entry(informacionConductor).State = EntityState.Modified;
                            }
                            else
                            {
                                dtx.InformacionConductor.Add(informacionConductor);
                            }

                            dtx.SaveChanges();

                            if (documentosEncontrados.Count >0 )
                            {
                                dtx.DocumentosUsuario.RemoveRange(documentosEncontrados);
                                dtx.SaveChanges();
                            }
                           
                            foreach (var documento in documentos)
                            {
                                documento.IdInformacionConductor = informacionConductor.IdInformacionConductor;
                                dtx.DocumentosUsuario.Add(documento);
                                dtx.SaveChanges();
                            }

                          
                            transaction.Commit();
                            return documentos;

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



    }
}
