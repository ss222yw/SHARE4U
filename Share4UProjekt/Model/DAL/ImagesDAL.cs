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
        /// <summary>
        /// Metoden GetImagesDataByID hämtar bild namn, användarens id , kategori id , rubriken och vilken datum bilden är inlagd från sql server..
        /// </summary>
        /// <param name="imgID"></param>
        /// <returns>null</returns>
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

        /// <summary>
        /// Metoden InsertUserImages knyter bilderna med användaren som lägger upp bilderna.
        /// </summary>
        /// <param name="imgName"></param>
        /// <param name="usrID"></param>
        /// <param name="kategoriID"></param>
        /// <param name="title"></param>
        public void InsertUserImages(string imgName, string usrID, int kategoriID, string title)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.InsertUserImg", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ImgName", SqlDbType.VarChar, 100).Value = imgName;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = usrID;
                    cmd.Parameters.Add("@KategoriID", SqlDbType.Int, 4).Value = kategoriID;
                    cmd.Parameters.Add("@Title", SqlDbType.VarChar, 255).Value = title;
                    conn.Open();
                    cmd.ExecuteNonQuery();
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

        /// <summary>
        /// Metoden DeleteUserImages tar bort bilds info från sql server.
        /// </summary>
        /// <param name="imgName"></param>
        public void DeleteUserImages(string imgName)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.DeleteUserImages", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ImgName", SqlDbType.NVarChar, 100).Value = imgName;
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        /// <summary>
        /// Metoden GetImagesPageWise hämtar alla bilder från sql server.
        /// </summary>
        /// <param name="maximumRows"></param>
        /// <param name="startRowIndex"></param>
        /// <param name="totalRowCount"></param>
        /// <returns>imgs</returns>
        public static IEnumerable<Images> GetImagesPageWise(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var imgs = new List<Images>(100);
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
                        var usrIDIndex = reader.GetOrdinal("userid");
                        var categoryIDIndex = reader.GetOrdinal("KategoriID");
                        var titleIndex = reader.GetOrdinal("Title");
                        var dateIndex = reader.GetOrdinal("dateOfTheDay");
                        while (reader.Read())
                        {
                            imgs.Add(new Images
                            {
                                ImgID = reader.GetInt32(imageIdIndex),
                                ImgName = reader.GetString(imageNameIndex),
                                userid = reader.GetString(usrIDIndex),
                                KategoriID = reader.GetInt32(categoryIDIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(dateIndex)
                            });
                        }
                    }
                    imgs.TrimExcess();
                    return imgs;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }


        /// <summary>
        /// Metoden GetImagesPageWiseByID hämtar bilder via id  för kategorid från sql server.
        /// </summary>
        /// <param name="maximumRows"></param>
        /// <param name="startRowIndex"></param>
        /// <param name="totalRowCount"></param>
        /// <param name="KategoriID"></param>
        /// <returns>imgs</returns>
        public static IEnumerable<Images> GetImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, int KategoriID)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var imgs = new List<Images>(100);
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
                        var usrIDIndex = reader.GetOrdinal("userid");
                        var categoryIndex = reader.GetOrdinal("KategoriID");
                        var titleIndex = reader.GetOrdinal("Title");
                        var dateIndex = reader.GetOrdinal("dateOfTheDay");

                        while (reader.Read())
                        {
                            imgs.Add(new Images
                            {
                                ImgID = reader.GetInt32(imageIdIndex),
                                ImgName = reader.GetString(imageNameIndex),
                                userid = reader.GetString(usrIDIndex),
                                KategoriID = reader.GetInt32(categoryIndex),
                                Title = reader.GetString(titleIndex),
                                dateOfTheDay = reader.GetDateTime(dateIndex)
                            });
                        }
                    }
                    imgs.TrimExcess();
                    return imgs;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        /// <summary>
        /// Metoden GetUsrImagesPageWiseByID hämtar bilder för användaren id.
        /// </summary>
        /// <param name="maximumRows"></param>
        /// <param name="startRowIndex"></param>
        /// <param name="totalRowCount"></param>
        /// <param name="userid"></param>
        /// <returns>imgs</returns>
        public static IEnumerable<Images> GetUsrImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, string userid)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var imgs = new List<Images>(100);
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
                            imgs.Add(new Images
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
                    imgs.TrimExcess();
                    return imgs;
                }
                catch (Exception)
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }

        /// <summary>
        /// Metoden DisplaySearchResults hämtar information (rubiken , bild namn och vilken format är bilden av) för sök funktion.
        /// </summary>
        /// <param name="strSearch"></param>
        /// <returns>images</returns>
       
        public IList<Images> DisplaySearchResults(string strSearch)
        {
            
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    var images = new List<Images>(100);
                    SqlCommand cmd = new SqlCommand("appSchema.spSearchByString", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Title", strSearch);
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var imgNameIndex = reader.GetOrdinal("ImgName");
                        var titleIndex = reader.GetOrdinal("Title");

                        while (reader.Read())
                        {
                            images.Add(new Images
                            {
                                ImgName = reader.GetString(imgNameIndex),
                                Title = reader.GetString(titleIndex),
                            });
                        }
                    }
                    images.TrimExcess();
                    counter = images.Count;
                    return images;
                }
                catch
                {
                    throw new ApplicationException("An error occured in the data access layer.");
                }
            }
        }
        private static int counter;
        public int Count
        {
            get { return counter; }
        }

    }
}