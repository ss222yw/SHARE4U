<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="showImg.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.showImg" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>

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

            <span class="saucer" style="float: left; padding: 15px;">
                <asp:Image CssClass="cssShowCars" ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br />
                </div>
                <div class="editor-field">
                    Bilmärke :   <%#: Item.Title %>
                </div>
                <div class="editor-field">
                    Inlagd :  <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
                </div>
                <div class="fb-comments" data-href="http://localhost:8317/comments/<%# Item.ImgName %>" data-numposts="5" data-colorscheme="light" data-width="600"></div>
                </div>
         
            </span>
        </ItemTemplate>
        <EmptyDataTemplate>
            <table>
                <tr>
                    <td>Bilderna saknas.
                    </td>
                </tr>
            </table>
        </EmptyDataTemplate>
    </asp:ListView>

</asp:Content>
