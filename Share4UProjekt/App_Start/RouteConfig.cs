using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.FriendlyUrls;

namespace Share4UProjekt
{
    public  class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.EnableFriendlyUrls();

            routes.MapPageRoute("Default", "", "~/Default.aspx");

            routes.MapPageRoute("deftest", "HemSida", "~/Default.aspx");

            routes.MapPageRoute("Admin", "Admin", "~/Admin.aspx");

            routes.MapPageRoute("upload", "LaddaUpp", "~/upload.aspx");

            routes.MapPageRoute("About", "OmOss", "~/Pages/Share4UPages/About.aspx");

            routes.MapPageRoute("AllCars", "BilarAlla", "~/Pages/Share4UPages/AllCars.aspx");

            routes.MapPageRoute("Contact", "kontaktaOss", "~/Pages/Share4UPages/Contact.aspx");

            routes.MapPageRoute("Alfa Romeo", "AlfaRomeo", "~/Pages/Cars/Alfa Romeo.aspx");

            routes.MapPageRoute("Audi", "Audi", "~/Pages/Cars/Audi.aspx");

            routes.MapPageRoute("BMW", "BMW", "~/Pages/Cars/BMW.aspx");

            routes.MapPageRoute("Cadillac", "Cadillac", "~/Pages/Cars/Cadillac.aspx");

            routes.MapPageRoute("Chevrolet", "Chevrolet", "~/Pages/Cars/Chevrolet.aspx");

            routes.MapPageRoute("Chrysler", "Chrysler", "~/Pages/Cars/Chrysler.aspx");

            routes.MapPageRoute("Citroën", "Citroën", "~/Pages/Cars/Citroën.aspx");

            routes.MapPageRoute("Dodge", "Dodge", "~/Pages/Cars/Dodge.aspx");

            routes.MapPageRoute("Ferrari", "Ferrari", "~/Pages/Cars/Ferrari.aspx");

            routes.MapPageRoute("Fiat", "Fiat", "~/Pages/Cars/Fiat.aspx");

            routes.MapPageRoute("Ford", "Ford", "~/Pages/Cars/Ford.aspx");

            routes.MapPageRoute("Honda", "Honda", "~/Pages/Cars/Honda.aspx");

            routes.MapPageRoute("Hyundai", "Hyundai", "~/Pages/Cars/Hyundai.aspx");

            routes.MapPageRoute("Jaguar", "Jaguar", "~/Pages/Cars/Jaguar.aspx");

            routes.MapPageRoute("Jeep", "Jeep", "~/Pages/Cars/Jeep.aspx");

            routes.MapPageRoute("Kia", "Kia", "~/Pages/Cars/Kia.aspx");

            routes.MapPageRoute("Land Rover", "LandRover", "~/Pages/Cars/Land Rover.aspx");

            routes.MapPageRoute("Lexus", "Lexus", "~/Pages/Cars/Lexus.aspx");

            routes.MapPageRoute("Mazda", "Mazda", "~/Pages/Cars/Mazda.aspx");

            routes.MapPageRoute("Mercedes Benz", "MercedesBenz", "~/Pages/Cars/Mercedes Benz.aspx");

            routes.MapPageRoute("Mini", "Mini", "~/Pages/Cars/Mini.aspx");

            routes.MapPageRoute("Mitsubishi", "Mitsubishi", "~/Pages/Cars/Mitsubishi.aspx");

            routes.MapPageRoute("Nissan", "Nissan", "~/Pages/Cars/Nissan.aspx");

            routes.MapPageRoute("Opel", "Opel", "~/Pages/Cars/Opel.aspx");

            routes.MapPageRoute("Peugeot", "Peugeot", "~/Pages/Cars/Peugeot.aspx");

            routes.MapPageRoute("Porsche", "Porsche", "~/Pages/Cars/Porsche.aspx");

            routes.MapPageRoute("Renault", "Renault", "~/Pages/Cars/Renault.aspx");

            routes.MapPageRoute("SAAB", "SAAB", "~/Pages/Cars/SAAB.aspx");

            routes.MapPageRoute("SEAT", "SEAT", "~/Pages/Cars/SEAT.aspx");

            routes.MapPageRoute("Smart", "Smart", "~/Pages/Cars/Smart.aspx");

            routes.MapPageRoute("Skoda", "Skoda", "~/Pages/Cars/Skoda.aspx");

            routes.MapPageRoute("Subaru", "Subaru", "~/Pages/Cars/Subaru.aspx");

            routes.MapPageRoute("Suzuki", "Suzuki", "~/Pages/Cars/Suzuki.aspx");

            routes.MapPageRoute("Toyota", "Toyota", "~/Pages/Cars/Toyota.aspx");

            routes.MapPageRoute("Volkswagen", "Volkswagen", "~/Pages/Cars/Volkswagen.aspx");

            routes.MapPageRoute("VOLVO", "VOLVO", "~/Pages/Cars/VOLVO.aspx");

            routes.MapPageRoute("Klassika", "Klassiska", "~/Pages/Cars/Klassika.aspx");

            routes.MapPageRoute("Edit", "LaddaUppRedigera{id}", "~/Pages/Share4UPages/Edit.aspx");

            routes.MapPageRoute("test", "Redigera{id}", "~/Pages/Admin/EditA.aspx");
        }
    }
}
