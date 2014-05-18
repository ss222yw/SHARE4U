using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Share4UProjekt.Model
{
    public class Service
    {

        public static IEnumerable<Images> GetImagesPageWise(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            return 
            ImagesDAL.GetImagesPageWise(maximumRows, startRowIndex, out totalRowCount);
        }

        public static IEnumerable<Images> GetImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, int KategoriID)
        {
            return 
            ImagesDAL.GetImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, KategoriID);
        }

        public static IEnumerable<Images> GetUsrPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount, string usrID)
        {
            return 
            ImagesDAL.GetUsrImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, usrID);
        }



        private CategoryDAL _CategoryDAL;
        private CategoryDAL CategoryDAL
        {
            get 
            { return _CategoryDAL ?? (_CategoryDAL = new CategoryDAL()); }
        }

        public IEnumerable<Category> GetImgCategory()
        {
            return 
            CategoryDAL.GetImgCategory();
        }

        private ImagesDAL _ImagesDAL;
        private ImagesDAL ImagesDAL
        {
            get 
            { return _ImagesDAL ?? (_ImagesDAL = new ImagesDAL()); }
        }

        public void InsertUserImages(string imgName, string usrID, int KategoriID, string title)
        {
            ImagesDAL.InsertUserImages(imgName, usrID, KategoriID, title);
        }

        public Images GetImgsDataByID(int imgID)
        {
            return 
            ImagesDAL.GetImagesDataByID(imgID);
        }

        public void UpdateImg(Images img, int kategoriID)
        {
            ImagesDAL.UpdateImgs(img, kategoriID);
        }

        public void DeleteUserImages(string imgName)
        {
            ImagesDAL.DeleteUserImages(imgName);
        }


        private FacebookDAL _FacebookDAL;
        private FacebookDAL FacebookDAL
        {
            get 
            { return _FacebookDAL ?? (_FacebookDAL = new FacebookDAL()); }
        }

        public void InsertFacebookUserInfo(string access_token, string usrID, string name)
        {
            FacebookDAL.InsertFacebookUserInfo(access_token, usrID, name);
        }

        public string getUsrData(string usrID)
        {
            return 
            FacebookDAL.getUsrData(usrID);
        }
    }
}