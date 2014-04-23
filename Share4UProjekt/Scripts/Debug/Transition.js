// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.Transition
 *******************************************/
SlideShow.Transition = function(control)
{
	/// <summary>Provides a base class for transitions.</summary>
	/// <param name="control">The Slide.Show control.</param>
	
	SlideShow.Transition.base.constructor.call(this);
	
	this.control = control;
	this.state = "Stopped";
};

SlideShow.extend(SlideShow.Object, SlideShow.Transition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		this.state = "Started";
		this.fromImage = fromImage;
		this.toImage = toImage;
		this.outStoryboardComplete = false;
		this.inStoryboardComplete = false;
	},
	
	complete: function()
	{
		/// <summary>Cleans up after the transition and fires the "complete" event.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.fromImage.root != null)
			this.fromImage.root.visibility = "Collapsed";
		
		if (this.toImage.root != null)
			this.toImage.root.visibility = "Visible";
		
		this.state = "Stopped";
		this.fireEvent("complete");
	},
	
	addStoryboard: function(slideImage, targetName, targetProperty, animationXaml)
	{
		/// <summary>Adds a storyboard to the specified SlideImage control.</summary>
		/// <param name="slideImage">The SlideImage control.</param>
		/// <param name="targetName">The TargetName value for the added storyboard.</param>
		/// <param name="targetProperty">The TargetProperty value for the added storyboard.</param>
		/// <param name="animationXaml">The animation XAML for the added storyboard.</param>
		/// <returns>The added storyboard.</returns>
		
		var storyboardXaml = '<Storyboard xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="TransitionStoryboard" Storyboard.TargetName="' + targetName + '" Storyboard.TargetProperty="' + targetProperty + '">' + animationXaml + '</Storyboard>';
		var storyboard = this.control.host.content.createFromXaml(storyboardXaml);
		slideImage.root.resources.add(storyboard);
		return storyboard;
	},
	
	createClippingPath: function(geometryXaml)
	{
		/// <summary>Creates a clipping path containing a geometry group with the specified XAML.</summary>
		/// <param name="geometryXaml">The geometry XAML representing the clipping path for the canvas.</param>
		/// <returns>The clipping path.</returns>
		
		var clipXaml = '<GeometryGroup>' + geometryXaml + '</GeometryGroup>';
		return this.control.host.content.createFromXaml(clipXaml);
	},
	
	onOutStoryboardComplete: function(sender, e)
	{
		/// <summary>Cleans up the completed storyboards and fires the "complete" event.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.outStoryboardComplete = true;
		
		if (this.inStoryboardComplete)
			this.complete();
	},
	
	onInStoryboardComplete: function(sender, e)
	{
		/// <summary>Cleans up the completed storyboards and fires the "complete" event.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.inStoryboardComplete = true;
		
		if (this.outStoryboardComplete)
			this.complete();
	}	
});