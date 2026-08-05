using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Model.Migrations
{
    /// <inheritdoc />
    public partial class initial6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Encomiendas_Tamanos_IdTamano",
                table: "Encomiendas");

            migrationBuilder.DropTable(
                name: "Tamanos");

            migrationBuilder.DropIndex(
                name: "IX_Encomiendas_IdTamano",
                table: "Encomiendas");

            migrationBuilder.DropColumn(
                name: "IdTamano",
                table: "Encomiendas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdTamano",
                table: "Encomiendas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tamanos",
                columns: table => new
                {
                    IdTamano = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tamanos", x => x.IdTamano);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Encomiendas_IdTamano",
                table: "Encomiendas",
                column: "IdTamano");

            migrationBuilder.AddForeignKey(
                name: "FK_Encomiendas_Tamanos_IdTamano",
                table: "Encomiendas",
                column: "IdTamano",
                principalTable: "Tamanos",
                principalColumn: "IdTamano");
        }
    }
}
