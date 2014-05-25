using System;
using System.Web.Security;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DAL;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt
{
    public partial class SiteMaster : MasterPage
    {
        /// <summary>
        /// Message session
        /// </summary>
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

        /// <summary>
        /// Hämtar access token för facebook inlogging system.
        /// </summary>
        private static string access_token;
        public string Access_Token
        {
            get { return access_token; }
        }

        /// <summary>
        /// Sparar facebook access token i cookis så den kommer ihåg att man inloggad även om man flyttar mellan sidorna i websajten.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Init(object sender, EventArgs e)
        {
            var requestCookie = Request.Cookies[access_token];
            if (access_token == null)
            {
                access_token = Request.QueryString["code"];
                Page.ViewStateUserKey = access_token;

                var responseCookie = new HttpCookie(access_token)
                {
                    HttpOnly = true,
                    Value = access_token
                };

                Response.Cookies.Set(responseCookie);
            }
            else
            {
                Page.ViewStateUserKey = access_token;

                var responseCookie = new HttpCookie(access_token)
                {
                    HttpOnly = true,
                    Value = access_token
                };

                Response.Cookies.Set(responseCookie);
            }
            Page.PreLoad += master_Page_PreLoad;
        }

        /// <summary>
        /// Master page load , kollar om man är inloggad då hämtar users  id , access token och imgurl.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void master_Page_PreLoad(object sender, EventArgs e)
        {

            AuthConfig.RegisterOpenAuth();
            if (Request.QueryString["logout"] == "true")
            {
                access_token = null;
                return;
            }

            if (Request.QueryString["error"] == "access_denied")
            {
                Page.ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('User has denied access.')", true);
                return;
            }

            if (!string.IsNullOrEmpty(access_token))
            {
                string FbUsrData = FaceBookConnect.Fetch(access_token, "me");
                FaceBookUser fbUsr = new JavaScriptSerializer().Deserialize<FaceBookUser>(FbUsrData);
                fbUsr.PictureUrl = string.Format("https://graph.facebook.com/{0}/picture", fbUsr.Id);
                pnlFbUser.Visible = true;
                btnLogin.Visible = false;
                lblUsrName.Text = fbUsr.Name;
                PImage.ImageUrl = fbUsr.PictureUrl;
                FacebookDAL insertFacebook = new FacebookDAL();
                var returnedid = insertFacebook.getUsrData(fbUsr.Id);
                if (returnedid != fbUsr.Id)
                {
                    insertFacebook.InsertFacebookUserInfo(access_token, fbUsr.Id, fbUsr.Name);
                }
            }
        }


        /// <summary>
        /// Oncklick metod för inloggning system via facebook.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Login(object sender, EventArgs e)
        {

            FaceBookConnect.Authorize("user_photos,email", Request.Url.AbsoluteUri.Split('?')[0]);
        }

        /// <summary>
        /// Oncklick metod för loga ut knappen via facebook.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Logout(object sender, EventArgs e)
        {
            FaceBookConnect.Logout(Request.QueryString["code"]);
        }


        /// <summary>
        /// page load där kollar om message session har meddlande eller inte samt kollar om man har sökt om efter rubrik eller inte.
        /// </summary>
        string testOne;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Message != null)
            {
                SearchResult.Visible = true;
                SearchResult.Text = Message;
                Session.Remove("Message");
            }

            if (Request.QueryString["Title"] != null)
            {
                ImagesDAL dal = new ImagesDAL();
                testOne = Request.QueryString["Title"];
                searchLbl.Text = "Sökresultat för : (" + testOne + ")";
                dal.DisplaySearchResults(testOne);
                if (testOne != string.Empty)
                {
                    Repeater1.DataSource = dal.DisplaySearchResults(testOne);
                    Repeater1.DataBind();

                }

                else
                {
                    
                }
            }
           
        }

        /// <summary>
        /// Oncklick button metod för sök funktion.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Button1_Click(object sender, EventArgs e)
        {
            Response.Redirect("SökResultat?Title=" + Server.UrlEncode(TextBox1.Text));
        }
    }
}