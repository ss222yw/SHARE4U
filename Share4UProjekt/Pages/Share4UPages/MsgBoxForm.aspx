<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="MsgBoxForm.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.MsgBoxForm" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
              <h2>Meddelande</h2>
          <br />
           <%--Label för rätt meddalnde--%>
    <asp:Panel ID="ResponsePanel" runat="server" Visible="false">
    <asp:Label ID="SuccessTest" Text="" runat="server"  CssClass="success" />
         <asp:ImageButton ID="closeImg" runat="server" ImageUrl="~/Images2/delete.gif" CausesValidation="false" OnClick="closeImg_Click" />
        </asp:Panel>
    <asp:Label ID="Label1" Text="" runat="server"  CssClass="errors"  Visible="false"/>
    <br />
       <br />
       <br />
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="validation-summary-errors" />
    <asp:RegularExpressionValidator ID="fuUploadRegularExpressionValidator" runat="server" ErrorMessage="Filen måste vara av formaten jpg, jpeg, gif, png." ControlToValidate="fuAttachment" Display="None" ValidationExpression=".*.(gif|jpg|jpeg|png|jpeg|GIF|JPG|PNG|JPEG)"></asp:RegularExpressionValidator>
    <div id="showImgLayout2">
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
                <asp:TextBox ID="txtSubject" runat="server" placeholder="Rubrik" onkeydown = "return (event.keyCode!=13);"></asp:TextBox><span>*</span>
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
            <td>Meddelande:
            </td>
            <td>
                <asp:TextBox ID="txtBody" runat="server" TextMode="MultiLine"  placeholder="Skriv ditt meddlande här." CssClass="message"></asp:TextBox><span>*</span>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server"
                    ErrorMessage="Beskriv ditt meddlande" ControlToValidate="txtBody"
                    Display="None" >
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
            <td>LNU student/Gmail E-post:
            </td>
            <td>
                <asp:TextBox ID="txtEmail" runat="server" placeholder="ex@student.lnu.se/gmail.com" onkeydown = "return (event.keyCode!=13);"></asp:TextBox><span>*</span>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server"
                    ErrorMessage="Skriv in din epost" ControlToValidate="txtEmail"
                    Display="None">
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server"
                        ErrorMessage="E-posten måste vara av denna format exampel@student.lnu.se eller exampel@gmail.com"
                        ValidationExpression="^\w+([-+.]\w+)*@(student.lnu.se|gmail.com)$"
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
            <td>Lösenord:
            </td>
            <td>
                <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" placeholder="*****************" onkeydown = "return (event.keyCode!=13);"></asp:TextBox><span>*</span>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server"
                    ErrorMessage="Ange lösenord" ControlToValidate="txtPassword"
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

                <asp:Button ID="BSend" Text="Skicka" OnClick="SendEmail" runat="server" CssClass="savebuttons"  onkeydown = "return (event.keyCode!=13);"/>
                <asp:HyperLink ID="HyperLink3" runat="server" NavigateUrl="<%$ RouteUrl:routename=Contact %>" CssClass="savebuttonsBack">Tillbaka</asp:HyperLink>
            </td>
        </tr>
    </table>
    </div>
</asp:Content>
