<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.Error" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
          <p>
        
              <asp:Image ID="Image1" runat="server"  ImageUrl="../Images2/404.jpg"/>
    </p>
    <p>
        <asp:HyperLink ID="HyperLink1" runat="server" Text="Tillbaka till startsidan" NavigateUrl='<%$ RouteUrl:routename=Default %>' CssClass="Msg"/>
    </p>
</asp:Content>
