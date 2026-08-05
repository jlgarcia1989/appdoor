using Api.Request;
using AutoMapper;
using Model;

namespace Api
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
           
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<UsuarioDto, Usuarios>();
                cfg.CreateMap<Usuarios, UsuarioDto>();
                cfg.CreateMap<Encomiendas, EncomiendaDto>();
                cfg.CreateMap<EncomiendaDto , Encomiendas>();
                cfg.CreateMap<RutasReserva, ReservaRutaDto>();
                cfg.CreateMap<ReservaRutaDto, RutasReserva>();
                cfg.CreateMap<DocumentosUsuario, DocumentoDto>();
                cfg.CreateMap<DocumentoDto,DocumentosUsuario>();
            });
        
            var mapper = new Mapper(config);
            return mapper;
        }
    
}
}
