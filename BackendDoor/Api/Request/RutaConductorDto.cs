using Newtonsoft.Json;

namespace Api.Request
{
    public class RutaConductorDto
    {

        public int IdUsuario { get; set; }

        public int IdUbicacionOrigen { get; set; }

        public int IdUbicacionDestino { get; set; }

        public List<EncomiendaDto>? Encomiendas { get; set; }
    }
}
