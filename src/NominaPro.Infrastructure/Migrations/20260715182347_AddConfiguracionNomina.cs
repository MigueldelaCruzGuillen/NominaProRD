using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConfiguracionNomina : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConfiguracionesNomina",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PorcentajeAfp = table.Column<decimal>(type: "numeric", nullable: false),
                    PorcentajeSfs = table.Column<decimal>(type: "numeric", nullable: false),
                    AplicarIsr = table.Column<bool>(type: "boolean", nullable: false),
                    DiaPago = table.Column<int>(type: "integer", nullable: false),
                    Decimales = table.Column<int>(type: "integer", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracionesNomina", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfiguracionesNomina_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracionesNomina_EmpresaId",
                table: "ConfiguracionesNomina",
                column: "EmpresaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracionesNomina");
        }
    }
}
