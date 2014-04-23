// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.NoTransition
 *******************************************/
SlideShow.NoTransition = function(control)
{
	/// <summary>A transition which simply switches the current image with a new one.</summary>
	/// <param name="control">The Slide.Show control.</param>
	
	SlideShow.NoTransition.base.constructor.call(this, control);
};

SlideShow.extend(SlideShow.Transition, SlideShow.NoTransition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		SlideShow.NoTransition.base.begin.call(this, fromImage, toImage);
		
		fromImage.root.visibility = "Collapsed";
		toImage.root.visibility = "Visible";	
		this.complete();
	}
});