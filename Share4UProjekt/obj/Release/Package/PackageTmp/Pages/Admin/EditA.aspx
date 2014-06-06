<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EditA.aspx.cs" Inherits="Share4UProjekt.Pages.Admin.EditA" %>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
     <div id="editLayout">
    <asp:ValidationSummary ID="ValidationSummary2" runat="server" CssClass="validation-summary-errors" />
    <asp:ValidationSummary ID="ValidationSummary3" runat="server" CssClass="validation-summary-errors" ValidationGroup="EditValidation" ShowModelStateErrors="false" />
         <br />
         <br />
           <%--Label för rätt meddalnde--%>
    <asp:Panel ID="ResponsePanel" runat="server" Visible="false">
    <asp:Label ID="SuccessTest" Text="" runat="server"  CssClass="success" />
         <asp:ImageButton ID="closeImg" runat="server" ImageUrl="~/Images2/delete.gif" CausesValidation="false" OnClick="closeImg_Click" />
        </asp:Panel>
   <br />
    <br />
    <br />
    <br />   <asp:FormView ID="EditFormView" runat="server"
        ItemType="Share4UProjekt.Model.Images"
        DataKeyNames="ImgID"
        DefaultMode="Edit"
        RenderOuterTable="false"
        SelectMethod="EditAFormView_GetItem"
        UpdateMethod="EditAFormView_UpdateItem">
        <EditItemTemplate>
                <asp:Image CssClass="imgUserPhoto"  ImageUrl='<%# "../../Images/" + Item.ImgName %>' ID="imgUserPhoto2" runat="server" alt="bilder." /><br /><br />
                    Modell :   <%#: Item.Title %>
            <br />
                    Inlagd :  <%#: Item.dateOfTheDay.ToString("yyyy/MM/dd") %>
            <br />
            <br />
              <div class="editor-field">
                <asp:TextBox ID="Header" runat="server" Text='<%# BindItem.Title %>' MaxLength="25" />
                <asp:RequiredFieldValidator ID="HeaderRequiredFieldValidator" runat="server" ErrorMessage="Modellen på bilden måste anges." ControlToValidate="Header" Display="None" ValidationGroup="EditValidation"></asp:RequiredFieldValidator>
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
            <br />
            <div id="button-div">
                <asp:LinkButton ID="LinkButton1" runat="server" Text="Spara" CommandName="Update" ValidationGroup="EditValidation"  CausesValidation="false"  CssClass="savebuttons"/>
                <asp:HyperLink ID="HyperLink1" runat="server" Text="Avbryt" NavigateUrl='<%# GetRouteUrl("upload", new { id = Item.ImgID }) %>'   CssClass="savebuttons"/>
            </div>
        </EditItemTemplate>
    </asp:FormView>
        </div>
</asp:Content>
