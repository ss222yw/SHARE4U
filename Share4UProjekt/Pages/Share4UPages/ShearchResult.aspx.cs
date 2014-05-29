using Share4UProjekt.Model.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Share4UPages
{
    public partial class ShearchResult : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Modell != null)
            {
                ImagesDAL dal = new ImagesDAL();
                searchLbl.Text = "Sökresultat för   (" + Modell + ")  : är {0}";
                dal.DisplaySearchResults(Modell);
                if (Modell != string.Empty)
                {
                    Repeater1.DataSource = dal.DisplaySearchResults(Modell);
                    Repeater1.DataBind();
                    BackButton1.Attributes.Add("onclick", "javascript:history.go(-1);return false");
                }
            }
            else
            {
                Response.RedirectToRoute("Default");
            }
        
        }
        public string Modell { get { return ((SiteMaster)this.Master).Modell; } }

    }
}