using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DataBase;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;

namespace Share4UProjekt
{
    public partial class upload : System.Web.UI.Page
    {
        private static string fromRootToPhoto = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString(),
                "Images/"
                );

        public static bool Exists(string name)
        {
            return File.Exists(Path.Combine(fromRootToPhoto, name));
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!IsPostBack)
            //{
            string code = ((SiteMaster)this.Master).Code;
            if (code != null)
            {

                string photoFolder = Path.Combine(fromRootToPhoto, User.Identity.Name);

                if (Directory.Exists(photoFolder))
                {
                    DisplayUploadedPhotos(photoFolder);
                }
            }
            else
            {
                lblStatus.Text = "Du måste vara inloggad för att kunna se mina sidor!";
                fuUpload.Visible = false;
                btnUpload.Visible = false;
                btnDelete.Visible = false;
            }
            //}
        }
        protected void btnUpload_Click(object sender, EventArgs e)
        {
            if (fuUpload.HasFile)
            {
                if ((fuUpload.PostedFile.ContentType == "image/png") ||
                     (fuUpload.PostedFile.ContentType == "image/jpeg") ||
                    (fuUpload.PostedFile.ContentType == "image/jpg") ||
                     (fuUpload.PostedFile.ContentType == "image/gif"))
                {
                    //(Page.Master.FindControl("btnLogin") as ImageButton).Visible = false;
                    // (Page.Master.FindControl("pnlFaceBookUser") as Panel).Visible = true;
                    if (Convert.ToInt64(fuUpload.PostedFile.ContentLength) < 5000000)
                    {
                        string imgFolder = Path.Combine(fromRootToPhoto, User.Identity.Name);
                        int count = 1;

                        if (Exists(fuUpload.FileName))
                        {
                            string f = fuUpload.FileName;
                            string extension = Path.GetExtension(fuUpload.FileName);
                            string nameOnly = Path.GetFileNameWithoutExtension(fuUpload.FileName);
                            while (Exists(f))
                            {
                                f = string.Format("{0}({1}){2}", nameOnly, count, extension);
                                count++;

                            }
                            fuUpload.SaveAs(Path.Combine(imgFolder, f));
                        }
                        fuUpload.SaveAs(Path.Combine(imgFolder, fuUpload.FileName));
                        DisplayUploadedPhotos(imgFolder);

                        lblStatus.Text = "<font color='Green'>Bilden har laddat upp " + fuUpload.FileName + "</font>";
                        ImagesDAL Imgs = new ImagesDAL();
                        Imgs.InsertUserImages(fuUpload.FileName);
                    }
                    else
                        lblStatus.Text = "Bilden får inte vara större än 5MB.";
                }
                else
                    lblStatus.Text = "Bilden måste vara av typen png, jpg, jpeg eller gif.";
            }
            else
            {

                lblStatus.Text = "Du måste välja en bild för att kunna ladda upp!.";
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

        protected void btnDelete_Click(object sender, EventArgs e)
        {

            bool deletionOccurs = false;

            foreach (RepeaterItem ri in rptrUservids.Items)
            {
                CheckBox cb = ri.FindControl("cbDelete") as CheckBox;

                if (cb.Checked)
                {
                    string fromPhotoToExtension = cb.Attributes["special"];
                    string  NewF = fromPhotoToExtension.Replace("Images//", "");
                    string fromRootToHome = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString()

                );
                    string fileToDelete = Path.Combine(fromRootToHome, fromPhotoToExtension);
                    File.Delete(fileToDelete);
                    ImagesDAL DlImgs = new ImagesDAL();
                    DlImgs.DeleteUserImages(NewF);
                    lblStatus.Text = "<font color='Green'>bilden/bilderna togs bort.</font>";
                    deletionOccurs = true;
                }
            }

            if (deletionOccurs)
                DisplayUploadedPhotos(Path.Combine(fromRootToPhoto, User.Identity.Name));
            else
                lblStatus.Text = "välja bilden som du vill ta bort sen tryck på knappen Ta bort!.";


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