<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ShearchResult.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.ShearchResult" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Resultat av sökningen</h2>
    <br />
    <asp:Label ID="Label1" runat="server" Text=""></asp:Label>
       <asp:Label ID="searchLbl" runat="server" Text=""></asp:Label>
                    <div id="showImgLayout">
                        <%-- Resultatet av sök funktionen--%>
                        <asp:Repeater ID="Repeater1" runat="server">
                            <ItemTemplate>
                                <div class="imgPhotoTitle">
                                    <%#DataBinder.Eval(Container.DataItem, "Title")%>
                                    <%#DataBinder.Eval(Container.DataItem, "ImgName")%>
                                </div>
                                <div id="buttonstyle">
                                    <asp:Image ImageUrl='<%# "../../Images/" + DataBinder.Eval(Container.DataItem, "ImgName") %>' ID="imgUserPhoto" runat="server" alt="bilder." CssClass="ImgSearchSize" /><br />
                                </div>
                            </ItemTemplate>
                        </asp:Repeater>
                    </div>
    <br />
   <asp:Button ID="BackButton1" runat="server" Text="Tillbaka"  CssClass="savebuttons"/>
</asp:Content>
