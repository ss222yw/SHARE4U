<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Alfa Romeo.aspx.cs" Inherits="Share4UProjekt.Pages.Cars.Alfa_Romeo" %>

<asp:Content ID="Content4" ContentPlaceHolderID="HeadContent" runat="server">
  <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Alfa Romeo</h2>
   <asp:ListView ID="ImagesListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImagesListView_GetData"
        DataKeyNames="ImgID">
           <ItemTemplate>
            <span class="saucer" style="float: left; padding: 15px;">
                <asp:ImageButton CssClass="imgUserPhoto" OnCommand="imgUser_Command"  CommandArgument='<%#"../../Images/" + Item.ImgName %>' ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto" runat="server" alt="bilder." /><br />
                       </div>
            <div class="editor-field">
                <%#: Item.Title %>
            </div>
            <div class="editor-field">
                <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
            </div>
             <div id="likeandshare">
                <div class="fb-like" data-href="https://facebook.com/<%# Item.ImgName %>/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
                <div class="fb-share-button" data-href="http://facebook.com/<%# Item.ImgName %>" data-type="button"></div>
              </div>
                  <asp:LinkButton ID="LinkButton1" runat="server" OnCommand="LinkButton1_Command"   Visible="true" CssClass="comments" >Kommentar</asp:LinkButton>
                     <asp:Label ID="Label1" runat="server"  Visible="false">
                   <div class="CommentsPopup">
                       <div class="fb-comments" data-href="http://localhost:8317/comments/<%# Item.ImgName %>" data-numposts="2" data-colorscheme="dark" data-width="250px"></div>
                       </div>
                       </asp:Label>               
                                    <asp:Label ID="Label2" runat="server"  Visible="false">
                                      <asp:LinkButton ID="LinkButton2" runat="server" OnCommand="LinkButton2_Command"   Visible="true" CssClass="Close" >X</asp:LinkButton>
                       </asp:Label>   
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