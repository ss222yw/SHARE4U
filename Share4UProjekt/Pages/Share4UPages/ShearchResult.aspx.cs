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
            BackButton1.Attributes.Add("onclick", "javascript:history.go(-1);return false");
        }
    }
}