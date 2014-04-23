using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.FriendlyUrls;

namespace Share4UProjekt
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.EnableFriendlyUrls();

            routes.MapPageRoute("Default", "HomePage", "~/Default.aspx");

            routes.MapPageRoute("About", "OmOss", "~/About.aspx");

            routes.MapPageRoute("Contact", "kontakta", "~/Contact.aspx");

            routes.MapPageRoute("Ladda", "Ladda upp", "~/upload.aspx");

            //routes.MapPageRoute("CareateCarBrand", "Bilm�rke/ny", "~/Pages/CarAdPages/CreateCarBrand.aspx");

            //routes.MapPageRoute("CarAdEdit", "Bilannonser/{id}/edit", "~/Pages/CarAdPages/Edit.aspx");

            //routes.MapPageRoute("EditCarBrand", "Bilm�rke/redigera", "~/Pages/CarBrandPage/Edit.aspx");

            //routes.MapPageRoute("EditCarBrandID", "Bilm�rke/{id}/redigera", "~/Pages/CarBrandPage/Edit.aspx");

            //routes.MapPageRoute("CarAdDelete", "Bilannonser/{id}/tabort/{id1}", "~/Pages/CarAdPages/Delete.aspx");

            //routes.MapPageRoute("CarAdDetails", "Bilannonser/{id}", "~/Pages/CarAdPages/Details.aspx");

            //routes.MapPageRoute("DeleteCarBrand", "Bilm�rke/{id}/tabort", "~/Pages/CarBrandPage/Delete.aspx");

            //routes.MapPageRoute("Default", "", "~/Pages/CarAdPages/Listning.aspx");

            //routes.MapPageRoute("Error", "serverfel", "~/Pages/Shared/Error.aspx");
        }
    }
}
