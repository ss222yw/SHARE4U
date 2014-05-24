using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model.DAL
{
    public class FavoriteDAL : DALBase
    {
        /// <summary>
        /// Metoden GetUsrFavoriteImagesPageWiseByID hämtar bilder för användaren id.
        /// </summary>
        /// <param name="maximumRows"></param>
        /// <param name="startRowIndex"></param>
        /// <param name="totalRowCount"></param>
        /// <param name="favoriteID"></param>
        /// <returns></returns>
        public static IEnumerable<Favorite> GetUsrFavoriteImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, string userid)
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var imgs = new List<Favorite>(100);
                    var cmd = new SqlCommand("appSchema.GetUsrFavoriteImagesPageWiseByID", conn);
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
                        var imgIdIndex = reader.GetOrdinal("FavoriteID");
                        var imgNameIndex = reader.GetOrdinal("ImgName");
                        var useridIndex = reader.GetOrdinal("userid");
                        while (reader.Read())
                        {
                            imgs.Add(new Favorite
                            {
                                FavoriteID = reader.GetInt32(imgIdIndex),
                                ImgName = reader.GetString(imgNameIndex),
                                userid = reader.GetString(useridIndex),
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
        /// Metoden DeleteUserFavoriteImages tar bort bilds info från sql server.
        /// </summary>
        /// <param name="imgName"></param>
        public void DeleteUserFavoriteImages(int fav)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.DeleteUserFavoriteImages", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@FavoriteID", SqlDbType.Int, 4).Value = fav;
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
        /// Metoden GetImgsFavoriteByID hämtar bild namn, användarens id , kategori id , rubriken och vilken datum bilden är inlagd från sql server..
        /// </summary>
        /// <param name="imgID"></param>
        /// <returns></returns>
        public Favorite GetImgsFavoriteByID(int favoriteID)
        {

            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.GetImgsFavoriteByID", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@FavoriteID", SqlDbType.Int, 4).Value = favoriteID;
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var imgIdIndex = reader.GetOrdinal("FavoriteID");
                            var imgNameIndex = reader.GetOrdinal("ImgName");
                            var useridIndex = reader.GetOrdinal("userid");

                            return new Favorite
                            {
                                FavoriteID = reader.GetInt32(imgIdIndex),
                                ImgName = reader.GetString(imgNameIndex),
                                userid = reader.GetString(useridIndex),
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
        public void InsertUserFavoriteImg(string imgName, string usrID)
        {
            using (SqlConnection conn = CreateConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("appSchema.InsertUserFavoriteImg", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ImgName", SqlDbType.VarChar, 100).Value = imgName;
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



        public IEnumerable<Favorite> GetImgsFavoriteByName(string usrID)
        {
            // Skapar ett anslutningsobjekt.
            using (var conn = CreateConnection())
            {
                try
                {

                    // exekveras specifierad lagrad procedur.
                    var cmd = new SqlCommand("appschema.GetImgsFavoriteByName", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@userid", SqlDbType.VarChar, 100).Value = usrID;

                    // Skapar det List-objekt som initialt har plats för 20 referenser till CarBrand-objekt.
                    List<Favorite> carBrands = new List<Favorite>(20);

                    // Öppnar anslutningen till databasen.
                    conn.Open();

                    // skapar ett SqlDataReader-objekt och returnerar en referens till objektet.
                    using (var reader = cmd.ExecuteReader())
                    {
                        // Tar reda på vilket index de olika kolumnerna har.
                        var BrandNameIndex = reader.GetOrdinal("ImgName");

                        // Så länge som det finns poster att läsa returnerar Read true annars false.
                        while (reader.Read())
                        {

                            carBrands.Add(new Favorite
                            {
                                ImgName = reader.GetString(BrandNameIndex),

                            });
                        }
                    }


                    //Avallokerar minne som inte används.
                    carBrands.TrimExcess();

                    // Returnerar referensen till List-objektet med referenser med CarBrand-objekt.
                    return carBrands;
                }
                catch
                {
                    // Kastar ett eget undantag om ett undantag kastas.
                    throw new ApplicationException("An error occured while getting CarBrand from the database.");
                }
            }
        }



    }
}