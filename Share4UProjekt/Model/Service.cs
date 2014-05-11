using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model
{
    public class Service
    {
        //Privat fält
        private CategoryDAL _CategoryDAL;

        // Ett CategoryDAL-objekt skapas först då det behövs för första gången.
        private CategoryDAL CategoryDAL
        {
            get { return _CategoryDAL ?? (_CategoryDAL = new CategoryDAL()); }
        }

        //privat fällt
        private ImagesDAL _ImagesDAL;

        // Ett ImagesDAL-objekt skapas först då det behövs för första gången.
        private ImagesDAL ImagesDAL
        {
            get { return _ImagesDAL ?? (_ImagesDAL = new ImagesDAL()); }
        }

        //privat fällt
        private FacebookDAL _FacebookDAL;

        // Ett FacebookDAL-objekt skapas först då det behövs för första gången.
        private FacebookDAL FacebookDAL
        {
            get { return _FacebookDAL ?? (_FacebookDAL = new FacebookDAL()); }
        }

        public IEnumerable<Category> GetImgCategory()
        {
            return CategoryDAL.GetImgCategory();
        }

        public void InsertInsertFB(string access_token, string userid, string name)
        {
            FacebookDAL.InsertInsertFB(access_token,userid,name);
        }

        public string getuserdata(string userid)
        {
          return FacebookDAL.getuserdata(userid);
        }

        public void InsertUserImages(string imagename, string userid, int KatID, string title)
        {
            ImagesDAL.InsertUserImages(imagename, userid, KatID, title);
        }

        public void DeleteUserImages(string imagename)
        {
             ImagesDAL.DeleteUserImages(imagename);
        }

        public List<Images> GetUserImages(string UserID)
        {
            return ImagesDAL.GetUserImages(UserID);
        }

        public List<Images> ImgByCategID(int KategoriID)
        {
            return ImagesDAL.ImgByCategID(KategoriID);
        }

        public static IEnumerable<Images> GetImagesPageWise(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            return ImagesDAL.GetImagesPageWise(maximumRows, startRowIndex, out totalRowCount);
        }

        public static IEnumerable<Images> GetImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, int KategoriID)
        {
            return ImagesDAL.GetImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, KategoriID);
        }

        public static IEnumerable<Images> GetUsrPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, string userid)
        {
            return ImagesDAL.GetUsrImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, userid);
        }

        public Images GetImgsDataByID(int imgID)
        {
            return ImagesDAL.GetImagesDataByID(imgID);
        }
 
        public void UpdateImg(Images img, int kategoriID)
        {
            ImagesDAL.UpdateImgs(img, kategoriID);
        }
    }
}