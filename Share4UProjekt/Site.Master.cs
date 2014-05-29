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
using System.Collections.Specialized;

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
        string url = HttpContext.Current.Request.Url.AbsoluteUri;
        /// <summary>
        /// Hämtar access token för facebook inlogging system.
        /// </summary>

        /// <summary>
        /// access token session
        /// </summary>
        private string access_token
        {
            get
            {
                return Session["code"] as string;
            }
            set
            {
                Session["code"] = value;
            }
        }

        public string Access_Token
        {
            get { return access_token; }
        }
        /// <summary>
        /// Title session
        /// </summary>
        private string modell
        {
            get
            {
                return Session["Title"] as string;
            }
            set
            {
                Session["Title"] = value;
            }
        }

        public string Modell
        {
            get { return modell; }
        }



        /// <summary>
        /// Sparar facebook access token i session så den kommer ihåg att man inloggad även om man flyttar mellan sidorna i websajten.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Init(object sender, EventArgs e)
        {
            if (access_token == null)
            {
                access_token = Request.QueryString["code"];
                if (access_token != null)
                {
                    string[] separateURL = url.Split('?');
                    NameValueCollection NewAccessToken = System.Web.HttpUtility.ParseQueryString(separateURL[1]);
                    NewAccessToken.Remove("code");
                    url = separateURL[0] + NewAccessToken;
                    Response.Redirect(url);
                }
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
            if (!string.IsNullOrEmpty(access_token))
            {

                string FbUsrData = FaceBookConnect.Fetch(access_token, "me");
                FaceBookUser fbUsr = new JavaScriptSerializer().Deserialize<FaceBookUser>(FbUsrData);
                //Tagit en delvis kod från aspsnipet.
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
        ///Tagit från aspdotnet och impelmnterat i min egen kod.
        protected void Login(object sender, EventArgs e)
        {

            FaceBookConnect.Authorize("user_photos,email", url);
        }

        /// <summary>
        /// Oncklick metod för loga ut knappen via facebook.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Logout(object sender, EventArgs e)
        {
            access_token = null;
            FaceBookConnect.Logout(access_token);
        }


        /// <summary>
        /// page load där kollar om message session har meddlande eller inte samt kollar om man har sökt om efter Modell eller inte.
        /// </summary>
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
                
                modell = Request.QueryString["Title"];
                Response.RedirectToRoute("SokResultat");

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