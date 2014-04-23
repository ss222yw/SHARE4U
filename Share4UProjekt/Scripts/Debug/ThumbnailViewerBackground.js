// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ThumbnailViewerBackground
 *******************************************/
SlideShow.ThumbnailViewerBackground = function(control, parent, options)
{
	/// <summary>Displays a background for the thumbnail viewer control.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailViewerBackground" Visibility="Collapsed">' +
		'	<Rectangle x:Name="Background" />' +
		'</Canvas>';
	
	SlideShow.ThumbnailViewerBackground.base.constructor.call(this, control, parent, xaml);

	SlideShow.merge(this.options,
	{
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		radius: 4,
		fill: "Black",
		stroke: "Black",
		strokeThickness: 0	
	});
	
	this.setOptions(options);
	
	this.background = this.root.findName("Background");
};

SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailViewerBackground,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.ThumbnailViewerBackground.base.render.call(this);
		
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.fill;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.ThumbnailViewerBackground.base.onSizeChanged.call(this);
		
		this.background.width = this.root.width;
		this.background.height = this.root.height;
	}
});