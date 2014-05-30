<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="showImg.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.showImg" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>
   <div id="showImgLayout">
    <asp:ListView ID="ImagesListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImagesListView_GetData"
        DataKeyNames="ImgID">
        <LayoutTemplate>

            <table>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
            </table>

        </LayoutTemplate>
        <ItemTemplate>
            <span>
                <asp:Image CssClass="cssShowCars" ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br />
                </div>
                <div class="editor-field">
                    Modell :   <%#: Item.Title %>
                </div>
                <div class="editor-field">
                    Inlagd :  <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
                </div>
                <%-- Tagit från facebook developer och ändrat så den passar min egen kod--%>
                <div class="fb-comments" data-href="http://localhost:8317/comments/<%# Item.ImgName %>" data-numposts="5" data-colorscheme="dark" data-width="600"></div>
                </div>
            </span>
           
        </ItemTemplate>
        <EmptyDataTemplate>
            <table>
                <tr>
                    <td>
                        <asp:Image
                            ImageUrl="../../Images2/Bild-Saknas.jpg" ID="imgUserPhoto"
                            runat="server" />
                    </td>
                </tr>
            </table>
        </EmptyDataTemplate>
    </asp:ListView>
     <asp:Button ID="BackButton1" runat="server" Text="Tillbaka"  CssClass="savebuttons"/>
       </div>
</asp:Content>
