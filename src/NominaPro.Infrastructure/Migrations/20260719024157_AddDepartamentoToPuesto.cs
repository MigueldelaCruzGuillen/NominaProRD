using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NominaPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartamentoToPuesto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DepartamentoId",
                table: "Puestos",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Puestos_DepartamentoId",
                table: "Puestos",
                column: "DepartamentoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Puestos_Departamentos_DepartamentoId",
                table: "Puestos",
                column: "DepartamentoId",
                principalTable: "Departamentos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Puestos_Departamentos_DepartamentoId",
                table: "Puestos");

            migrationBuilder.DropIndex(
                name: "IX_Puestos_DepartamentoId",
                table: "Puestos");

            migrationBuilder.DropColumn(
                name: "DepartamentoId",
                table: "Puestos");
        }
    }
}
