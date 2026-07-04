namespace CableNet.Domain.Exceptions;

public class ConflictException : Exception
{
    public ConflictException(string mensaje) : base(mensaje) { }
}