﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using Facebook;
using Share4UProjekt.Model.DAL;
using System.Web.Script.Serialization;
using Facebook.Reflection;
using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace Share4UProjekt
{
    public partial class upload : System.Web.UI.Page
    {
        private Service _service;

        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
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
        protected void closeImg_Click(object sender, ImageClickEventArgs e)
        {
            ResponsePanel.Visible = true;
            var close = Request.QueryString["Message"];
            Response.RedirectToRoute("upload", close);
        }
        protected void Page_Load(object sender, EventArgs e)
        {

            if (Message != null)
            {
                ResponsePanel.Visible = true;
                SuccessTest.Visible = true;
                SuccessTest.Text = Message;
                Session.Remove("Message");
            }

            if (Access_Token != null)
            {
                CategoryDropDownList.Visible = true;
            }
            else
            {
                lblStatus.Text = "Du måste vara inloggad för att kunna se mina sidor!";
                fuUpload.Visible = false;
                btnUpload.Visible = false;
                CategoryDropDownList.Visible = false;
                ImgListView.Visible = false;
                TitleTextBox.Visible = false;
                HeaderLabel.Visible = false;
            }
        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {

            if (Access_Token != null)
            {

                if (IsValid)
                {
                    if (TitleTextBox.Text != string.Empty)
                    {

                        if (fuUpload.HasFile && fuUpload.PostedFile != null)
                        {
                            if (fuUpload.FileName.Length <= 100)
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


                                        if (fuUpload.PostedFile.ContentType == "image/gif")
                                        {
                                            fuUpload.SaveAs(Path.Combine(imgFolder, f));
                                        }
                                        else
                                        {
                                            //Tagit från stack over flow och implmenterat i min egen kod.
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
                                        }

                                        var categoryID = 0;

                                        foreach (ListItem bm in CategoryDropDownList.Items)
                                        {
                                            if (bm.Selected)
                                            {
                                                categoryID = int.Parse(bm.Value);

                                            }
                                        }
                                        var Title = TitleTextBox.Text;
                                        Message = "Bilden har laddat upp " + f;
                                        string FbUsrData = FaceBookConnect.Fetch(Access_Token, "me");
                                        var fbUsr = new JavaScriptSerializer().Deserialize<FaceBookUser>(FbUsrData);
                                        Service.InsertUserImages(f, fbUsr.Id, categoryID, Title);
                                        Response.RedirectToRoute("upload");
                                    }
                                    else
                                        lblStatus.Text = "Bilden får inte vara större än 5MB.";
                                }
                                else
                                    lblStatus.Text = "Bilden måste vara av typen png, jpg, jpeg eller gif.";

                            }
                            else
                                lblStatus.Text = "Namn på bilden får inte vara större än 95 tecken.";
                        }

                        else

                            lblStatus.Text = "Du måste välja en bild och skriva  för att kunna ladda upp!.";
                    }
                    else
                        lblStatus.Text = "Modellen måste anges!";
                }
            }
            else
            {
                lblStatus.Text = "Logga in för att kunna ladda upp!!!";
                fuUpload.Visible = false;
                btnUpload.Visible = false;
                CategoryDropDownList.Visible = false;
                ImgListView.Visible = false;
                TitleTextBox.Visible = false;
                HeaderLabel.Visible = false;
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
            string FbUsrData = FaceBookConnect.Fetch(Access_Token, "me");
            var fbUsr = new JavaScriptSerializer().Deserialize<FaceBookUser>(FbUsrData);
            return Service.GetUsrPageWiseByID(maximumRows, startRowIndex, out totalRowCount, fbUsr.Id);
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
                Message = "bilden togs bort.";
                Response.RedirectToRoute("upload");
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Ett oväntat fel inträffade då bilden skulle tas bort.");
            }
        }
    }
}