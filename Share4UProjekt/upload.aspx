<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="upload.aspx.cs" Inherits="Share4UProjekt.upload" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="Scripts/jquery.fancybox-1.3.4/jquery-1.4.3.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.pack.js" type="text/javascript"></script>
    <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript"> </script>
    <script type="text/javascript">
        $(document).ready(function () {
            $("a[rel=example_group]").fancybox({
                'transitionIn': 'none',
                'transitionOut': 'none',
                'titlePosition': 'inside',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-inside">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
                }
            });
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2>uppladdning sida!</h2>
    <br />
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <asp:FileUpload ID="fuUpload" runat="server" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <asp:Button ID="btnUpload" Text="Ladda upp" runat="server" OnClick="btnUpload_Click" CssClass="dark" /><br />
    <br />
    <asp:Label ID="lblStatus" Style="color: Red;" Text="&nbsp;" runat="server" />
    <br />
    <br />
    <asp:Button ID="btnDelete" Text="Ta bort" runat="server" OnClick="btnDelete_Click" CssClass="light" /><br />
    <br />
    <label for="TitleTextBox" id="HeaderLabel" runat="server">Rubriken</label>
    <asp:TextBox ID="TitleTextBox" runat="server" Text="" MaxLength="255" CssClass="Header" />
    <asp:RequiredFieldValidator ID="HeaderRequiredFieldValidator" runat="server"
        ErrorMessage="Rubrik måste anges." ControlToValidate="TitleTextBox"
        Display="None">
    </asp:RequiredFieldValidator>
    <asp:Label ID="SuccessLabel" Text="" runat="server" Visible="false" CssClass="success" />
    <asp:Label ID="Label1" Text="&nbsp;" runat="server" Visible="false" CssClass="chMke" />
    <asp:DropDownList ID="CategoryDropDownList" runat="server"
        SelectMethod="CategoryDropDownList_GetData"
        DataTextField="Kategori"
        DataValueField="KategoriID"
        Visible="false"
        CssClass="DropDownList" />
    <asp:ListView ID="ImgListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImgListView_GetData"
        DataKeyNames="ImgID">
        <LayoutTemplate>
            <table>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
            </table>
            <asp:DataPager ID="DataPager" runat="server" PageSize="66">
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
        <ItemTemplate>

            <span class="saucer" style="float: left; padding: 15px;">
                <asp:Image CommandArgument='<%# "../Images/" + Item.ImgName %>' ImageUrl='<%# "~/Images/" + Item.ImgName %>' ID="imgUserPhoto" runat="server" alt="bilder." CssClass="ImgSize" /><br />
                <br />
                <asp:CheckBox special='<%# Item.ImgName %>' ID="cbDelete" Text="Välj" runat="server" />
                <asp:DropDownList ID="CategoryDropDownList2" runat="server"
                    SelectMethod="CategoryDropDownList_GetData"
                    DataTextField="Kategori"
                    DataValueField="KategoriID"
                    Visible="true"
                    Enabled="false"
                    CssClass="DropDownList"
                    SelectedValue='<%# Item.KategoriID %>' />
                </div><div class="editor-label">
                    <label for="Header"><strong>Rubrik :</strong></label>
                </div>
                <div class="editor-field">
                    <%#: Item.Title %>
                </div>
                <div class="editor-label">
                    <label for="Date"><strong>Datum :</strong></label>
                </div>
                <div class="editor-field">
                    <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
                </div>

                <asp:HyperLink ID="HyperLink1" runat="server" Text="Redigera" NavigateUrl='<%# GetRouteUrl("Edit", new { id = Item.ImgID }) %>' />
            </span>
        </ItemTemplate>
        <EmptyDataTemplate>
            <table>
                <tr>
                    <td>Bilderna sakans!
                    </td>
                </tr>
            </table>
        </EmptyDataTemplate>

    </asp:ListView>

</asp:Content>




