using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Model.Migrations
{
    /// <inheritdoc />
    public partial class Reset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EstadosReserva",
                columns: table => new
                {
                    IdEstadoReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadosReserva", x => x.IdEstadoReserva);
                });

            migrationBuilder.CreateTable(
                name: "EstadosRuta",
                columns: table => new
                {
                    IdEstadoRuta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadosRuta", x => x.IdEstadoRuta);
                });

            migrationBuilder.CreateTable(
                name: "TiposDocumento",
                columns: table => new
                {
                    IdTipoDocumento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposDocumento", x => x.IdTipoDocumento);
                });

            migrationBuilder.CreateTable(
                name: "TiposEncomienda",
                columns: table => new
                {
                    IdTipoEncomienda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposEncomienda", x => x.IdTipoEncomienda);
                });

            migrationBuilder.CreateTable(
                name: "TiposReserva",
                columns: table => new
                {
                    IdTipoReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposReserva", x => x.IdTipoReserva);
                });

            migrationBuilder.CreateTable(
                name: "TiposUsuario",
                columns: table => new
                {
                    IdTipoUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposUsuario", x => x.IdTipoUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Ubicaciones",
                columns: table => new
                {
                    IdUbicacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latitud = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Longitud = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ubicaciones", x => x.IdUbicacion);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrimerApellido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SegundoApellido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    NumeroCelular = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UrlImagen = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroIdentificacion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdTipoUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_TiposUsuario_IdTipoUsuario",
                        column: x => x.IdTipoUsuario,
                        principalTable: "TiposUsuario",
                        principalColumn: "IdTipoUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DocumentosUsuario",
                columns: table => new
                {
                    IdDocumentoUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    UsuarioIdUsuario = table.Column<int>(type: "int", nullable: true),
                    IdTipoDocumento = table.Column<int>(type: "int", nullable: false),
                    TipoDocumentoIdTipoDocumento = table.Column<int>(type: "int", nullable: true),
                    Verificado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentosUsuario", x => x.IdDocumentoUsuario);
                    table.ForeignKey(
                        name: "FK_DocumentosUsuario_TiposDocumento_TipoDocumentoIdTipoDocumento",
                        column: x => x.TipoDocumentoIdTipoDocumento,
                        principalTable: "TiposDocumento",
                        principalColumn: "IdTipoDocumento");
                    table.ForeignKey(
                        name: "FK_DocumentosUsuario_Usuarios_UsuarioIdUsuario",
                        column: x => x.UsuarioIdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "RutasConductor",
                columns: table => new
                {
                    IdRutaConductor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdUsuario = table.Column<int>(type: "int", nullable: true),
                    IdEstadoRuta = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RutasConductor", x => x.IdRutaConductor);
                    table.ForeignKey(
                        name: "FK_RutasConductor_EstadosRuta_IdEstadoRuta",
                        column: x => x.IdEstadoRuta,
                        principalTable: "EstadosRuta",
                        principalColumn: "IdEstadoRuta",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RutasConductor_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "RutasReserva",
                columns: table => new
                {
                    IdRutaReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdRutaConductor = table.Column<int>(type: "int", nullable: false),
                    CantidadPasajeros = table.Column<int>(type: "int", nullable: false),
                    DireccionOrigen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DireccionDestino = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdTipoReserva = table.Column<int>(type: "int", nullable: false),
                    IdEstadoReserva = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RutasReserva", x => x.IdRutaReserva);
                    table.ForeignKey(
                        name: "FK_RutasReserva_EstadosReserva_IdEstadoReserva",
                        column: x => x.IdEstadoReserva,
                        principalTable: "EstadosReserva",
                        principalColumn: "IdEstadoReserva",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RutasReserva_RutasConductor_IdRutaConductor",
                        column: x => x.IdRutaConductor,
                        principalTable: "RutasConductor",
                        principalColumn: "IdRutaConductor",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RutasReserva_TiposReserva_IdTipoReserva",
                        column: x => x.IdTipoReserva,
                        principalTable: "TiposReserva",
                        principalColumn: "IdTipoReserva",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RutasReserva_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UbicacionesRuta",
                columns: table => new
                {
                    IdUbicacionRuta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdUbicacion = table.Column<int>(type: "int", nullable: false),
                    IdRutaConductor = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UbicacionesRuta", x => x.IdUbicacionRuta);
                    table.ForeignKey(
                        name: "FK_UbicacionesRuta_RutasConductor_IdRutaConductor",
                        column: x => x.IdRutaConductor,
                        principalTable: "RutasConductor",
                        principalColumn: "IdRutaConductor");
                    table.ForeignKey(
                        name: "FK_UbicacionesRuta_Ubicaciones_IdUbicacion",
                        column: x => x.IdUbicacion,
                        principalTable: "Ubicaciones",
                        principalColumn: "IdUbicacion",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Encomiendas",
                columns: table => new
                {
                    IdEncomienda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Peso = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dimensiones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdTipoEncomienda = table.Column<int>(type: "int", nullable: false),
                    IdRutaReserva = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Encomiendas", x => x.IdEncomienda);
                    table.ForeignKey(
                        name: "FK_Encomiendas_RutasReserva_IdRutaReserva",
                        column: x => x.IdRutaReserva,
                        principalTable: "RutasReserva",
                        principalColumn: "IdRutaReserva");
                    table.ForeignKey(
                        name: "FK_Encomiendas_TiposEncomienda_IdTipoEncomienda",
                        column: x => x.IdTipoEncomienda,
                        principalTable: "TiposEncomienda",
                        principalColumn: "IdTipoEncomienda",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario",
                column: "TipoDocumentoIdTipoDocumento");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_UsuarioIdUsuario",
                table: "DocumentosUsuario",
                column: "UsuarioIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Encomiendas_IdRutaReserva",
                table: "Encomiendas",
                column: "IdRutaReserva");

            migrationBuilder.CreateIndex(
                name: "IX_Encomiendas_IdTipoEncomienda",
                table: "Encomiendas",
                column: "IdTipoEncomienda");

            migrationBuilder.CreateIndex(
                name: "IX_RutasConductor_IdEstadoRuta",
                table: "RutasConductor",
                column: "IdEstadoRuta");

            migrationBuilder.CreateIndex(
                name: "IX_RutasConductor_IdUsuario",
                table: "RutasConductor",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_RutasReserva_IdEstadoReserva",
                table: "RutasReserva",
                column: "IdEstadoReserva");

            migrationBuilder.CreateIndex(
                name: "IX_RutasReserva_IdRutaConductor",
                table: "RutasReserva",
                column: "IdRutaConductor");

            migrationBuilder.CreateIndex(
                name: "IX_RutasReserva_IdTipoReserva",
                table: "RutasReserva",
                column: "IdTipoReserva");

            migrationBuilder.CreateIndex(
                name: "IX_RutasReserva_IdUsuario",
                table: "RutasReserva",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_UbicacionesRuta_IdRutaConductor",
                table: "UbicacionesRuta",
                column: "IdRutaConductor");

            migrationBuilder.CreateIndex(
                name: "IX_UbicacionesRuta_IdUbicacion",
                table: "UbicacionesRuta",
                column: "IdUbicacion");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_IdTipoUsuario",
                table: "Usuarios",
                column: "IdTipoUsuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentosUsuario");

            migrationBuilder.DropTable(
                name: "Encomiendas");

            migrationBuilder.DropTable(
                name: "UbicacionesRuta");

            migrationBuilder.DropTable(
                name: "TiposDocumento");

            migrationBuilder.DropTable(
                name: "RutasReserva");

            migrationBuilder.DropTable(
                name: "TiposEncomienda");

            migrationBuilder.DropTable(
                name: "Ubicaciones");

            migrationBuilder.DropTable(
                name: "EstadosReserva");

            migrationBuilder.DropTable(
                name: "RutasConductor");

            migrationBuilder.DropTable(
                name: "TiposReserva");

            migrationBuilder.DropTable(
                name: "EstadosRuta");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "TiposUsuario");
        }
    }
}
