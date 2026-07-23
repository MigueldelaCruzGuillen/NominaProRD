using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConfiguracionSistema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConfiguracionesSistema",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Idioma = table.Column<string>(type: "text", nullable: false),
                    ZonaHoraria = table.Column<string>(type: "text", nullable: false),
                    FormatoFecha = table.Column<string>(type: "text", nullable: false),
                    Moneda = table.Column<string>(type: "text", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracionesSistema", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfiguracionesSistema_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracionesSistema_EmpresaId",
                table: "ConfiguracionesSistema",
                column: "EmpresaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracionesSistema");
        }
    }
}
