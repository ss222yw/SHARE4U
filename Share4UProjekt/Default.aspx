<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Share4UProjekt._Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

    <link href="css/styles.css" type="text/css" media="all" rel="stylesheet" />
    <link href="css/skitter.styles.css" type="text/css" media="all" rel="stylesheet" />
    <script type="text/javascript" src="js/jquery-1.6.3.min.js"></script>
    <script type="text/javascript" src="js/jquery.easing.1.3.js"></script>
    <%--    <script type="text/javascript" src="js/jquery.animate-colors-min.js"></script>--%>
    <script type="text/javascript" src="js/jquery.skitter.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">

    <h1>Välkommen tiill ShareCarsPics4U</h1>
    <br />
    <br />
    <div id="TEXTDEFAULT">
        <h2>Dela bilder som du tycker är Intressanta om bilar, få riktiga svar från människor över hela sverige  , och  
            upptäck vad som gör dig lycklig.</h2>
    </div>
    <br />
    <br />
    <%--    Tagit från http://www.serie3.info/s3slider/ och implemnterat den så den passar med min sida.--%>
    <div id="page">
        <div id="content">
            <div class="border_box">
                <div class="box_skitter box_skitter_large">
                    <ul>
                        <li>
                            <asp:HyperLink ID="HyperLink43" runat="server" NavigateUrl="<%$ RouteUrl:routename=VOLVO %>"><img src="Images2/example/001.jpg" class="cube" /></asp:HyperLink><div class="label_text">
                                <p>Volvo</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink10" runat="server" NavigateUrl="<%$ RouteUrl:routename=BMW %>"><img src="Images2/example/002.jpg" class="cubeRandom" /></asp:HyperLink><div class="label_text">
                                <p>Bmw</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink16" runat="server" NavigateUrl="<%$ RouteUrl:routename=Ferrari %>"><img src="Images2/example/FiIrak.jpg" class="block" /></asp:HyperLink><div class="label_text">
                                <p>Ferrari</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink39" runat="server" NavigateUrl="<%$ RouteUrl:routename=Mitsubishi %>"><img src="Images2/example/004.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Mitsubishi</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink41" runat="server" NavigateUrl="<%$ RouteUrl:routename=Toyota %>"><img src="Images2/example/006.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Toyota</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink42" runat="server" NavigateUrl="<%$ RouteUrl:routename=Volkswagen %>"><img src="Images2/example/14.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>volkswagen</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink5" runat="server" NavigateUrl="<%$ RouteUrl:routename=Klassika %>"><img src="Images2/example/16.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Classic</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink32" runat="server" NavigateUrl="<%$ RouteUrl:routename=SAAB %>"><img src="Images2/example/010.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Saab</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="<%$ RouteUrl:routename=Alfa Romeo %>"><img src="Images2/example/Alfa.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Alfa Romeo</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink2" runat="server" NavigateUrl="<%$ RouteUrl:routename=Audi %>"><img src="Images2/example/Audi.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Audi</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink3" runat="server" NavigateUrl="<%$ RouteUrl:routename=Cadillac %>"><img src="Images2/example/Cad.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Cadillac</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink4" runat="server" NavigateUrl="<%$ RouteUrl:routename=Chevrolet %>"><img src="Images2/example/Cho.jpeg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Chevrolet</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink6" runat="server" NavigateUrl="<%$ RouteUrl:routename=Dodge %>"><img src="Images2/example/Dodge.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Dodge</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink7" runat="server" NavigateUrl="<%$ RouteUrl:routename=Ford %>"><img src="Images2/example/Ford.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Ford</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink8" runat="server" NavigateUrl="<%$ RouteUrl:routename=Honda %>"><img src="Images2/example/Honda.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Honda</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink9" runat="server" NavigateUrl="<%$ RouteUrl:routename=Hyundai %>"><img src="Images2/example/Hundayi.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Hyundai</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink11" runat="server" NavigateUrl="<%$ RouteUrl:routename=Jaguar %>"><img src="Images2/example/Jaguar.jpeg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Jaguar</p>
                            </div>
                        </li>
                        <li>
                            <asp:HyperLink ID="HyperLink12" runat="server" NavigateUrl="<%$ RouteUrl:routename=Jeep %>"><img src="Images2/example/Jeep.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text">
                                <p>Jeep</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <br />
    <br />
    <br />
    <script type="text/javascript">
        $(document).ready(function () {
            $('.box_skitter_large').skitter({
                theme: 'round',
                dots: true,
                preview: true,
                numbers_align: 'center'
            });
        });
    </script>
</asp:Content>
