using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Model.Migrations
{
    /// <inheritdoc />
    public partial class initial9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Licencia",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "Placa",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "TipoVehiculo",
                table: "DocumentosUsuario");

            migrationBuilder.AddColumn<int>(
                name: "IdInformacionConductor",
                table: "DocumentosUsuario",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InformacionConductor",
                columns: table => new
                {
                    IdInformacionConductor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Placa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Licencia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TipoVehiculo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InformacionConductor", x => x.IdInformacionConductor);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                column: "InformacionConductorIdInformacionConductor");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                column: "InformacionConductorIdInformacionConductor",
                principalTable: "InformacionConductor",
                principalColumn: "IdInformacionConductor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropTable(
                name: "InformacionConductor");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "IdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.AddColumn<string>(
                name: "Licencia",
                table: "DocumentosUsuario",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Placa",
                table: "DocumentosUsuario",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoVehiculo",
                table: "DocumentosUsuario",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
