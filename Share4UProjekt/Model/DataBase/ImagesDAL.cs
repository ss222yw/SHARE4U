using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model.DataBase
{
    public class ImagesDAL : DALBase
    {
        public void InsertUserImages(string imagename)
        {
            // Skapar och initierar ett anslutningsobjekt
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    // Skapar och initierar ett SqlCommand-objekt som används till att exekvera specifierad lagrad procedur
                    SqlCommand cmd = new SqlCommand("dbo.InsertUserImg", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Lägger till de parametrar den lagrade proceduren kräver
                    cmd.Parameters.Add("@ImgName", SqlDbType.NVarChar, 128).Value = imagename;


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

        public void DeleteUserImages(string imagename)
        {
            // Skapar och initierar ett anslutningsobjekt
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    // Skapar och initierar ett SqlCommand-objekt som används till att exekvera specifierad lagrad procedur
                    SqlCommand cmd = new SqlCommand("dbo.DeleteUserImages", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Lägger till den parameter den lagrade proceduren kräver
                    cmd.Parameters.Add("@ImgName", SqlDbType.NVarChar, 128).Value = imagename;

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
    }


}