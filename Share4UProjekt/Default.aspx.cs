using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt
{
    public partial class _Default : Page
    {
        private static string fromRootToPhoto = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString(),
                "Images/"
                );

        protected void Page_Load(object sender, EventArgs e)
        {
            string photoFolder = Path.Combine(fromRootToPhoto, User.Identity.Name);

            if (Directory.Exists(photoFolder))
            {
                DisplayUploadedPhotos(photoFolder);
            }
        }
        public void DisplayUploadedPhotos(string folder)
        {
            string[] allPhotoFiles = Directory.GetFiles(folder);
            IList<string> allphotoPaths = new List<string>();
            string fileName;

            foreach (string f in allPhotoFiles)
            {
                fileName = Path.GetFileName(f);
                allphotoPaths.Add("Images/" + User.Identity.Name + "/" + fileName);
            }

            rptrUservids.DataSource = allphotoPaths;
            rptrUservids.DataBind();
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

    }
}