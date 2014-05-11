using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model.DAL
{
    public class ImagesDAL : DALBase
    {
        public void InsertUserImages(string imagename, string userid, int KatID, string title)
        {
            // Skapar och initierar ett anslutningsobjekt
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    // Skapar och initierar ett SqlCommand-objekt som används till att exekvera specifierad lagrad procedur
                    SqlCommand cmd = new SqlCommand("appSchema.InsertUserImg", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Lägger till de parametrar den lagrade proceduren kräver
                    cmd.Parameters.Add("@ImgName", SqlDbType.VarChar, 50).Value = imagename;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = userid;
                    cmd.Parameters.Add("@KategoriID", SqlDbType.Int, 4).Value = KatID;
                    cmd.Parameters.Add("@Title", SqlDbType.VarChar, 255).Value = title;

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
                    SqlCommand cmd = new SqlCommand("appSchema.DeleteUserImages", conn);
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

        public List<Images> GetUserImages(string UserID)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var imgs = new List<Images>(100);

                    var cmd = new SqlCommand("appSchema.GetUserImages", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@userid", UserID);
                    conn.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        var imgNameIndex = reader.GetOrdinal("ImgName");

                        while (reader.Read())
                        {
                            imgs.Add(new Images
                            {
                                ImgName = reader.GetString(imgNameIndex)
                            });
                        }
                    }
                    imgs.TrimExcess();

                    return imgs;
                }
                catch (Exception)
                {
                    throw new ApplicationException("Ett fel uppstod då användarens videoklipp skulle hämtas från databasen.");
                }
            }
        }



        public List<Images> ImgByCategID(int KategoriID)
        {
            //Skapar och initierar ett anslutningsobjekt.
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    var categorysimg = new List<Images>(100);
                    //Exekverar den lagrade proceduren , som har samma anslutningsobjekt (conn).
                    SqlCommand cmd = new SqlCommand("appSchema.GetImgsByCatogery", conn);
                    //Sätter om typen till Stored procedure då den av standard är av typen "Text".
                    cmd.CommandType = CommandType.StoredProcedure;

                    ///Skickar med parametrar den lagrade proceduren kräver.
                    cmd.Parameters.Add("@KategoriID", SqlDbType.Int, 4).Value = KategoriID;


                    //Öppnar en anslutning.
                    conn.Open();


                    //Exekverar SELECT-frågan i den lagrade proceduren och retunerar en Datareader-Objekt
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        //Loopar igenom det retunerade SqlDataReader-objektet tills det ej finns poster kvar att läsa.
                        while (reader.Read())
                        {
                            var imgNameIndex = reader.GetOrdinal("ImgName");


                            //Går igenom klassen  och retunerar datat en i taget.
                            categorysimg.Add(new Images
                            {
                                //Tolkar posterna från databasen till C#, datatyper.
                                ImgName = reader.GetString(imgNameIndex),

                            });
                        }
                    }
                    //Retunerar null ifall det ej finns ngn data att hämta.
                    return categorysimg;
                }

                catch
                {
                    throw new ApplicationException("Fel har uppstått i dataåtkomstlagret.");
                }
            }
        }


        public static IEnumerable<Images> GetImagesPageWise(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var images = new List<Images>(100);

                    var cmd = new SqlCommand("appSchema.GetImagesPageWise", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int, 4).Value = startRowIndex / maximumRows + 1;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int, 4).Value = maximumRows;
                    cmd.Parameters.Add("@RecordCount", SqlDbType.Int, 4).Direction = ParameterDirection.Output;

                    conn.Open();

                    cmd.ExecuteNonQuery();
                    totalRowCount = (int)cmd.Parameters["@RecordCount"].Value;

                    using (var reader = cmd.ExecuteReader())
                    {
                        var imageIdIndex = reader.GetOrdinal("ImgID");
                        var imageNameIndex = reader.GetOrdinal("ImgName");
                        var useridIndex = reader.GetOrdinal("userid");
                        var categoryIndex = reader.GetOrdinal("KategoriID");
                        var titleIndex = reader.GetOrdinal("Title");
                        var dateIndex = reader.GetOrdinal("dateOfTheDay");

                        while (reader.Read())
                        {
                            images.Add(new Images
                            {
                                ImgID = reader.GetInt32(imageIdIndex),
                                ImgName = reader.GetString(imageNameIndex),
                                userid = reader.GetString(useridIndex),
                                KategoriID = reader.GetInt32(categoryIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(dateIndex)
                            });
                        }
                    }

                    images.TrimExcess();
                    return images;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        public static IEnumerable<Images> GetImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, int KategoriID)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var image = new List<Images>(100);

                    var cmd = new SqlCommand("appSchema.GetImagesPageWiseByID", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int, 4).Value = startRowIndex / maximumRows + 1;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int, 4).Value = maximumRows;
                    cmd.Parameters.Add("@RecordCount", SqlDbType.Int, 4).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@KategoriID", SqlDbType.Int, 4).Value = KategoriID;

                    conn.Open();

                    cmd.ExecuteNonQuery();
                    totalRowCount = (int)cmd.Parameters["@RecordCount"].Value;

                    using (var reader = cmd.ExecuteReader())
                    {
                        var imageIdIndex = reader.GetOrdinal("ImgID");
                        var imageNameIndex = reader.GetOrdinal("ImgName");
                        var useridIndex = reader.GetOrdinal("userid");
                        var categoryIndex = reader.GetOrdinal("KategoriID");
                        var titleIndex = reader.GetOrdinal("Title");
                        var dateIndex = reader.GetOrdinal("dateOfTheDay");

                        while (reader.Read())
                        {
                            image.Add(new Images
                            {
                                ImgID = reader.GetInt32(imageIdIndex),
                                ImgName = reader.GetString(imageNameIndex),
                                userid = reader.GetString(useridIndex),
                                KategoriID = reader.GetInt32(categoryIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(dateIndex)
                            });
                        }
                    }

                    image.TrimExcess();
                    return image;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }


        public static IEnumerable<Images> GetUsrImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, string userid)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var images = new List<Images>(100);

                    var cmd = new SqlCommand("appSchema.GetUsrImagesPageWiseByID", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int, 4).Value = startRowIndex / maximumRows + 1;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int, 4).Value = maximumRows;
                    cmd.Parameters.Add("@RecordCount", SqlDbType.Int, 4).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = userid;

                    conn.Open();

                    cmd.ExecuteNonQuery();
                    totalRowCount = (int)cmd.Parameters["@RecordCount"].Value;

                    using (var reader = cmd.ExecuteReader())
                    {
                        var imgIdIndex = reader.GetOrdinal("ImgID");
                        var imgNameIndex = reader.GetOrdinal("ImgName");
                        var useridIndex = reader.GetOrdinal("userid");
                        var categoryIndex = reader.GetOrdinal("KategoriID");
                        var titleIndex = reader.GetOrdinal("Title");
                        var dateIndex = reader.GetOrdinal("dateOfTheDay");

                        while (reader.Read())
                        {
                            images.Add(new Images
                            {
                                ImgID = reader.GetInt32(imgIdIndex),
                                ImgName = reader.GetString(imgNameIndex),
                                userid = reader.GetString(useridIndex),
                                KategoriID = reader.GetInt32(categoryIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(dateIndex)
                            });
                        }
                    }

                    images.TrimExcess();
                    return images;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        public Images GetImagesDataByID(int imgID)
        {

            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.GetImgsByID", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@ImgID", SqlDbType.Int, 4).Value = imgID;

                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var imgIdIndex = reader.GetOrdinal("ImgID");
                            var imgNameIndex = reader.GetOrdinal("ImgName");
                            var useridIndex = reader.GetOrdinal("userid");
                            var categoryIndex = reader.GetOrdinal("KategoriID");
                            var titleIndex = reader.GetOrdinal("Title");
                            var ddateIndex = reader.GetOrdinal("dateOfTheDay");

                            return new Images
                            {
                                ImgID = reader.GetInt32(imgIdIndex),
                                ImgName = reader.GetString(imgNameIndex),
                                userid = reader.GetString(useridIndex),
                                KategoriID = reader.GetInt32(categoryIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(ddateIndex)
                            };
                        }
                    }
                    return null;
                }
                catch
                {

                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        public void UpdateImgs(Images imges, int kategoriID)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.UpdateImages", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@ImgID", SqlDbType.Int, 4).Value = imges.ImgID;
                    cmd.Parameters.Add("@Title", SqlDbType.VarChar, 255).Value = imges.Title;
                    cmd.Parameters.Add("@KategoriID", SqlDbType.Int, 4).Value = kategoriID;

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