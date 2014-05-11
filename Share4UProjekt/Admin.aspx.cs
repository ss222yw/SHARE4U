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
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model;

namespace Share4UProjekt
{
    public partial class Admin : System.Web.UI.Page
    {

        private Service _service;

        
        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }
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

        public string Code { get { return ((SiteMaster)this.Master).Code; } }

        private static string fromRootToPhoto = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString(),
                "Images"
                );

        public static bool Exists(string name)
        {
            return File.Exists(Path.Combine(fromRootToPhoto, name));
        }
        public IEnumerable<Category> CategoryDropDownList_GetData()
        {
            return Service.GetImgCategory();
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Message != null)
            {
                SuccessLabel.Visible = true;
                SuccessLabel.Text = Message;
                Session.Remove("Message");
            }
            if (Code == null)
            {
                lblStatus.Text = "Logga in för att kunna styra innehållet!";
                fuUpload.Visible = false;
                btnUpload.Visible = false;
                btnDelete.Visible = false;
                CategoryDropDownList.Visible = false;
                ImgListView.Visible = false;
                TitleTextBox.Visible = false;
                HeaderLabel.Visible = false;
            }
            else
            {
                
                Global adminGlobal = new Global();
                var admin = adminGlobal.Admin;
                string data = FaceBookConnect.Fetch(Code, "me");
                FacebookOne facebookUser = new JavaScriptSerializer().Deserialize<FacebookOne>(data);
                if (facebookUser.Id == admin)
                {
                    CategoryDropDownList.Visible = true;

                }
                else
                {
                    lblStatus.Text = "Detta är en admin sida!";
                    fuUpload.Visible = false;
                    btnUpload.Visible = false;
                    btnDelete.Visible = false;
                    CategoryDropDownList.Visible = false;
                    ImgListView.Visible = false;
                    TitleTextBox.Visible = false;
                    HeaderLabel.Visible = false;
                }
            }
          
        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {
           if (TitleTextBox.Text != string.Empty)
            {

            if (fuUpload.HasFile)
            {

                if ((fuUpload.PostedFile.ContentType == "image/png") ||
                     (fuUpload.PostedFile.ContentType == "image/jpeg") ||
                    (fuUpload.PostedFile.ContentType == "image/jpg") ||
                     (fuUpload.PostedFile.ContentType == "image/gif"))
                {
                    if (Convert.ToInt64(fuUpload.PostedFile.ContentLength) < 5000000)
                    {
                        string imgFolder = Path.Combine(fromRootToPhoto, User.Identity.Name);
                        int count = 1;
                        string f = fuUpload.FileName;
                        if (Exists(f))
                        {

                            string extension = Path.GetExtension(f);
                            string nameOnly = Path.GetFileNameWithoutExtension(f);
                            while (Exists(f))
                            {
                                f = string.Format("{0}({1}){2}", nameOnly, count, extension);
                                count++;

                            }
                        }
                        fuUpload.SaveAs(Path.Combine(imgFolder, f));

                        var categoryID = 0;

                        foreach (ListItem bm in CategoryDropDownList.Items)
                        {
                            if (bm.Selected)
                            {
                                categoryID = int.Parse(bm.Value);

                            }
                        }
                        var Title = TitleTextBox.Text;
                        lblStatus.Text = "<font color='Green'>Bilden har laddat upp " + f + "</font>";
                        string data = FaceBookConnect.Fetch(Code, "me");
                        FaceBookUser faceBookUser = new JavaScriptSerializer().Deserialize<FaceBookUser>(data);
                        Service.InsertUserImages(f, faceBookUser.Id, categoryID, Title);
                        Response.RedirectToRoute("upload");
                    }
                    else
                        lblStatus.Text = "Bilden får inte vara större än 5MB.";
                }
                else
                    lblStatus.Text = "Bilden måste vara av typen png, jpg, jpeg eller gif.";
            }
            else
            

                lblStatus.Text = "Du måste välja en bild för att kunna ladda upp!.";
            }
           else
               lblStatus.Text = "Rubriken måste anges!";
            
        }

        protected void btnDelete_Click(object sender, EventArgs e)
        {

            bool deletionOccurs = false;

            foreach (ListViewItem ri in ImgListView.Items)
            {
                CheckBox cb = ri.FindControl("cbDelete") as CheckBox;

                if (cb.Checked)
                {
                    string fromPhotoToExtension = cb.Attributes["special"];
                    string NewF = fromPhotoToExtension.Replace("Images//", "");
                    string fromRootToHome = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString()

                );
                    string fileToDelete = Path.Combine(fromRootToHome, fromPhotoToExtension);
                    File.Delete(fileToDelete);
                    Service.DeleteUserImages(NewF);
                    Message = "bilden/bilderna togs bort.";
                    deletionOccurs = true;
                }
            }

            if (deletionOccurs)
                Response.RedirectToRoute("upload");
            else
                lblStatus.Text = "välja bilden som du vill ta bort sen tryck på knappen Ta bort!.";


        }

        // The return type can be changed to IEnumerable, however to support
        // paging and sorting, the following parameters must be added:
        //     int maximumRows
        //     int startRowIndex
        //     out int totalRowCount
        //     string sortByExpression
        public IEnumerable<Share4UProjekt.Model.Images> ImgListView_GetData(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            string data = FaceBookConnect.Fetch(Code, "me");
            FacebookOne facebookUser = new JavaScriptSerializer().Deserialize<FacebookOne>(data);
            return Service.GetImagesPageWise(maximumRows, startRowIndex, out totalRowCount);
            
        }
    }
}