using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Model.Migrations
{
    /// <inheritdoc />
    public partial class initial8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "DocumentosUsuario");

            migrationBuilder.RenameColumn(
                name: "UrlImagen",
                table: "DocumentosUsuario",
                newName: "UrlDocumento");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameColumn(
                name: "UrlDocumento",
                table: "DocumentosUsuario",
                newName: "UrlImagen");

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "DocumentosUsuario",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
