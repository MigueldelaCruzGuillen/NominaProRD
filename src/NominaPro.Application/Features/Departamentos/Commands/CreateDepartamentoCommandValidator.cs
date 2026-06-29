using FluentValidation;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class CreateDepartamentoCommandValidator : AbstractValidator<CreateDepartamentoCommand>
{
    public CreateDepartamentoCommandValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del departamento es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede superar 100 caracteres.");

        RuleFor(x => x.Descripcion)
            .MaximumLength(250).WithMessage("La descripción no puede superar 250 caracteres.");
    }
}