using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Share4UPages
{
    public partial class FavoritePage : System.Web.UI.Page
    {
        private Service _service;

        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }


        public string Access_Token { get { return ((SiteMaster)this.Master).Access_Token; } }

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
            Response.RedirectToRoute("FavoritePage", close);
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


            if (Access_Token == null)
            {
                LabelFavoriteMessage.Text = "logga in för att se din favorit lista";
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
        public IEnumerable<Share4UProjekt.Model.Favorite> GetUsrFavoriteImagesPageWiseByID(int maximumRows, int startRowIndex, out int totalRowCount)
        {
      
          
            string userid = "";

            if (Access_Token != null)
            {
                string FbUsrData = FaceBookConnect.Fetch(Access_Token, "me");
                var fbUsr = new JavaScriptSerializer().Deserialize<FaceBookUser>(FbUsrData);

                userid = fbUsr.Id;
            }
         
            return Service.GetUsrFavoriteImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, userid);
        }

        // The id parameter name should match the DataKeyNames value set on the control
        public void ImgListView_DeleteItem(Favorite favorite)
        {
            try
            {
                Service.DeleteUserFavoriteImages(favorite.FavoriteID);
                Message = "bilden togs bort från favoritlista.";
                Response.RedirectToRoute("FavoritePage");
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Ett oväntat fel inträffade då bilden skulle tas bort.");
            }
        }
    }
}