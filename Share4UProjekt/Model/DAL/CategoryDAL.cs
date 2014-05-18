using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model.DAL
{
    public class CategoryDAL : DALBase
    {
        /// <summary>
        /// Metoden GetImgCategory som hämtar bilder kategorier från sql server.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Category> GetImgCategory()
        {
            using (var conn = CreateConnection())
            {
                try
                {
                    var cmd = new SqlCommand("appSchema.GetCategory", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    List<Category> categorys = new List<Category>(20);

                    conn.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        var categoryIDIndex = reader.GetOrdinal("KategoriID");
                        var CategoryVidIndex = reader.GetOrdinal("Kategori");

                        while (reader.Read())
                        {

                            categorys.Add(new Category
                            {
                                KategoriID = reader.GetInt32(categoryIDIndex),
                                Kategori = reader.GetString(CategoryVidIndex),

                            });
                        }
                    }

                    categorys.TrimExcess();

                    return categorys;
                }
                catch
                {

                    throw new ApplicationException("An error occured while getting category from the database.");
                }
            }
        }
    }
}