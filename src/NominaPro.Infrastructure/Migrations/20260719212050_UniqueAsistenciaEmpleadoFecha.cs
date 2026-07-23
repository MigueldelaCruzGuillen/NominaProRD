using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UniqueAsistenciaEmpleadoFecha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Asistencias_EmpleadoId",
                table: "Asistencias");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_EmpleadoId_Fecha",
                table: "Asistencias",
                columns: new[] { "EmpleadoId", "Fecha" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Asistencias_EmpleadoId_Fecha",
                table: "Asistencias");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_EmpleadoId",
                table: "Asistencias",
                column: "EmpleadoId");
        }
    }
}
