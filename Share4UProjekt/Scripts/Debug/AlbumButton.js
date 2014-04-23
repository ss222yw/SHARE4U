// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.AlbumButton
 *******************************************/
SlideShow.AlbumButton = function(control, parent, album, options)
{
	/// <summary>An album button control.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the button.</param>
	/// <param name="album">The target album.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumButton" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="HoverStoryboard">' +
		'			<ColorAnimationUsingKeyFrames Storyboard.TargetName="Background" Storyboard.TargetProperty="(Fill).(Color)">' +
		'				<LinearColorKeyFrame x:Name="HoverKeyFrame" />' +	
		'			</ColorAnimationUsingKeyFrames>' +
		'		</Storyboard>' +
		'		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="LoadAnimation" To="1" />' +
		'		</Storyboard>' +		
		'	</Canvas.Resources>' +
		'	<Canvas.Clip>' +
		'		<RectangleGeometry x:Name="Clip" />' +
		'	</Canvas.Clip>' +
		'	<Rectangle x:Name="Background" />' +
		'	<Rectangle x:Name="ImageBackground" />' +
		'	<Rectangle x:Name="Image" Opacity="0">' +
		'		<Rectangle.Fill>' +
		'			<ImageBrush x:Name="ImageBrush" />' +
		'		</Rectangle.Fill>' +
		'	</Rectangle>' +
		'	<TextBlock x:Name="TitleTextBlock" TextWrapping="Wrap" />' +
		'	<TextBlock x:Name="DescriptionTextBlock" TextWrapping="Wrap" />' +
		'</Canvas>';
	
	SlideShow.AlbumButton.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		background: "#222",
		backgroundHover: "#333",
		hoverAnimationDuration: 0.2,
		loadAnimationDuration: 0.5,
		radius: 4,
		stroke: "#333",
		strokeThickness: 1,
		imageWidth: 75,
		imageHeight: 60,
		imagePaddingTop: 6,
		imagePaddingLeft: 6,
		imageBackground: "#777",
		imageSource: null,
		imageStretch: "UniformToFill",
		imageRadius: 0,
		imageStroke: "#333",
		imageStrokeThickness: 1,
		titleWidth: 126,
		titleHeight: 20,
		titlePaddingTop: 4,
		titlePaddingLeft: 6,
		titleFontFamily: "Portable User Interface",
		titleFontSize: 12,
		titleFontStretch: "Normal",
		titleFontStyle: "Normal",
		titleFontWeight: "Bold",
		titleForeground: "White",
		descriptionWidth: 126,
		descriptionHeight: 52,
		descriptionPaddingTop: 0,
		descriptionPaddingLeft: 6,
		descriptionFontFamily: "Portable User Interface",
		descriptionFontSize: 10,
		descriptionFontStretch: "Normal",
		descriptionFontStyle: "Normal",
		descriptionFontWeight: "Normal",
		descriptionForeground: "#777"
	});
	
	this.setOptions(options);
	
	this.album = album;
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.hoverKeyFrame = this.root.findName("HoverKeyFrame");
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");		
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.imageBackground = this.root.findName("ImageBackground");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush");
	this.titleTextBlock = this.root.findName("TitleTextBlock");
	this.descriptionTextBlock = this.root.findName("DescriptionTextBlock");
};

SlideShow.extend(SlideShow.Button, SlideShow.AlbumButton,
{
	render: function()
	{
		/// <summary>Renders the button using the current options.</summary>
				
		SlideShow.AlbumButton.base.render.call(this);
		
		// image source
		if (!this.album)
			throw new Error("Album missing");
		else if (this.album.image)
			this.options.imageSource = this.album.image;
		else if (this.album.slide && this.album.slide.length)
			this.options.imageSource = this.album.slide[0].image;
		
		// clip
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		
		// background
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.background;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		
		// image background
		this.imageBackground.width = this.options.imageWidth;
		this.imageBackground.height = this.options.imageHeight;
		this.imageBackground["Canvas.Top"] = this.options.imagePaddingTop;
		this.imageBackground["Canvas.Left"] = this.options.imagePaddingLeft;
		this.imageBackground.radiusX = this.options.imageRadius;
		this.imageBackground.radiusY = this.options.imageRadius;
		this.imageBackground.fill = this.options.imageBackground;
		this.imageBackground.stroke = this.options.imageStroke;
		this.imageBackground.strokeThickness = this.options.imageStrokeThickness;
		
		// image
		this.image.width = this.options.imageWidth;
		this.image.height = this.options.imageHeight;
		this.image["Canvas.Top"] = this.options.imagePaddingTop;
		this.image["Canvas.Left"] = this.options.imagePaddingLeft;
		this.image.radiusX = this.options.imageRadius;
		this.image.radiusY = this.options.imageRadius;
		this.image.stroke = this.options.imageStroke;
		this.image.strokeThickness = this.options.imageStrokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;
		this.imageBrush.imageSource = this.options.imageSource;
		
		// load animation
		if (this.imageBrush.downloadProgress == 1)
		{
			this.image.opacity = 1;
		}
		else
		{
			this.loadAnimation.duration = "0:0:" + this.options.loadAnimationDuration;
			this.imageBrush.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onImageDownloadProgressChanged));
			this.imageBrush.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onImageDownloadFailed));
		}
		
		// title
		this.titleTextBlock.width = this.options.titleWidth;
		this.titleTextBlock.height = this.options.titleHeight;
		this.titleTextBlock["Canvas.Top"] = this.options.titlePaddingTop;
		this.titleTextBlock["Canvas.Left"] = (this.options.imageWidth > 0) ? this.options.imagePaddingLeft + this.options.imageWidth + this.options.titlePaddingLeft : this.options.titlePaddingLeft;
		this.titleTextBlock.fontFamily = this.options.titleFontFamily;
		this.titleTextBlock.fontSize = this.options.titleFontSize;
		this.titleTextBlock.fontStretch = this.options.titleFontStretch;
		this.titleTextBlock.fontStyle = this.options.titleFontStyle;
		this.titleTextBlock.fontWeight = this.options.titleFontWeight;
		this.titleTextBlock.foreground = this.options.titleForeground;
		SlideShow.addTextToBlock(this.titleTextBlock, this.album.title);
		
		// description
		this.descriptionTextBlock.width = this.options.descriptionWidth;
		this.descriptionTextBlock.height = this.options.descriptionHeight;
		this.descriptionTextBlock["Canvas.Top"] = (this.options.titleHeight > 0) ? this.options.titlePaddingTop + this.options.titleHeight + this.options.descriptionPaddingTop : this.options.descriptionPaddingTop;
		this.descriptionTextBlock["Canvas.Left"] = (this.options.imageWidth > 0) ? this.options.imagePaddingLeft + this.options.imageWidth + this.options.descriptionPaddingLeft : this.options.descriptionPaddingLeft;
		this.descriptionTextBlock.fontFamily = this.options.descriptionFontFamily;
		this.descriptionTextBlock.fontSize = this.options.descriptionFontSize;
		this.descriptionTextBlock.fontStretch = this.options.descriptionFontStretch;
		this.descriptionTextBlock.fontStyle = this.options.descriptionFontStyle;
		this.descriptionTextBlock.fontWeight = this.options.descriptionFontWeight;
		this.descriptionTextBlock.foreground = this.options.descriptionForeground;
		SlideShow.addTextToBlock(this.descriptionTextBlock, this.album.description);
		
		// hover animation
		this.hoverKeyFrame.keyTime = SlideShow.formatString("0:0:{0}", this.options.hoverAnimationDuration);
	},
	
	setState: function(state)
	{
		/// <summary>Sets the button state.</summary>
		/// <param name="state">The new state.</param>
		
		SlideShow.AlbumButton.base.setState.call(this, state);
		
		switch (state)
		{
			case "Hover":
			case "ActiveHover":
			case "InactiveHover":
				this.hoverKeyFrame.value = this.options.backgroundHover;
				this.hoverStoryboard.begin();
				break;
			
			default:
				this.hoverKeyFrame.value = this.options.background;
				this.hoverStoryboard.begin();
				break;
		}
	},
	
	onImageDownloadProgressChanged: function(sender, e)
	{
		/// <summary>Handles the event fired while the image is downloading.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (sender.downloadProgress == 1)
			this.loadStoryboard.begin();
	},
	
	onImageDownloadFailed: function(sender, e)
	{
		/// <summary>Handles the event fired when the image failed to download.</summary>
		/// <param name="sender">The event soure.</param>
		/// <param name="e">The event arguments.</param>
		
		throw new Error("Image download failed: " + this.imageBrush.imageSource);
	},
	
	onClick: function(e)
	{
		/// <summary>Handles the event fired when the button is clicked.</summary>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.AlbumButton.base.onClick.call(this, this.album);
	}
});