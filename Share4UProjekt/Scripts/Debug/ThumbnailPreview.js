// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ThumbnailPreview
 *******************************************/
SlideShow.ThumbnailPreview = function(control, parent, options)
{
	/// <summary>Provides a preview image for thumbnails.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailPreview" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="HoverStoryboard">' +
		'			<DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleX" To="1" />' +
		'			<DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleY" To="1" />' +
		'			<DoubleAnimation Storyboard.TargetName="TranslateTransform" Storyboard.TargetProperty="X" To="0" />' +
		'			<DoubleAnimation Storyboard.TargetName="TranslateTransform" Storyboard.TargetProperty="Y" To="0" />' +
		'		</Storyboard>' +
		'		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="LoadAnimation" To="1" />' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Canvas.RenderTransform>' +
		'		<TransformGroup>' +
		'			<ScaleTransform x:Name="ScaleTransform" />' +
		'			<TranslateTransform x:Name="TranslateTransform" />' +
		'		</TransformGroup>' +
		'	</Canvas.RenderTransform>' +	
		'	<Rectangle x:Name="Background" />' +
		'	<Rectangle x:Name="Image" Opacity="0">' +
		'		<Rectangle.Fill>' +
		'			<ImageBrush x:Name="ImageBrush" />' +
		'		</Rectangle.Fill>' +
		'	</Rectangle>' +
		'	<Path x:Name="Arrow" Stretch="Fill" Data="M257.90625,640.65625 L264.31275,640.65625 261.10987,643.87525Z" />' +
		'</Canvas>';
	
	SlideShow.ThumbnailPreview.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		width: 150,
		height: 120,
		radius: 4,
		stroke: "White",
		strokeThickness: 2,
		arrowWidth: 10,
		arrowHeight: 6,
		arrowFill: "White",
		imageStretch: "UniformToFill",
		imageBackground: "#333",
		hoverAnimationDuration: 0.1,
		loadAnimationDuration: 0.5,
		visibility: "Collapsed"
	});
	
	this.setOptions(options);
	
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");
	this.scaleTransform = this.root.findName("ScaleTransform");
	this.translateTransform = this.root.findName("TranslateTransform");
	this.background = this.root.findName("Background");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush");
	this.arrow = this.root.findName("Arrow");
};

SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailPreview,
{	 
	render: function()
	{
		/// <summary>Renders the preview using the current options.</summary>

		SlideShow.ThumbnailPreview.base.render.call(this);
		
		// arrow
		this.arrow.width = this.options.arrowWidth;
		this.arrow.height = this.options.arrowHeight;
		this.arrow.fill = this.options.arrowFill;
		this.arrow["Canvas.Top"] = this.root.height;
		this.arrow["Canvas.Left"] = this.root.width / 2 - this.arrow.width / 2;	
		
		// background
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.imageBackground;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		
		// image
		this.image.width = this.options.width;
		this.image.height = this.options.height;
		this.image.radiusX = this.options.radius;
		this.image.radiusY = this.options.radius;
		this.image.stroke = this.options.stroke;
		this.image.strokeThickness = this.options.strokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;	
		
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
		
		// hover animation
		for (var i = 0, j = this.hoverStoryboard.children.count; i < j; i++)
			this.hoverStoryboard.children.getItem(i).duration = "0:0:" + this.options.hoverAnimationDuration;
	},
	
	show: function(image)
	{
		/// <summary>Displays the control with the specified image.</summary>
		/// <param name="image">The image to preview.</param>
		
		this.scaleTransform.scaleX = 0;
		this.scaleTransform.scaleY = 0;
		this.translateTransform.x = this.root.width / 2;
		this.translateTransform.y = this.root.height;
		this.root.visibility = "Visible";
		this.imageBrush.imageSource = image;
		this.hoverStoryboard.begin();
	},
	
	hide: function()
	{
		/// <summary>Hides the control.</summary>
	
		this.root.visibility = "Collapsed";
		this.imageBrush.imageSource = "";
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
	}
});