using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioPagoNomina : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Nominas_PagadaPorUsuarioId",
                table: "Nominas",
                column: "PagadaPorUsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Nominas_Usuarios_PagadaPorUsuarioId",
                table: "Nominas",
                column: "PagadaPorUsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nominas_Usuarios_PagadaPorUsuarioId",
                table: "Nominas");

            migrationBuilder.DropIndex(
                name: "IX_Nominas_PagadaPorUsuarioId",
                table: "Nominas");
        }
    }
}
