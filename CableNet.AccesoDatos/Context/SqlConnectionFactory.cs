using Microsoft.Data.SqlClient;
using System.Data;

namespace CableNet.DataAccess.Context
{
    public interface ISqlConnectionFactory
    {
        IDbConnection CreateConnection();
    }


    public sealed class SqlConnectionFactory : ISqlConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(string connectionString)
        => _connectionString = connectionString;

        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);

    }
}