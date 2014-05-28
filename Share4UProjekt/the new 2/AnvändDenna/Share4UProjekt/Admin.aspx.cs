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
using System.Web.ModelBinding;
using System.Drawing;
using System.Drawing.Drawing2D;

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

        public string Access_Token { get { return ((SiteMaster)this.Master).Access_Token; } }

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
            if (Access_Token == null)
            {
                lblStatus.Text = "Logga in för att kunna styra innehållet!";
                fuUpload.Visible = false;
                btnUpload.Visible = false;
                CategoryDropDownList.Visible = false;
                ImgListView.Visible = false;
                TitleTextBox.Visible = false;
                HeaderLabel.Visible = false;
            }
            else
            {

                Global adminGlobal = new Global();
                var admin = adminGlobal.Admin;
                string data = FaceBookConnect.Fetch(Access_Token, "me");
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
                    CategoryDropDownList.Visible = false;
                    ImgListView.Visible = false;
                    TitleTextBox.Visible = false;
                    HeaderLabel.Visible = false;
                }
            }

        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {
            if (IsValid)
            {

                if (TitleTextBox.Text != string.Empty)
                {

                    if (fuUpload.HasFile && fuUpload.PostedFile != null)
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

                                Bitmap originalBMP = new Bitmap(fuUpload.FileContent);
                                int origWidth = originalBMP.Width;
                                int origHeight = originalBMP.Height;
                                int newWidth = 600;
                                int newHeight = 400;
                                Bitmap newBMP = new Bitmap(originalBMP, newWidth, newHeight);
                                Graphics oGraphics = Graphics.FromImage(newBMP);
                                oGraphics.SmoothingMode = SmoothingMode.AntiAlias;
                                oGraphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                                oGraphics.DrawImage(originalBMP, 0, 0, newWidth, newHeight);
                                newBMP.Save(Path.Combine(imgFolder, f));
                                originalBMP.Dispose();
                                newBMP.Dispose();
                                oGraphics.Dispose();

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
                                string data = FaceBookConnect.Fetch(Access_Token, "me");
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
        }

        // The return type can be changed to IEnumerable, however to support
        // paging and sorting, the following parameters must be added:
        //     int maximumRows
        //     int startRowIndex
        //     out int totalRowCount
        //     string sortByExpression
        public IEnumerable<Share4UProjekt.Model.Images> ImgListView_GetData(int maximumRows, int startRowIndex, out int totalRowCount)
        {
            string data = FaceBookConnect.Fetch(Access_Token, "me");
            FacebookOne facebookUser = new JavaScriptSerializer().Deserialize<FacebookOne>(data);
            return Service.GetImagesPageWise(maximumRows, startRowIndex, out totalRowCount);

        }

        // The id parameter name should match the DataKeyNames value set on the control
        public void ImgListView_DeleteItem(Images image)
        {
            try
            {
                var fromRootToPhoto = Path.Combine(
                AppDomain.CurrentDomain.GetData("APPBASE").ToString(),
                "Images"
                );

                var imagedata = Service.GetImgsDataByID(image.ImgID);
                string fileToDelete = Path.Combine(fromRootToPhoto, imagedata.ImgName);
                File.Delete(fileToDelete);
                Service.DeleteUserImages(imagedata.ImgName);
                Message = "bilden/bilderna togs bort.";
                Response.RedirectToRoute("Admin");
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Ett oväntat fel inträffade då artikeln skulle tas bort.");
            }
        }
    }
}