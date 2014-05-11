<%@ Page Title="About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="Share4UProjekt.Pages.Share4UPages.About" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <div id="AboutUs">
    <hgroup class="title">
        <h1>Om oss</h1>
    </hgroup>

    <article>
        <h2>        
            Share4u är en sida för folk som har stort intresse om bilar.
        </h2>

        <h2>        
            Här kan du ladda upp bilder om bilar.
        </h2>

        <h2>        
            
        </h2>
    </article>

    <aside>
         <div id="share4u" class="vcard">
<span class="fn n">
<span class="given-name">Share4U</span>
<span class="additional-name">www.share4u.me</span>
<span class="family-name">AB</span>
</span>
<div class="org">Linneuniversitet</div>
<a class="email" href="mailto:post@tssfastigheter.se">sahib@hotmail.se</a>
<div class="adr">
<div class="street-address">Rimsmedsvägen 40C</div>
<span class="locality">KALMAR</span>
<span class="postal-code">39352</span>
<span class="country-name">Sweden</span>

</div>
<div class="tel">0480-428432</div>
</div>

    </aside>

  
    <section>
<h3> Sahib Sahib</h3>
<figure>
<img id="personalpic2" alt="" src="../../Images2/sahibsahib2.JPG">
<p>0700563927</p>
<p>sahib@hotmail.se</p>
</figure>
</section>

    <p>Här finner ni oss i Kalmar</p>              
<a  href="https://maps.google.se/maps?q=Rimsmedsv%C3%A4gen+40C,+393+52+Kalmar,+Sweden&amp;ie=UTF-8&amp;hq=&amp;hnear=0x4657d1bab325ea9d:0xfc5013a9ca91496a,Rimsmedsv%C3%A4gen+40C,+393+52+Kalmar&amp;gl=se&amp;ei=EzZpUsWIBcjQtAah0YDoBA&amp;sqi=2&amp;ved=0CDIQ8gEwAA"><img src ="../../Images2/karta.png" alt="Till oss" style="width:270px" >           </a>   
        <br />
<%--<form action="http://maps.google.com/maps" method="get" target="_blank">--%>

<label for="saddr">Skriv in din adress</label>
        <br />
<input type="text" name="saddr" id="saddr"/>
<input type="hidden" name="daddr" id="daddr" value="Rimsmedsvägen 40C, 393 52 Kalmar, Sweden" />
    <br />
<input type="submit" value="Få vägbeskrivning till oss" class="Green"/>
<%--</form>--%>
    </div>
</asp:Content>