using ASPSnippets.FaceBookAPI;
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
        protected void closeImg_Click(object sender, ImageClickEventArgs e)
        {
            ResponsePanel.Visible = true;
            var close = Request.QueryString["Message"];
            Response.RedirectToRoute("Alfa Romeo", close);
        }
        protected void Page_Load(object sender, EventArgs e)
        {

            if (Message != null)
            {
                ResponsePanel.Visible = true;
                SuccessTest.Visible = true;
                SuccessTest.Text = Message;
                Session.Remove("Message");
            }


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


        public string Access_Token { get { return ((SiteMaster)this.Master).Access_Token; } }

        protected void ImageFavoriteButton_Command(object sender, CommandEventArgs e)
        {
            if (Access_Token != null)
            {
                FaceBookUser fbUsr = HttpContext.Current.Cache["GetUserInfo"] as FaceBookUser; 
                string imgName = e.CommandName;
                string usrID = fbUsr.Id;
                FavoriteDAL f = new FavoriteDAL();
                var lista = f.GetImgsFavoriteByName(fbUsr.Id);
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