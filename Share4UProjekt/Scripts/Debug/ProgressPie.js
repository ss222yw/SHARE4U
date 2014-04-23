// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ProgressPie
 *******************************************/
SlideShow.ProgressPie = function(control, parent, options)
{
	/// <summary>Displays a progress pie while images are downloading.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ProgressPie" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="ProgressPie" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="FadeAnimation" />' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Ellipse x:Name="ProgressBackground" />' +
		'	<Path x:Name="ProgressForeground" />' +
		'	<Ellipse x:Name="ProgressBorder" />' +
		'</Canvas>';
	
	SlideShow.ProgressPie.base.constructor.call(this, control, parent, xaml);
	
	this.setOptions(options);
	
	this.progressBackground = this.root.findName("ProgressBackground");
	this.progressForeground = this.root.findName("ProgressForeground");
	this.progressBorder = this.root.findName("ProgressBorder");
};

SlideShow.extend(SlideShow.ProgressIndicator, SlideShow.ProgressPie,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.ProgressPie.base.render.call(this);
		
		this.progressBackground.fill = this.options.progressBackground;
		this.progressForeground.fill = this.options.progressForeground;
		this.progressBorder.stroke = this.options.progressBorderColor;
		this.progressBorder.strokeThickness = this.options.progressBorderThickness;		
	},
	
	updateProgress: function(progress)
	{
		/// <summary>Updates the progress displayed by the control.</summary>
		/// <param name="progress">A value between 0 and 1 that specifies the current progress.</param>
		
		SlideShow.ProgressPie.base.updateProgress.call(this, progress);

		var radius = this.progressBackground.width / 2;
		var size = SlideShow.formatString("{0},{1}", radius, radius);
		var angle = 2 * Math.PI * progress;
		var direction = (progress > 0.5) ? 1 : 0;
		var startPoint = SlideShow.formatString("0,{0}", -radius);
		var endPoint = (progress < 1) ? SlideShow.formatString("{0},{1}", Math.sin(angle) * radius, Math.cos(angle) * -radius) : SlideShow.formatString("-0.05,{0}", -radius);
		
		this.progressForeground.data = SlideShow.formatString("M {0} A {1} {2} {3} 1 {4} L 0,0", startPoint, size, angle, direction, endPoint);
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.ProgressPie.base.onSizeChanged.call(this);
		
		var diameter = Math.min(this.root.width, this.root.height);
		var radius = diameter / 2;
		var top = this.root.height / 2 - radius;
		var left = this.root.width / 2 - radius;
		
		// background
		this.progressBackground.width = diameter;
		this.progressBackground.height = diameter;
		this.progressBackground["Canvas.Top"] = top;
		this.progressBackground["Canvas.Left"] = left;
		
		// foreground
		this.progressForeground["Canvas.Top"] = top + radius;
		this.progressForeground["Canvas.Left"] = left + radius;
		
		// border
		this.progressBorder.width = diameter;
		this.progressBorder.height = diameter;
		this.progressBorder["Canvas.Top"] = top;
		this.progressBorder["Canvas.Left"] = left;
	}	
});