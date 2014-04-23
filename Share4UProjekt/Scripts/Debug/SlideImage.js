// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.SlideImage
 *******************************************/
SlideShow.SlideImage = function(control, parent, options)
{
	/// <summary>Displays slide images within the SlideViewer module.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideImage" Visibility="Collapsed"><Image x:Name="Image" /></Canvas>';
	
	SlideShow.SlideImage.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		stretch: "Uniform"
	});
	
	this.setOptions(options);
	
	this.image = this.root.findName("Image");
};

SlideShow.extend(SlideShow.UserControl, SlideShow.SlideImage,
{
	render: function()
	{
		/// <summary>Renders the image using the current options.</summary>
		
		SlideShow.SlideImage.base.render.call(this);
		
		this.image.stretch = this.options.stretch;
	},
	
	setSource: function(source)
	{
		/// <summary>Sets the image source.</summary>
		/// <param name="source">The image source.</param>
		
		this.image.source = source;
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.SlideImage.base.onSizeChanged.call(this);
		
		this.image.width = this.root.width;
		this.image.height = this.root.height;
		
		this.fireEvent("sizeChange");
	}
});