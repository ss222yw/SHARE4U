// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.SlideDescription
 *******************************************/
SlideShow.SlideDescription = function(control, parent, options)
{
	/// <summary>Displays the title and description for a slide.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideDescription" Visibility="Collapsed">' +
		'	<Canvas x:Name="VisibleCanvas">' +
		'		<Canvas.Resources>' +
		'			<Storyboard x:Name="SlideStoryboard" Storyboard.TargetName="SlideTransform" Storyboard.TargetProperty="Y">' +
		'				<DoubleAnimationUsingKeyFrames> ' +
		'					<SplineDoubleKeyFrame x:Name="SlideKeyFrame1" KeySpline="0,0 0,0" KeyTime="0:0:0" />' +
		'					<SplineDoubleKeyFrame x:Name="SlideKeyFrame2" KeySpline="0,0 0,1" />' +
		'				</DoubleAnimationUsingKeyFrames> ' +
		'			</Storyboard>' +
		'		</Canvas.Resources>' +
		'		<Canvas.RenderTransform>' +
		'			<TranslateTransform x:Name="SlideTransform" />' +
		'		</Canvas.RenderTransform>' +
		'		<Rectangle x:Name="Background" />' +
		'		<Rectangle x:Name="TitleRectangle" />' +
		'		<Rectangle x:Name="DescriptionRectangle" />' +
		'		<TextBlock x:Name="TitleTextBlock" TextWrapping="Wrap" />' +
		'		<TextBlock x:Name="DescriptionTextBlock" TextWrapping="Wrap" />' +
		'	</Canvas>' +
		'</Canvas>';
	
	SlideShow.SlideDescription.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundFill: "Black",
		backgroundOpacity: 0,
		backgroundRadius: 0,		
		titleHeight: 30,
		titlePaddingTop: 5,
		titlePaddingLeft: 8,		
		titleFontFamily: "Portable User Interface",
		titleFontSize: 13,
		titleFontStretch: "Normal",
		titleFontStyle: "Normal",
		titleFontWeight: "Bold",
		titleForeground: "White",
		titleBackground: "Black",
		titleOpacity: 0.5,
		descriptionHeight: 30,
		descriptionPaddingTop: 6.5,
		descriptionPaddingLeft: 8,
		descriptionFontFamily: "Portable User Interface",
		descriptionFontSize: 11,
		descriptionFontStretch: "Normal",
		descriptionFontStyle: "Normal",
		descriptionFontWeight: "Normal",
		descriptionForeground: "White",
		descriptionBackground: "Black",
		descriptionOpacity: 0.2,
		slideAnimationDuration: 0.6,
		hideIfEmpty: false
	});
	
	this.setOptions(options);
	
	this.visibleCanvas = this.root.findName("VisibleCanvas");
	this.slideTransform = this.root.findName("SlideTransform");
	this.slideStoryboard = this.root.findName("SlideStoryboard");
	this.slideKeyFrame1 = this.root.findName("SlideKeyFrame1");
	this.slideKeyFrame2 = this.root.findName("SlideKeyFrame2");
	this.background = this.root.findName("Background");
	this.titleRectangle = this.root.findName("TitleRectangle");
	this.titleTextBlock = this.root.findName("TitleTextBlock");
	this.descriptionRectangle = this.root.findName("DescriptionRectangle");		
	this.descriptionTextBlock = this.root.findName("DescriptionTextBlock");
	
	this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
	this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave));
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.SlideDescription,
{	
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.SlideDescription.base.render.call(this);
		
		var height = this.options.titleHeight + this.options.descriptionHeight;
		this.visibleCanvas["Canvas.Top"] = -height - this.options.top;
		this.visibleCanvas.height = height;
		
		this.background.height = this.options.titleHeight + this.options.descriptionHeight;
		this.background.fill = this.options.backgroundFill;
		this.background.opacity = this.options.backgroundOpacity;
		this.background.radiusX = this.options.backgroundRadius;
		this.background.radiusY = this.options.backgroundRadius;
		
		this.titleRectangle.height = this.options.titleHeight;
		this.titleRectangle.fill = this.options.titleBackground;
		this.titleRectangle.opacity = this.options.titleOpacity;
		
		this.titleTextBlock["Canvas.Top"] = this.options.titlePaddingTop;
		this.titleTextBlock["Canvas.Left"] = this.options.titlePaddingLeft;
		this.titleTextBlock.height = this.options.titleHeight - this.options.titlePaddingTop * 2;
		this.titleTextBlock.fontFamily = this.options.titleFontFamily;
		this.titleTextBlock.fontSize = this.options.titleFontSize;
		this.titleTextBlock.fontStretch = this.options.titleFontStretch;
		this.titleTextBlock.fontStyle = this.options.titleFontStyle;
		this.titleTextBlock.fontWeight = this.options.titleFontWeight;
		this.titleTextBlock.foreground = this.options.titleForeground;
		
		this.descriptionRectangle["Canvas.Top"] = this.options.titleHeight;
		this.descriptionRectangle.height = this.options.descriptionHeight;
		this.descriptionRectangle.fill = this.options.descriptionBackground;
		this.descriptionRectangle.opacity = this.options.descriptionOpacity;
		
		this.descriptionTextBlock["Canvas.Top"] = this.options.descriptionPaddingTop + this.options.titleHeight;
		this.descriptionTextBlock["Canvas.Left"] = this.options.descriptionPaddingLeft;
		this.descriptionTextBlock.height = this.options.descriptionHeight - this.options.descriptionPaddingTop * 2;
		this.descriptionTextBlock.fontFamily = this.options.descriptionFontFamily;
		this.descriptionTextBlock.fontSize = this.options.descriptionFontSize;
		this.descriptionTextBlock.fontStretch = this.options.descriptionFontStretch;
		this.descriptionTextBlock.fontStyle = this.options.descriptionFontStyle;
		this.descriptionTextBlock.fontWeight = this.options.descriptionFontWeight;
		this.descriptionTextBlock.foreground = this.options.descriptionForeground;
	},
	
	setTitle: function(text)
	{
		/// <summary>Sets the title.</summary>
		/// <param name="text">The title text.</param>
		
		SlideShow.addTextToBlock(this.titleTextBlock, text);
	},
	
	setDescription: function(text)
	{
		/// <summary>Sets the description.</summary>
		/// <param name="text">The description text.</param>
		
		SlideShow.addTextToBlock(this.descriptionTextBlock, text);
	},
	
	slideIn: function()
	{
		/// <summary>Slides the control into view.</summary>
		
		var start = this.slideTransform.y;
		var finish = this.visibleCanvas.height + this.options.top;
		var distance = this.visibleCanvas.height;
		var duration = (finish - start) / distance * this.options.slideAnimationDuration;
		
		if (duration > 0)
		{
			this.slideKeyFrame1.value = start;
			this.slideKeyFrame2.value = finish;
			this.slideKeyFrame2.keyTime = "0:0:" + duration.toFixed(8);
			this.slideStoryboard.begin();
		}
	},
	
	slideOut: function()
	{
		/// <summary>Slides the control out of view.</summary>
		
		var start = this.slideTransform.y;
		var finish = 0;
		var distance = this.visibleCanvas.height;
		var duration = (start - finish) / distance * this.options.slideAnimationDuration;
		
		if (duration > 0)
		{
			this.slideKeyFrame1.value = start;
			this.slideKeyFrame2.value = finish;
			this.slideKeyFrame2.keyTime = "0:0:" + duration.toFixed(8);
			this.slideStoryboard.begin();
		}
	},
	
	onControlModulesLoad: function(sender, e)
	{
		/// <summary>Wires up the necessary event handlers to the SlideViewer module.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		var slideViewer = this.control.modules["SlideViewer"];
		
		if (slideViewer)
			slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));
	},
	
	onSlideLoading: function(sender, e)
	{
		/// <summary>Updates the title and description when a new slide is loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.titleText = e ? e.title : "";
		this.descriptionText = e ? e.description : "";
		
		this.setTitle(this.titleText);
		this.setDescription(this.descriptionText);
		
		if (this.options.hideIfEmpty && !this.titleText && !this.descriptionText)
			this.slideOut();
	},
	
	onMouseEnter: function(sender, e)
	{
		/// <summary>Triggers the slide animation.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (!this.options.hideIfEmpty || this.titleText || this.descriptionText)
			this.slideIn();
	},
	
	onMouseLeave: function(sender, e)
	{
		/// <summary>Reverses the slide animation.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.slideOut();
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.SlideDescription.base.onSizeChanged.call(this);
		
		var width = this.root.width;
		this.visibleCanvas.width = width;
		this.background.width = width;
		this.titleRectangle.width = width;
		this.descriptionRectangle.width = width;
		this.titleTextBlock.width = width - this.options.titlePaddingLeft * 2;
		this.descriptionTextBlock.width = width - this.options.descriptionPaddingLeft * 2;
		
		SlideShow.addTextToBlock(this.titleTextBlock, this.titleText);
		SlideShow.addTextToBlock(this.descriptionTextBlock, this.descriptionText);
	}
});