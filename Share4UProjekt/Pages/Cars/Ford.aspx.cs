using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Share4UProjekt.Model.DAL;
using System.Text;
using Share4UProjekt.Model;

namespace Share4UProjekt.Pages.Cars
{
    public partial class Ford : System.Web.UI.Page
    {
        private Service _service;

        // Service skapas först då det behövs för första gången.
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
            return Service.GetImagesPageWiseByID(maximumRows, startRowIndex, out totalRowCount, 13);
        }

        protected void LinkButton1_Command(object sender, CommandEventArgs e)
        {
            ListViewDataItem item = (ListViewDataItem)(sender as Control).NamingContainer;
            Label lblStatus = (Label)item.FindControl("Label1");
            lblStatus.Visible = true;
            ListViewDataItem item2 = (ListViewDataItem)(sender as Control).NamingContainer;
            Label lblStatus2 = (Label)item2.FindControl("Label2");
            lblStatus2.Visible = true;
        }

        protected void LinkButton2_Command(object sender, CommandEventArgs e)
        {
            ListViewDataItem item2 = (ListViewDataItem)(sender as Control).NamingContainer;
            Label lblStatus2 = (Label)item2.FindControl("Label2");
            lblStatus2.Visible = false;
        }
    }
}