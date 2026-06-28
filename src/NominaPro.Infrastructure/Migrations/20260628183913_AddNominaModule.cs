using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNominaModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PeriodosNomina",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PeriodosNomina", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PeriodosNomina_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nominas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PeriodoNominaId = table.Column<Guid>(type: "uuid", nullable: false),
                    FechaGeneracion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalBruto = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalDeducciones = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalNeto = table.Column<decimal>(type: "numeric", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nominas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nominas_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nominas_PeriodosNomina_PeriodoNominaId",
                        column: x => x.PeriodoNominaId,
                        principalTable: "PeriodosNomina",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NominaDetalles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NominaId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpleadoId = table.Column<Guid>(type: "uuid", nullable: false),
                    SalarioBase = table.Column<decimal>(type: "numeric", nullable: false),
                    HorasExtras = table.Column<decimal>(type: "numeric", nullable: false),
                    Bonificaciones = table.Column<decimal>(type: "numeric", nullable: false),
                    OtrosIngresos = table.Column<decimal>(type: "numeric", nullable: false),
                    Afp = table.Column<decimal>(type: "numeric", nullable: false),
                    Sfs = table.Column<decimal>(type: "numeric", nullable: false),
                    Isr = table.Column<decimal>(type: "numeric", nullable: false),
                    OtrosDescuentos = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalIngresos = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalDeducciones = table.Column<decimal>(type: "numeric", nullable: false),
                    NetoPagar = table.Column<decimal>(type: "numeric", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NominaDetalles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NominaDetalles_Empleados_EmpleadoId",
                        column: x => x.EmpleadoId,
                        principalTable: "Empleados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NominaDetalles_Nominas_NominaId",
                        column: x => x.NominaId,
                        principalTable: "Nominas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NominaDetalles_EmpleadoId",
                table: "NominaDetalles",
                column: "EmpleadoId");

            migrationBuilder.CreateIndex(
                name: "IX_NominaDetalles_NominaId",
                table: "NominaDetalles",
                column: "NominaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nominas_EmpresaId",
                table: "Nominas",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nominas_PeriodoNominaId",
                table: "Nominas",
                column: "PeriodoNominaId");

            migrationBuilder.CreateIndex(
                name: "IX_PeriodosNomina_EmpresaId",
                table: "PeriodosNomina",
                column: "EmpresaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NominaDetalles");

            migrationBuilder.DropTable(
                name: "Nominas");

            migrationBuilder.DropTable(
                name: "PeriodosNomina");
        }
    }
}
