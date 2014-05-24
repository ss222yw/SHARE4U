﻿using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model;
using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Cars
{
    public partial class Alfa_Romeo : System.Web.UI.Page
    {
        private Service _service;
        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void imgUser_Command(object sender, CommandEventArgs e)
        {

            StringBuilder script = new StringBuilder();
            script.Append("<script type='text/javascript'>");
            script.Append("var viewer = new PhotoViewer();");
            script.Append("viewer.setBorderWidth(0);");
            script.Append("viewer.disableToolbar();");
            script.Append("viewer.add('" + e.CommandArgument + "');");
            script.Append("viewer.show(0);");
            script.Append("</script>");
            ClientScript.RegisterStartupScript(GetType(), "viewer", script.ToString());
        }

        // The return type can be changed to IEnumerable, however to support
        // paging and sorting, the following parameters must be added:
        //     int maximumRows
        //     int startRowIndex
        //     out int totalRowCount
        //     string sortByExpression
        public IEnumerable<Share4UProjekt.Model.Images> ImagesListView_GetData(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            return Service.GetImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, 4);
        }

        private string Message
        {
            get
            {
                return Session["Message"] as string;
            }
            set
            {
                Session["Message"] = value;
            }
        }

        public string Access_Token { get { return ((SiteMaster)this.Master).Access_Token; } }

        protected void ImageFavoriteButton_Command(object sender, CommandEventArgs e)
        {
            if (Access_Token != null)
            {
                string data = FaceBookConnect.Fetch(Access_Token, "me");
                FaceBookUser faceBookUser = new JavaScriptSerializer().Deserialize<FaceBookUser>(data);
                string imgName = e.CommandName;
                string usrID = faceBookUser.Id;
                FavoriteDAL f = new FavoriteDAL();
                var lista = f.GetImgsFavoriteByName(faceBookUser.Id);
                foreach (var item in lista)
                {
                    if (item.ImgName == imgName)
                    {
                        ModelState.AddModelError(String.Empty, "Denna bild finns redan i din favorit lista!");
                        return;
                    }
                }
                Service.InsertUserFavoriteImg(imgName, usrID);
                Message = "bilden" + (imgName) + "Laggt till din favorit lista.";
                Response.RedirectToRoute("Alfa Romeo");
            }
            else
            {
                Message = "Logga in för att lägga bilden till din favorit list!";
                Response.RedirectToRoute("Alfa Romeo");
            }
        }
    }
}