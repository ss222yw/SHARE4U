<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="upload.aspx.cs" Inherits="Share4UProjekt.upload" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2>uppladdning sida!</h2>
    <br />
    <%--Validtion summery för uppladdning.--%>
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <asp:RegularExpressionValidator ID="fuUploadRegularExpressionValidator" runat="server" ErrorMessage="Filen måste vara av formaten jpg, jpeg, gif, png." ControlToValidate="fuUpload" Display="None" ValidationExpression=".*.(gif|jpg|jpeg|png|jpeg|GIF|JPG|PNG|JPEG)"></asp:RegularExpressionValidator>
    <asp:RequiredFieldValidator ID="fuUploadRequiredFieldValidator" runat="server" ErrorMessage="En bild måste väljas." Display="None" ControlToValidate="fuUpload"></asp:RequiredFieldValidator>
    <%--    uppladdning funktion--%>
    <asp:FileUpload ID="fuUpload" runat="server" />
    <asp:Button ID="btnUpload" Text="Ladda upp" runat="server" OnClick="btnUpload_Click" CssClass="dark" /><br />
    <br />
    <asp:Label ID="lblStatus" Text="" runat="server" />
    <br />
    <%-- label som innehåller namn på rubriken.--%>
    <label for="TitleTextBox" id="HeaderLabel" runat="server">Rubriken</label>
    <%--    Textbox där skriver man rubrilken på en bild.--%>
    <asp:TextBox ID="TitleTextBox" runat="server" Text="" MaxLength="255" CssClass="Header" />
    <%--    validation för textboxen--%>
    <asp:RequiredFieldValidator ID="HeaderRequiredFieldValidator" runat="server"
        ErrorMessage="Rubrik måste anges." ControlToValidate="TitleTextBox"
        Display="None">
    </asp:RequiredFieldValidator>
    <%--Label för rätt meddalnde--%>
    <asp:Label ID="SuccessLabel" Text="" runat="server" Visible="false" CssClass="success" />
    <%--  dropdown list för kategorier--%>
    <asp:DropDownList ID="CategoryDropDownList" runat="server"
        SelectMethod="CategoryDropDownList_GetData"
        DataTextField="Kategori"
        DataValueField="KategoriID"
        Visible="false"
        CssClass="DropDownList" />
    <%--    list view för bilderna.--%>
    <asp:ListView ID="ImgListView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        SelectMethod="ImgListView_GetData"
        DataKeyNames="ImgID"
        DeleteMethod="ImgListView_DeleteItem">
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

            <span>
                <asp:Image CommandArgument='<%# "../Images/" + Item.ImgName %>' ImageUrl='<%# "~/Images/" + Item.ImgName %>' ID="imgUserPhoto" runat="server" alt="bilder." CssClass="ImgSize" /><br />
                <br />
                <asp:LinkButton ID="LinkButton2" runat="server" CommandName="Delete" Text="Ta bort"
                    OnClientClick='<%# String.Format("return confirm (\"Är du säker att du vill ta bort" + Item.ImgName + "?\")") %>'
                    CausesValidation="false" CssClass="Red" />
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
                    <td>
                        <asp:Image
                            ImageUrl="Images2/Bild-Saknas.jpg" ID="imgUserPhoto"
                            runat="server" />
                    </td>
                </tr>
            </table>
        </EmptyDataTemplate>

    </asp:ListView>

</asp:Content>




