using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DataBase;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;

namespace Share4UProjekt
{
    public partial class SiteMaster : MasterPage
    {
        private static  string code;
        public string Code
        {
            get { return code; }
        }
        protected  void Page_Init(object sender, EventArgs e)
        {    

            
             var requestCookie = Request.Cookies[code];
      
             if (code == null)
             {
                 code = Request.QueryString["code"];
                 Page.ViewStateUserKey = code;

                 var responseCookie = new HttpCookie(code)
                 {
                     HttpOnly = true,
                     Value = code
                 };

                 Response.Cookies.Set(responseCookie);
             }
             else
             {
                 Page.ViewStateUserKey = code;

                 var responseCookie = new HttpCookie(code)
                 {
                     HttpOnly = true,
                     Value = code
                 };

                 Response.Cookies.Set(responseCookie);
             }
            Page.PreLoad += master_Page_PreLoad;
         
        }

        protected void master_Page_PreLoad(object sender, EventArgs e)
        {

            AuthConfig.RegisterOpenAuth();
        
            //if (!IsPostBack)
            //{

                if (Request.QueryString["logout"] == "true")
                {
                    code = null;
                    return;
                }

                if (Request.QueryString["error"] == "access_denied")
                {
                    Page.ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('User has denied access.')", true);
                    return;
                }

             
                    if (!string.IsNullOrEmpty(code))
                    {
                        string data = FaceBookConnect.Fetch(code, "me");
                        FaceBookUser faceBookUser = new JavaScriptSerializer().Deserialize<FaceBookUser>(data);
                        faceBookUser.PictureUrl = string.Format("https://graph.facebook.com/{0}/picture", faceBookUser.Id);
                        pnlFaceBookUser.Visible = true;
                        btnLogin.Visible = false;
                        lblName.Text = faceBookUser.Name;
                        ProfileImage.ImageUrl = faceBookUser.PictureUrl;
                        InsertFB insertFB = new InsertFB();
                        var returnedid = insertFB.getuserdata(faceBookUser.Id);
                        if (returnedid != faceBookUser.Id)
                        {
                            insertFB.InsertInsertFB(code, faceBookUser.Id, faceBookUser.Name);
                        }
                    }
                    else
                    {

                    }
                
            //}
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }
        protected void Login(object sender, EventArgs e)
        {
           
            FaceBookConnect.Authorize("user_photos,email", Request.Url.AbsoluteUri.Split('?')[0]);
        }

        protected void Logout(object sender, EventArgs e)
        {
            FaceBookConnect.Logout(Request.QueryString["code"]);
        }
    }
}