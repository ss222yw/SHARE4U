// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ProgressBar
 *******************************************/
SlideShow.ProgressBar = function(control, parent, options)
{
	/// <summary>Displays a progress bar while images are downloading.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>

	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ProgressBar" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="ProgressBar" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="FadeAnimation" />' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Rectangle x:Name="ProgressBackground" />' +
		'	<Rectangle x:Name="ProgressForeground" />' +
		'</Canvas>';
	
	SlideShow.ProgressBar.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		width: 180,
		height: 4,
		progressForeground: "#CCFFFFFF",
		progressBorderThickness: 0	
	});
	
	this.setOptions(options);
	
	this.maxProgressForegroundWidth = 0;
	this.progressBackground = this.root.findName("ProgressBackground");
	this.progressForeground = this.root.findName("ProgressForeground");
};

SlideShow.extend(SlideShow.ProgressIndicator, SlideShow.ProgressBar,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.ProgressBar.base.render.call(this);
		
		// background
		this.progressBackground.fill = this.options.progressBackground;
		this.progressBackground.stroke = this.options.progressBorderColor;
		this.progressBackground.strokeThickness = this.options.progressBorderThickness;
		
		// foreground
		this.progressForeground.fill = this.options.progressForeground;
		this.progressForeground["Canvas.Top"] = this.options.progressBorderThickness;
		this.progressForeground["Canvas.Left"] = this.options.progressBorderThickness;
	},
	
	updateProgress: function(progress)
	{
		/// <summary>Updates the progress displayed by the control.</summary>
		/// <param name="progress">A value between 0 and 1 that specifies the current progress.</param>
		
		SlideShow.ProgressBar.base.updateProgress.call(this, progress);
		this.progressForeground.width = progress * this.maxProgressForegroundWidth;
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.ProgressBar.base.onSizeChanged.call(this);
		
		// background
		this.progressBackground.width = this.root.width;
		this.progressBackground.height = this.root.height;
		
		// foreground
		this.progressForeground.width = 0;
		this.progressForeground.height = this.root.height - this.options.progressBorderThickness * 2;
		this.maxProgressForegroundWidth = this.root.width - this.options.progressBorderThickness * 2;
	}	
});