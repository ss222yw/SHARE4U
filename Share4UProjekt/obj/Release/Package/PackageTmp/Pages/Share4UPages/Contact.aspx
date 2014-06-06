<%@ Page Title="Contact" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Contact.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.Contact" %>


<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <h2>Kontakta oss</h2>
    <br />
    <h3><strong>Vi hjälper dig gärna!</strong></h3>
    <br />
    <div class="Contact">
    <h4>Ring oss</h4>
    <p>Vi på ShareCarPics4U svarar gärna på dina frågor. Våra kundservicemedarbetare på 0700563927 finns på plats vardagar kl. 08.00-20.00 och lör/sön 10.00-18.00.</p>
    </div>
    <div class="Contact1">
    <h4><strong>Skicka e-post till oss</strong></h4>
    <p>För snabbast service vänligen ring vår kundservice som har öppet vardagar 8030-20:00 samt lör/sön 10-18. Men vi försöker svara ditt meddlande via e-post så fort det går. 
       För att vi bäst skall kunna hantera ditt ärende vill vi att du använder vårt kontaktformulär eller skickar e-post till sahib@hotmail.se.
       För att använda vårt formulär: klicka på ”Skicka e-post”.</p>
    <asp:HyperLink ID="HyperLink3" runat="server" NavigateUrl="<%$ RouteUrl:routename=Msg %>" CssClass="Msg" Text="Skicka e-post"></asp:HyperLink>
    </div>
    <div class="Contact2">
        <h4><strong>Skicka brev till oss</strong></h4>
        <p>Om du vill skicka brev till oss ber vi dig använda denna adress: 
            <strong>
           ShareCarPicsForYou Kundservice 
           Box 400 
           393 22 Kalmar.
            </strong>
        </p>
    </div>
                                
</asp:Content>
