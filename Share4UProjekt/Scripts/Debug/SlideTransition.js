// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.SlideTransition
 *******************************************/
SlideShow.SlideTransition = function(control, options)
{
	/// <summary>A transition which slides in a new image and slides out the current one.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the transition.</param>
	
	SlideShow.SlideTransition.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		direction: "Left",
		duration: 0.8
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.Transition, SlideShow.SlideTransition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		SlideShow.SlideTransition.base.begin.call(this, fromImage, toImage);
		
		var fromImageToValue, toImageFromValue, targetProperty;
		
		switch (this.options.direction.toLowerCase())
		{
			case "left":
				fromImageToValue = -this.control.root.width;
				toImageFromValue = this.control.root.width;
				targetProperty = "(Canvas.Left)";
				break;
			
			case "right":
				fromImageToValue = this.control.root.width;
				toImageFromValue = -this.control.root.width;
				targetProperty = "(Canvas.Left)";
				break;
			
			case "up":
				fromImageToValue = -this.control.root.height;
				toImageFromValue = this.control.root.height;
				targetProperty = "(Canvas.Top)";
				break;
			
			case "down":
				fromImageToValue = this.control.root.height;
				toImageFromValue = -this.control.root.height;
				targetProperty = "(Canvas.Top)";
				break;
			
			default:
				throw new Error("Invalid direction: " + this.options.direction);
		}
		
		fromImage.root.visibility = "Visible";
		toImage.root.visibility = "Visible";
		
		// out storyboard
		var outAnimationXaml =
			'<DoubleAnimationUsingKeyFrames>' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:0" Value="0" />' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="' + fromImageToValue + '" />' +
			'</DoubleAnimationUsingKeyFrames>';
		
		var outStoryboard = this.addStoryboard(fromImage, fromImage.image.name, targetProperty, outAnimationXaml);
		outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		outStoryboard.begin();	
		
		// in storyboard
		var inAnimationXaml =
			'<DoubleAnimationUsingKeyFrames>' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:0" Value="' + toImageFromValue + '" />' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="0" />' +
			'</DoubleAnimationUsingKeyFrames>';
		
		var inStoryboard = this.addStoryboard(toImage, toImage.image.name, targetProperty, inAnimationXaml);
		inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		inStoryboard.begin();	
	}
});