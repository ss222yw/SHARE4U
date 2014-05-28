<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="MsgBoxForm.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.MsgBoxForm" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Meddlande</h2>
          <br />
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <table>
        <tr>
            <td>
            </td>
            <td>
                <asp:TextBox ID="txtTo" runat="server" Text="sahib@hotmail.se"  Visible="false"></asp:TextBox>

            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td>Titel:
            </td>
            <td>
                <asp:TextBox ID="txtSubject" runat="server" placeholder="Rubrik"></asp:TextBox>
                <asp:RequiredFieldValidator ID="HeaderRequiredFieldValidator" runat="server"
                    ErrorMessage="Rubrik måste anges." ControlToValidate="txtSubject"
                    Display="None">
                </asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td>Meddlande:
            </td>
            <td>
                <asp:TextBox ID="txtBody" runat="server" TextMode="MultiLine" Height="150" Width="200" placeholder="Skriv ditt meddlande här."></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server"
                    ErrorMessage="Beskriv ditt meddlande" ControlToValidate="txtBody"
                    Display="None">
                </asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td>Bifoga
            </td>
            <td>
                <asp:FileUpload ID="fuAttachment" runat="server" />
            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td>Gmail E-post:
            </td>
            <td>
                <asp:TextBox ID="txtEmail" runat="server" placeholder="exampel@gmail.com"></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server"
                    ErrorMessage="Skriv in din gmail epost" ControlToValidate="txtEmail"
                    Display="None">
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server"
                        ErrorMessage="E-posten måste vara av denna format exampel@gmail.com"
                        ValidationExpression="^([\w]*[\w\.]*(?!\.)@gmail.com)$"
                        ControlToValidate="txtEmail">
                    </asp:RegularExpressionValidator>
                </asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td>Gmail Lösenord:
            </td>
            <td>
                <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" placeholder="*****************"></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server"
                    ErrorMessage="matta in din gmail lösen ord" ControlToValidate="txtPassword"
                    Display="None">
                </asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <asp:Button ID="Button1" Text="Skicka" OnClick="SendEmail" runat="server" CssClass="savebuttons"  />
                <asp:HyperLink ID="HyperLink3" runat="server" NavigateUrl="<%$ RouteUrl:routename=Contact %>" CssClass="savebuttons">Tillbaka</asp:HyperLink>
            </td>
        </tr>
    </table>

</asp:Content>
