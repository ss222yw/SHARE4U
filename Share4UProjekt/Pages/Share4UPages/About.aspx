<%@ Page Title="About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.About" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
            <h1>Om oss</h1>
    <div class="Contact">
        <article>
            <h2>ShareCarPics4u är en sida för er som har stort intresse om bilar.
            </h2>

            <h2><asp:HyperLink ID="HyperLink6" runat="server" NavigateUrl="<%$ RouteUrl:routename=upload %>">Här</asp:HyperLink> kan du ladda upp bilder om bilar.
            </h2>

        </article>
        </div>
    <div class="Contact1">
        <aside>
            <div class="vcard">
                <span class="fn n">
                    <span class="given-name">ShareCarPics4U</span>
                    <span class="additional-name">www.sharecarpicsforyou.net</span>
                </span>
                <div class="org">Linneuniversitet</div>
                <a class="email" href="mailto:post@sahib.se">sahib@hotmail.se</a>
                <div class="adr">
                    <div class="street-address">Rimsmedsvägen</div>
                    <span class="locality">KALMAR</span>
                    <span class="postal-code">39352</span>
                    <span class="country-name">Sverige</span>

                </div>
                <div class="tel">Tel : 0480-428432</div>
            </div>

        </aside>
        </div>

    <div class="Contact2">
        <section>
            <h3>Sahib Sahib</h3>
            <figure>
                <img id="personalpic2" alt="" src="../../Images2/sahibsahib2.JPG">
                <p>0700563927</p>
                <p>sahib@hotmail.se</p>
            </figure>
        </section>
        </div>

    <div class="Contact2">
        <p>Här finner ni oss i Kalmar</p>
        <%--Tagit från google--%>
        <a href="https://maps.google.se/maps?q=Rimsmedsv%C3%A4gen+40C,+393+52+Kalmar,+Sweden&amp;ie=UTF-8&amp;hq=&amp;hnear=0x4657d1bab325ea9d:0xfc5013a9ca91496a,Rimsmedsv%C3%A4gen+40C,+393+52+Kalmar&amp;gl=se&amp;ei=EzZpUsWIBcjQtAah0YDoBA&amp;sqi=2&amp;ved=0CDIQ8gEwAA" target="_blank">
            <img src="../../Images2/karta.png" alt="Till oss">
        </a>
        </div>
</asp:Content>
