// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.FadeTransition
 *******************************************/
SlideShow.FadeTransition = function(control, options)
{
	/// <summary>A transition which fades in a new image and fades out the current one.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the transition.</param>
	
	SlideShow.FadeTransition.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		direction: "InOut",
		duration: 0.8
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.Transition, SlideShow.FadeTransition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		SlideShow.FadeTransition.base.begin.call(this, fromImage, toImage);
		
		switch (this.options.direction.toLowerCase())
		{
			case "in":
				fromImage.root.visibility = "Collapsed";
				toImage.root.visibility = "Visible";
				break;
			
			case "inout":
				fromImage.root.visibility = "Visible";
				toImage.root.visibility = "Visible";
				break;
			
			default:
				throw new Error("Invalid direction: " + this.options.direction);
		}
		
		// out storyboard
		var outAnimationXaml = '<DoubleAnimation Duration="0:0:' + this.options.duration + '" From="1" To="0" />';
		var outStoryboard = this.addStoryboard(fromImage, fromImage.image.name, "Opacity", outAnimationXaml);
		outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		outStoryboard.begin();
		
		// in storyboard
		var inAnimationXaml = '<DoubleAnimation Duration="0:0:' + this.options.duration + '" From="0" To="1" />';
		var inStoryboard = this.addStoryboard(toImage, toImage.image.name, "Opacity", inAnimationXaml);
		inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		inStoryboard.begin();
	}
});