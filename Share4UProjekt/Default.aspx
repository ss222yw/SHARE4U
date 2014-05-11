<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Share4UProjekt._Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
   	<link href="css/styles.css" type="text/css" media="all" rel="stylesheet" />
	<link href="css/skitter.styles.css" type="text/css" media="all" rel="stylesheet" />
	<script type="text/javascript" src="js/jquery-1.6.3.min.js"></script>
	<script type="text/javascript"  src="js/jquery.easing.1.3.js"></script>
	<script type="text/javascript"  src="js/jquery.animate-colors-min.js"></script>
	<script type="text/javascript"  src="js/jquery.skitter.min.js"></script>
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
<asp:Content ID="Content2" ContentPlaceHolderID="FeaturedContent" runat="server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
       <div id="page">
		<div id="content">
			<div class="border_box">
				<div class="box_skitter box_skitter_large">
					<ul>
						<li><asp:HyperLink ID="HyperLink43" runat="server" NavigateUrl="<%$ RouteUrl:routename=VOLVO %>"><img src="Images2/example/001.jpg" class="cube" /></asp:HyperLink><div class="label_text"><p>Volvo</p></div></li>
						<li><asp:HyperLink ID="HyperLink10" runat="server" NavigateUrl="<%$ RouteUrl:routename=BMW %>"><img src="Images2/example/002.jpg" class="cubeRandom" /></asp:HyperLink><div class="label_text"><p>Bmw</p></div></li>
						<li><asp:HyperLink ID="HyperLink16" runat="server" NavigateUrl="<%$ RouteUrl:routename=Ferrari %>"><img src="Images2/example/11.jpg" class="block" /></asp:HyperLink><div class="label_text"><p>Ferrari</p></div></li>
						<li><asp:HyperLink ID="HyperLink39" runat="server" NavigateUrl="<%$ RouteUrl:routename=Mitsubishi %>"><img src="Images2/example/004.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text"><p>Mitsubishi</p></div></li>
                        <li><asp:HyperLink ID="HyperLink41" runat="server" NavigateUrl="<%$ RouteUrl:routename=Toyota %>"><img src="Images2/example/006.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text"><p>Toyota</p></div></li>
                        <li><asp:HyperLink ID="HyperLink42" runat="server" NavigateUrl="<%$ RouteUrl:routename=Volkswagen %>"><img src="Images2/example/14.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text"><p>volkswagen</p></div></li>
                        <li><asp:HyperLink ID="HyperLink5" runat="server" NavigateUrl="<%$ RouteUrl:routename=Klassika %>"><img src="Images2/example/16.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text"><p>Classic</p></div></li>
                        <li><asp:HyperLink ID="HyperLink32" runat="server" NavigateUrl="<%$ RouteUrl:routename=SAAB %>"><img src="Images2/example/010.jpg" class="cubeStop" /></asp:HyperLink><div class="label_text"><p>Saab</p></div></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</asp:Content>