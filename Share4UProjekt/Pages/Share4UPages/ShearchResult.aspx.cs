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
            
            ImagesDAL dal = new ImagesDAL();

            if (Modell != null)
            {
                if (Modell != string.Empty)
                {
                    Repeater1.DataSource = dal.DisplaySearchResults(Modell);
                    Repeater1.DataBind();
                    dal.DisplaySearchResults(Modell);
                    if ((dal.Count) == 0)
                    {
                        searchLbl.Text = string.Format("Din sökresultat för   " + "<mark>(" + Modell + ")</mark>" + " gav tyvärr inga bilder.");
                    }
                    else if ((dal.Count) == 1)
                    {
                        searchLbl.Text = string.Format("Din sökresultat för    " + "<mark>(" + Modell + ")</mark>" + "  gav bara en bild.");
                    }
                    else if ((dal.Count) > 1)
                    {
                        searchLbl.Text = string.Format("Din sökresultat för    " + "<mark>(" + Modell + ")</mark>" + " gav : " + " {0} ", (dal.Count) + " bilder.");
                    }
                }
                else
                {
                    searchLbl.Text = "Du måste skriva i text rutan för att få resultat!!!";
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