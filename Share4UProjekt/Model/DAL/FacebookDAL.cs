using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Share4UProjekt.Model.DAL;

namespace Share4UProjekt.Model.DAL
{
    public class FacebookDAL : DALBase
    {
        /// <summary>
        /// Metoden getUsrData som hämtar facebook användaren information.
        /// </summary>
        /// <param name="usrID"></param>
        /// <returns></returns>
        public string getUsrData(string usrID)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.GetUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = usrID;
                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var usrIDIndex = reader.GetOrdinal("userid");
                            return usrID = reader.GetString(usrIDIndex);
                        }
                        return null;
                    }

                }
                catch
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }

        }

        /// <summary>
        /// Metoden InsertFacebookUserInfo lägger till användarens information i sql server.
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="usrID"></param>
        /// <param name="name"></param>
        public void InsertFacebookUserInfo(string access_token, string usrID, string name)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.InsertUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@access_token", SqlDbType.VarChar, 255).Value = access_token;
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 50).Value = name;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = usrID;


                    conn.Open();

                    cmd.ExecuteNonQuery();


                }
                catch
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

    }
}