<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="Share4UProjekt.Error" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
        <div id="ErrorLayout">
               <asp:Image
                            ImageUrl="Images2/404.jpg" ID="imgUserPhoto"
                            runat="server" />
            </div>
    <p>
        <asp:HyperLink ID="HyperLink1" runat="server" Text="Tillbaka till startsidan" NavigateUrl='<%$ RouteUrl:routename=Default %>' CssClass="Msg"/>
    </p>
</asp:Content>
