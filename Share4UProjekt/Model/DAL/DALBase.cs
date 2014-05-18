using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace Share4UProjekt.Model.DAL
{
    /// <summary>
    /// Abstraktat klass som gör kontakt med sql server.
    /// </summary>
    public abstract class DALBase
    {
        private static string _connectionString;

        protected static SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        static DALBase()
        {
            _connectionString = WebConfigurationManager.ConnectionStrings["Share4UConnectionString"].ConnectionString;
        }
    }
}