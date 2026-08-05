using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class DocumentosUsuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdDocumentoUsuario")]
        public int IdDocumentoUsuario { get; set; }

        [Display(Name = "UrlDocumento")]
        [JsonProperty(PropertyName = "UrlDocumento")]
        public string? UrlDocumento { get; set; }

        [Display(Name = "IdUsuario")]
        [Required(ErrorMessage = "El dato {0} es necesario")]
        [JsonProperty(PropertyName = "IdUsuario")]
        public int IdUsuario { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdUsuario")]
        public virtual Usuarios? Usuario { get; set; }

        [Display(Name = "IdTipoDocumento")]
        [Required(ErrorMessage = "El dato {0} es necesario")]
        [JsonProperty(PropertyName = "IdTipoDocumento")]
        public int IdTipoDocumento { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdTipoDocumento")]
        public virtual TiposDocumento? TipoDocumento { get; set; }

        [Display(Name = "IdInformacionConductor")]
        [Required(ErrorMessage = "El dato {0} es necesario")]
        [JsonProperty(PropertyName = "IdInformacionConductor")]
        public int IdInformacionConductor { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdInformacionConductor")]
        public virtual InformacionConductor? InformacionConductor { get; set; }

        [Required(ErrorMessage = "El dato {0} es necesario")]
        [Display(Name = "Verificado")]
        [JsonProperty(PropertyName = "Verificado")]
        public  bool Verificado { get; set; }
    }
}
