<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Edit.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.Edit" %>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <asp:ValidationSummary ID="ValidationSummary2" runat="server" CssClass="validation-summary-errors" ValidationGroup="EditValidation" ShowModelStateErrors="false" />
    <asp:FormView ID="EditFormView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        DataKeyNames="ImgID"
        DefaultMode="Edit"
        RenderOuterTable="false"
        SelectMethod="EditFormView_GetItem"
        UpdateMethod="EditFormView_UpdateItem">
        <EditItemTemplate>
            <div class="editor-field">
                <asp:TextBox ID="Header" runat="server" Text='<%# BindItem.Title %>' MaxLength="255" />
                <asp:RequiredFieldValidator ID="HeaderRequiredFieldValidator" runat="server" ErrorMessage="Rubriken på bilden måste anges." ControlToValidate="Header" Display="None" ValidationGroup="EditValidation"></asp:RequiredFieldValidator>
            </div>

            <div>
                <asp:DropDownList ID="CategoryDropDownList" runat="server"
                    SelectMethod="CategoryDropDownList_GetData"
                    DataTextField="Kategori"
                    DataValueField="KategoriID"
                    ItemType="Share4UProjekt.Model.Category"
                    Enabled="true"
                    SelectedValue='<%# Item.KategoriID %>' />
            </div>

            <div id="button-div">
                <asp:LinkButton ID="LinkButton1" runat="server" Text="Spara" CommandName="Update" ValidationGroup="EditValidation" CssClass="Green" CausesValidation="false" />
                <asp:HyperLink ID="HyperLink1" runat="server" Text="Avbryt" NavigateUrl='<%# GetRouteUrl("upload", new { id = Item.ImgID }) %>' CssClass="Green" />
            </div>
        </EditItemTemplate>
    </asp:FormView>
</asp:Content>
