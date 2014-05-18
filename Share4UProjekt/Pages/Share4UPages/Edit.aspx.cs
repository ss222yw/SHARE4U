using Share4UProjekt.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Share4UProjekt.Pages.Share4UPages
{
    public partial class Edit : System.Web.UI.Page
    {
        private Service _service;

        private Service Service
        {
            get { return _service ?? (_service = new Service()); }
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        // The id parameter should match the DataKeyNames value set on the control
        // or be decorated with a value provider attribute, e.g. [QueryString]int id
        public Share4UProjekt.Model.Images EditFormView_GetItem([RouteData]int id)
        {
            try
            {
                return Service.GetImgsDataByID(id);
            }
            catch (Exception)
            {
                ModelState.AddModelError(String.Empty, "Fel inträffade då bilden hämtades vid redigering.");
                return null;
            }
        }

        public IEnumerable<Category> CategoryDropDownList_GetData()
        {
            return Service.GetImgCategory();
        }

        // The id parameter name should match the DataKeyNames value set on the control
        public void EditFormView_UpdateItem(Images img)
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
                    Response.RedirectToRoute("upload");
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