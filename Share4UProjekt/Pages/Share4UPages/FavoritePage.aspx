﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="FavoritePage.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.FavoritePage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Favorit sida!</h2>
    <asp:Label ID="LabelFavoriteMessage" runat="server" Text=""></asp:Label>
        <%--Validtion summery för uppladdning.--%>
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <asp:ListView ID="ImagesListView" runat="server"
        ItemType="Share4UProjekt.Model.Favorite"
        SelectMethod="GetUsrFavoriteImagesPageWiseByID"
        DataKeyNames="FavoriteID"
        DeleteMethod="ImgListView_DeleteItem">
        <LayoutTemplate>
            <table>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
            </table>
                  <div id ="Clear">
            <asp:DataPager ID="DataPager" runat="server" PageSize="16">
                <Fields>
                    <asp:NextPreviousPagerField ShowFirstPageButton="True"
                        FirstPageText=" Första "
                        ShowNextPageButton="false"
                        ShowPreviousPageButton="true"
                        PreviousPageText="Förra"
                        ButtonType="Button" />
                    <asp:NumericPagerField ButtonType="Link" />
                    <asp:NextPreviousPagerField ShowLastPageButton="True"
                        LastPageText=" Sista "
                        ShowNextPageButton="true"
                        ShowPreviousPageButton="false"
                        NextPageText="Nästa"
                        ButtonType="Button" />
                </Fields>
            </asp:DataPager>
                </div>
        </LayoutTemplate>
        <ItemTemplate>
            <span class="spanImgs">
                <asp:ImageButton CssClass="imgUserPhoto" OnCommand="imgUser_Command" CommandArgument='<%# "../../Images/" + Item.ImgName%>' ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br />
                   <asp:LinkButton ID="LinkButton2" runat="server" CommandName="Delete" Text="Ta bort från listan"
                    OnClientClick='<%# String.Format("return confirm (\"Är du säker att du vill ta bort" + Item.ImgName + "?\")") %>'
                    CausesValidation="false" CssClass="Red" />
                </div>
            </span>
        </ItemTemplate>
        <EmptyDataTemplate>
            <table>
                <tr>
                    <td>Din favorit lista är tom!
                    </td>
                </tr>
            </table>
        </EmptyDataTemplate>
    </asp:ListView>
</asp:Content>
