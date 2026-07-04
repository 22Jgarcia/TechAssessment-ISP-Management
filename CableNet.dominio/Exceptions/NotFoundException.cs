namespace CableNet.Domain.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entidad, object id)
        : base($"{entidad} con id '{id}' no fue encontrado.") { }

    public NotFoundException(string mensaje) : base(mensaje) { }
}