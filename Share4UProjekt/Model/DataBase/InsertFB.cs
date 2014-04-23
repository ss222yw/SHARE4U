using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Share4UProjekt.Model.DAL;

namespace Share4UProjekt.Model.DataBase
{
    public class InsertFB : DALBase
    {

        public void InsertInsertFB(string access_token, string userid, string name)
        {
            // Skapar och initierar ett anslutningsobjekt
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    // Skapar och initierar ett SqlCommand-objekt som används till att exekvera specifierad lagrad procedur
                    SqlCommand cmd = new SqlCommand("dbo.InsertUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Lägger till de parametrar den lagrade proceduren kräver
                    cmd.Parameters.Add("@access_token", SqlDbType.VarChar, 255).Value = access_token;
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 50).Value = name;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = userid;


                    // Öppnar anslutningen till databasen
                    conn.Open();

                    cmd.ExecuteNonQuery();


                }
                catch
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }


        public string getuserdata(string userid)
        {
            //Skapar en anslutningsobjekt.
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    // Skapar ett SqlCommand-objekt för att exekvera specifierad lagrad procedur.
                    SqlCommand cmd = new SqlCommand("dbo.GetUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Lägger till den paramter den lagrade proceduren kräver.
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = userid;

                    // Öppnar anslutningen till databasen.
                    conn.Open();

                    // Skapar ett SqlDataReader-objekt och returnerar en referens till objektet.
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Tar reda på vilket index de olika kolumnerna har.
                            var useridIndex = reader.GetOrdinal("userid");


                            return userid = reader.GetString(useridIndex);
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


    }
}