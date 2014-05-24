﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Lexus.aspx.cs" Inherits="Share4UProjekt.Pages.Cars.Lexus" %>
<asp:Content ID="Content4" ContentPlaceHolderID="HeadContent" runat="server">
  <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Lexus</h2>
        <%--Validtion summery för uppladdning.--%>
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
   <asp:ListView ID="ImagesListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImagesListView_GetData"
        DataKeyNames="ImgID">
               <ItemTemplate>
          <span class="spanImgs">
                <asp:ImageButton CssClass="imgUserPhoto" OnCommand="imgUser_Command" CommandArgument='<%# "../../Images/" + Item.ImgName%>' ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br />
                <asp:ImageButton ID="ImageFavoriteButton" runat="server" CommandName='<%# Item.ImgName%>' OnCommand="ImageFavoriteButton_Command" ImageUrl='../../Images2/favorite_add.png' CssClass="favoriteButton"/>
                </div>
                <div class="editor-field">
                    Bilmärke :   <%#: Item.Title %>
                </div>
                <div class="editor-field">
                    Inlagd :  <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
                </div>
                </div>
             <div id="likeandshare">
                 <div class="fb-like" data-href="https://facebook.com/<%# Item.ImgName %>/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
                 <div class="fb-share-button" data-href="http://localhost:8317/Images//<%# Item.ImgName %>" data-type="button"></div>
             </div>
                <asp:HyperLink ID="HyperLink1" runat="server" Text="Kommentar" NavigateUrl='<%# GetRouteUrl("ShowImage", new { id = Item.ImgID }) %>' CssClass="Green" />
            </span>
        </ItemTemplate>
                <LayoutTemplate>
            <table>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
            </table>
             <%-- Pages visar 20 kontkater i en sida.--%>  
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