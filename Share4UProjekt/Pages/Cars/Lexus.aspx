﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Lexus.aspx.cs" Inherits="Share4UProjekt.Pages.Cars.Lexus" %>
<asp:Content ID="Content4" ContentPlaceHolderID="HeadContent" runat="server">
  <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Lexus</h2>
   <asp:ListView ID="ImagesListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImagesListView_GetData"
        DataKeyNames="ImgID">
               <ItemTemplate>
            <span class="saucer" style="float: left; padding: 15px;">
                <asp:ImageButton CssClass="imgUserPhoto" OnCommand="imgUser_Command" CommandArgument='<%# "../../Images/" + Item.ImgName%>' ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br />
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
         <asp:DataPager ID="DataPager" runat="server" PageSize="14">
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