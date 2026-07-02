using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Services;

public class CrudService<TEntity> where TEntity : class
{
    protected readonly IRepository<TEntity> Repository;

    public CrudService(IRepository<TEntity> repository)
    {
        Repository = repository;
    }

    public virtual async Task<List<TEntity>> GetAllEntitiesAsync()
    {
        return await Repository.GetAllAsync();
    }

    public virtual async Task<TEntity?> GetEntityByIdAsync(Guid id)
    {
        return await Repository.GetByIdAsync(id);
    }

    public virtual async Task<TEntity> CreateEntityAsync(TEntity entity)
    {
        return await Repository.CreateAsync(entity);
    }

    public virtual async Task UpdateEntityAsync(TEntity entity)
    {
        await Repository.UpdateAsync(entity);
    }

    public virtual async Task DeleteEntityAsync(TEntity entity)
    {
        await Repository.DeleteAsync(entity);
    }
}