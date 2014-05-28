using ASPSnippets.FaceBookAPI;
using FB;
using Share4UProjekt.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Admin
{
    public partial class EditA : System.Web.UI.Page
    {
        private Service _service;

        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }
        public string Access_Token { get { return ((SiteMaster)this.Master).Access_Token; } }



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
            Response.RedirectToRoute("Admin", close);
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

            if (Access_Token == null)
            {
                EditFormView.Visible = false;

            }
        }

        // The id parameter should match the DataKeyNames value set on the control
        // or be decorated with a value provider attribute, e.g. [QueryString]int id
        public Share4UProjekt.Model.Images EditAFormView_GetItem([RouteData]int id)
        {
           
            try
            {
                Global adminGlobal = new Global();
                var admin = adminGlobal.Admin;
                FaceBookUser fbUsr = HttpContext.Current.Cache["GetUserInfo"] as FaceBookUser;
                if (admin == fbUsr.Id)
                {
                    EditFormView.Visible = true;
                    return Service.GetImgsDataByID(id);
                }
                else
                {
                    SuccessTest.Visible = true;
                    SuccessTest.Text = "Detta är en admin sida!";
                    EditFormView.Visible = false;
                }
                

            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Fel inträffade då bilden hämtades vid redigering.");
                return null;
            }
            return null;
        }

      


        public IEnumerable<Category> CategoryDropDownList_GetData()
        {
            return Service.GetImgCategory();
        }

        // The id parameter name should match the DataKeyNames value set on the control
        public void EditAFormView_UpdateItem(Images img)
        {
            var kategoriID = 0;

            DropDownList dropdownList = (DropDownList)EditFormView.FindControl("CategoryDropDownList");
            foreach (ListItem item in dropdownList.Items)
            {
                if (item.Selected)
                {
                    kategoriID = int.Parse(item.Value);

                }
            }
            try
            {


                if (TryUpdateModel(img))
                {
                    Service.UpdateImg(img, kategoriID);
                    Page.SetTempData("Message", "Bilden har uppdaterats.");
                    Response.RedirectToRoute("Admin");
                    Context.ApplicationInstance.CompleteRequest();
                }
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "");
            }
        }
    }
}