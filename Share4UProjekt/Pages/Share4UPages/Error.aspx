<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.Error" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
          <p>
        Vi är beklagar att ett fel inträffade och vi inte kunde hantera din förfrågan.
    </p>
    <p>
        <asp:HyperLink ID="HyperLink1" runat="server" Text="Tillbaka till startsidan" NavigateUrl='<%$ RouteUrl:routename=Default %>' />
    </p>
</asp:Content>
