using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Model.Migrations
{
    /// <inheritdoc />
    public partial class initial10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_TiposDocumento_TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_Usuarios_UsuarioIdUsuario",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_UsuarioIdUsuario",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario");

            migrationBuilder.DropColumn(
                name: "UsuarioIdUsuario",
                table: "DocumentosUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_IdInformacionConductor",
                table: "DocumentosUsuario",
                column: "IdInformacionConductor");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_IdTipoDocumento",
                table: "DocumentosUsuario",
                column: "IdTipoDocumento");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_IdUsuario",
                table: "DocumentosUsuario",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_IdInformacionConductor",
                table: "DocumentosUsuario",
                column: "IdInformacionConductor",
                principalTable: "InformacionConductor",
                principalColumn: "IdInformacionConductor",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_TiposDocumento_IdTipoDocumento",
                table: "DocumentosUsuario",
                column: "IdTipoDocumento",
                principalTable: "TiposDocumento",
                principalColumn: "IdTipoDocumento",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_Usuarios_IdUsuario",
                table: "DocumentosUsuario",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_IdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_TiposDocumento_IdTipoDocumento",
                table: "DocumentosUsuario");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentosUsuario_Usuarios_IdUsuario",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_IdInformacionConductor",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_IdTipoDocumento",
                table: "DocumentosUsuario");

            migrationBuilder.DropIndex(
                name: "IX_DocumentosUsuario_IdUsuario",
                table: "DocumentosUsuario");

            migrationBuilder.AddColumn<int>(
                name: "InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioIdUsuario",
                table: "DocumentosUsuario",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                column: "InformacionConductorIdInformacionConductor");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario",
                column: "TipoDocumentoIdTipoDocumento");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosUsuario_UsuarioIdUsuario",
                table: "DocumentosUsuario",
                column: "UsuarioIdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_InformacionConductor_InformacionConductorIdInformacionConductor",
                table: "DocumentosUsuario",
                column: "InformacionConductorIdInformacionConductor",
                principalTable: "InformacionConductor",
                principalColumn: "IdInformacionConductor");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_TiposDocumento_TipoDocumentoIdTipoDocumento",
                table: "DocumentosUsuario",
                column: "TipoDocumentoIdTipoDocumento",
                principalTable: "TiposDocumento",
                principalColumn: "IdTipoDocumento");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentosUsuario_Usuarios_UsuarioIdUsuario",
                table: "DocumentosUsuario",
                column: "UsuarioIdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario");
        }
    }
}
