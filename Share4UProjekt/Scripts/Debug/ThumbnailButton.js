// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ThumbnailButton
 *******************************************/
SlideShow.ThumbnailButton = function(control, parent, slide, options)
{
	/// <summary>A thumbnail button control.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="slide">The target slide.</param>
	/// <param name="options">The options for the button.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailButton" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="LoadAnimation" To="1" />' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Canvas.Clip>' +
		'		<RectangleGeometry x:Name="Clip" />' +
		'	</Canvas.Clip>' +
		'	<Rectangle x:Name="Background" />' +
		'	<Rectangle x:Name="Image" Opacity="0">' +
		'		<Rectangle.Fill>' +
		'			<ImageBrush x:Name="ImageBrush" />' +
		'		</Rectangle.Fill>' +
		'	</Rectangle>' +
		'</Canvas>';
	
	SlideShow.ThumbnailButton.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		radius: 0,
		stroke: "Black",
		selectedStroke: "White",
		strokeThickness: 1,
		imageStretch: "UniformToFill",
		imageBackground: "#333",
		loadAnimationDuration: 0.5
	});
	
	this.setOptions(options);
	
	this.slide = slide;
	this.isSelected = false;
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush");
};

SlideShow.extend(SlideShow.Button, SlideShow.ThumbnailButton,
{
	render: function()
	{
		/// <summary>Renders the button using the current options.</summary>
		
		SlideShow.ThumbnailButton.base.render.call(this);
		
		// clip
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		
		// background
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.imageBackground;
		this.background.stroke = this.isSelected ? this.options.selectedStroke : this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		
		// image
		this.image.width = this.options.width;
		this.image.height = this.options.height;
		this.image.radiusX = this.options.radius;
		this.image.radiusY = this.options.radius;
		this.image.stroke = this.isSelected ? this.options.selectedStroke : this.options.stroke;
		this.image.strokeThickness = this.options.strokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;
		this.imageBrush.imageSource = this.getThumbnailImageSource();
		
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
	},
	
	getThumbnailImageSource: function()
	{
		/// <summary>Retrieves the appropriate thumbnail image for the button.</summary>
		/// <returns>The thumbnail image source.</returns>
		
		return this.slide.thumbnail || this.slide.image || "";
	},

	onSlideLoading: function(sender, e)
	{
		/// <summary>Handles the event fired when a new slide begins downloading.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.isSelected = e == this.slide;
		this.background.stroke = this.isSelected ? this.options.selectedStroke : this.options.stroke;
		this.image.stroke = this.isSelected ? this.options.selectedStroke : this.options.stroke;
	},
	
	onMouseEnter: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse enters the button.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.ThumbnailButton.base.onMouseEnter.call(this, sender, e);
		this.fireEvent("mouseEnter", this.isSelected);
	},
	
	onMouseLeave: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse leaves the button.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.ThumbnailButton.base.onMouseLeave.call(this, sender, e);
		this.fireEvent("mouseLeave", this.isSelected);
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
		
		SlideShow.ThumbnailButton.base.onClick.call(this, this.slide);
	}
});