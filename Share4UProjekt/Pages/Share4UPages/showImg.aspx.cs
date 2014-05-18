using Share4UProjekt.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.ModelBinding;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Share4UPages
{
    public partial class showImg : System.Web.UI.Page
    {


        private Service _service;

        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }


        protected void Page_Load(object sender, EventArgs e)
        {

        }


        public Images ImagesListView_GetData([RouteData] int id)
        {
            try
            {
                return Service.GetImgsDataByID(id);
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Fel inträffade då artikeln skulle hämtas.");
                return null;
            }
        }

    }
}