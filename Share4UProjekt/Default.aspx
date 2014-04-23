<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Share4UProjekt._Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    	   <script src="Scripts/jquery.fancybox-1.3.4/jquery-1.4.3.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.pack.js" type="text/javascript"></script>
    <script src="http://slideshow.triptracker.net/slide.js" type="text/javascript">

    </script>    <script type="text/javascript">
                     // For more options, go to http://fancybox.net/api

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


    <link href="Scripts/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.css" rel="stylesheet" type="text/css" />
    
    <style type="text/css">
       
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
            <h2>Upload Photos</h2><br />
    <asp:Label ID="lblStatus" style="color: Red;" text="&nbsp;" runat="server" />

    <br /><br />
    <asp:Repeater ID="rptrUservids" runat="server">
        <ItemTemplate>
            <span class="saucer" style="float: left; padding: 15px; ">
            <asp:ImageButton OnCommand="imgUser_Command" CommandArgument="<%# Container.DataItem %>" ImageUrl="<%# Container.DataItem %>" ID="imgUserPhoto" style="width: 180px; height: 180px;" runat="server" alt="bilder." /><br />
            </span>
        </ItemTemplate>
    </asp:Repeater>

    <div style="clear: both;" />
</asp:Content>