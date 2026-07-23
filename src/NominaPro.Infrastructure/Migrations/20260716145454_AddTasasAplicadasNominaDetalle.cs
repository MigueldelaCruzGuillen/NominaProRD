using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTasasAplicadasNominaDetalle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DecimalesAplicados",
                table: "NominaDetalles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsrAplicado",
                table: "NominaDetalles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "PorcentajeAfpAplicado",
                table: "NominaDetalles",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PorcentajeSfsAplicado",
                table: "NominaDetalles",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DecimalesAplicados",
                table: "NominaDetalles");

            migrationBuilder.DropColumn(
                name: "IsrAplicado",
                table: "NominaDetalles");

            migrationBuilder.DropColumn(
                name: "PorcentajeAfpAplicado",
                table: "NominaDetalles");

            migrationBuilder.DropColumn(
                name: "PorcentajeSfsAplicado",
                table: "NominaDetalles");
        }
    }
}
