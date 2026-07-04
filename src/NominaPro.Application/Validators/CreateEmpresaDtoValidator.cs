using FluentValidation;
using NominaPro.Application.DTOs;

namespace NominaPro.Application.Validators;

public class CreateEmpresaDtoValidator : AbstractValidator<CreateEmpresaDto>
{
    public CreateEmpresaDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(150).WithMessage("El nombre no puede superar 150 caracteres.");

        RuleFor(x => x.Rnc)
            .NotEmpty().WithMessage("El RNC es obligatorio.")
            .MaximumLength(20).WithMessage("El RNC no puede superar 20 caracteres.");

        RuleFor(x => x.Direccion)
            .NotEmpty().WithMessage("La dirección es obligatoria.")
            .MaximumLength(250);

        RuleFor(x => x.Telefono)
            .NotEmpty().WithMessage("El teléfono es obligatorio.")
            .MaximumLength(20);

        RuleFor(x => x.Correo)
            .NotEmpty().WithMessage("El correo es obligatorio.")
            .EmailAddress().WithMessage("El correo no tiene un formato válido.");
    }
}