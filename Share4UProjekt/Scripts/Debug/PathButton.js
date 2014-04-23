// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.PathButton
 *******************************************/
SlideShow.PathButton = function(control, parent, options)
{
	/// <summary>A path button control.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the button.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="PathButton" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="HoverStoryboard">' +
		'			<ColorAnimationUsingKeyFrames Storyboard.TargetName="Path" Storyboard.TargetProperty="(Fill).(Color)">' +
		'				<LinearColorKeyFrame x:Name="HoverKeyFrame" />' +	
		'			</ColorAnimationUsingKeyFrames>' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Canvas.Clip>' +
		'		<RectangleGeometry x:Name="Clip" />' +
		'	</Canvas.Clip>' +
		'	<Rectangle x:Name="Background">' +
		'		<Rectangle.Fill>' +
		'			<LinearGradientBrush StartPoint="0.477254,1.16548" EndPoint="0.477254,0.0426189">' +
		'				<LinearGradientBrush.GradientStops>' +
		'					<GradientStop x:Name="BackgroundColor1" Offset="0.232877" />' +
		'					<GradientStop x:Name="BackgroundColor2" Offset="0.987288" />' +
		'				</LinearGradientBrush.GradientStops>' +
		'			</LinearGradientBrush>' +
		'		</Rectangle.Fill>' +
		'	</Rectangle>' +
		'	<Path x:Name="Path" />' +
		'</Canvas>';
	
	SlideShow.PathButton.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		radius: 2,
		stroke: "#7F808BBC",
		strokeThickness: 1,
		backgroundColor1: "#273B5B",
		backgroundColor2: "#6A75A2",
		pathData: null,
		pathWidth: 10,
		pathHeight: 10,
		pathStretch: "Uniform",
		pathFill: "#BDC3DF",
		pathFillHover: "White",
		pathFillDisabled: "#6A75A2",
		hoverAnimationDuration: 0.2
	});
	
	this.setOptions(options);
	
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.hoverKeyFrame = this.root.findName("HoverKeyFrame");
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.backgroundColor1 = this.root.findName("BackgroundColor1");
	this.backgroundColor2 = this.root.findName("BackgroundColor2");
	this.path = this.root.findName("Path");	
};

SlideShow.extend(SlideShow.Button, SlideShow.PathButton,
{
	render: function()
	{
		/// <summary>Renders the button using the current options.</summary>
		
		SlideShow.PathButton.base.render.call(this);
		
		// hover
		this.hoverKeyFrame.keyTime = SlideShow.formatString("0:0:{0}", this.options.hoverAnimationDuration);
		
		// clip
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		
		// background
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.backgroundColor1.color = this.options.backgroundColor1;
		this.backgroundColor2.color = this.options.backgroundColor2;
		
		// path
		this.path.data = this.options.pathData;
		this.path.width = this.options.pathWidth;
		this.path.height = this.options.pathHeight;
		this.path.stretch = this.options.pathStretch;
		this.path.fill = this.options.pathFillDisabled;
		this.path["Canvas.Top"] = this.options.height / 2 - this.options.pathHeight / 2;
		this.path["Canvas.Left"] = this.options.width / 2 - this.options.pathWidth / 2;
		
		// disable by default
		this.disable();
	},
	
	setState: function(state)
	{
		/// <summary>Sets the button state.</summary>
		/// <param name="state">The new state.</param>
		
		SlideShow.PathButton.base.setState.call(this, state);
		
		switch (state)
		{
			case "Hover":
			case "ActiveHover":
			case "InactiveHover":
				this.hoverKeyFrame.value = this.options.pathFillHover;
				this.hoverStoryboard.begin();
				break;
				
			case "Disabled":
				this.hoverKeyFrame.value = this.options.pathFillDisabled;
				this.hoverStoryboard.begin();
				break;
			
			default:
				this.hoverKeyFrame.value = this.options.pathFill;
				this.hoverStoryboard.begin();
				break;
		}
	},
	
	setPath: function(data, width, height)
	{
		/// <summary>Sets the button path dynamically.</summary>
		/// <param name="data">The path data.</param>
		/// <param name="width">The width of the path.</param>
		/// <param name="height">The height of the path.</param>
		
		this.path.data = data;
		this.path.width = width || this.options.pathWidth;
		this.path.height = height || this.options.pathHeight;
		this.path["Canvas.Top"] = this.root.height / 2 - this.path.height / 2;
		this.path["Canvas.Left"] = this.root.width / 2 - this.path.width / 2;
	}
});