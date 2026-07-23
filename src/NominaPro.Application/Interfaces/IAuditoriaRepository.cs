using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IAuditoriaRepository
{
    Task CreateAsync(Auditoria auditoria);
    Task<List<Auditoria>> GetAllAsync();
}