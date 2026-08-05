using Model;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Api.Request
{
    public class ReservaRutaDto
    {

        public DateTime FechaHora { get; set; }
        public int IdUsuario { get; set; }
        public int? IdRutaConductor { get; set; }
        public int CantidadPasajeros { get; set; }
        public string DireccionOrigen { get; set; }
        public string DireccionDestino { get; set; }
        public int IdTipoReserva { get; set; }
        public int IdEstadoReserva { get; set; }
        public string Descripcion { get; set; }
        public List<EncomiendaDto>? Encomiendas { get; set; }

    }
}
