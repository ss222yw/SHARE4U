// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ProgressIndicator
 *******************************************/
SlideShow.ProgressIndicator = function(control, parent, xaml)
{
	/// <summary>Provides a base class for progress indicators.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="xaml">The XAML for the control.</param>
	
	SlideShow.ProgressIndicator.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: "50%",
		left: "50%",
		width: 40,
		height: 40,
		opacity: 0,
		progressBackground: "#99000000",
		progressForeground: "#99FFFFFF",
		progressBorderColor: "White",
		progressBorderThickness: 2,
		fadeAnimationDuration: 0.3
	});
	
	this.fadeStoryboard = this.root.findName("FadeStoryboard");
	this.fadeAnimation = this.root.findName("FadeAnimation");
	
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.ProgressIndicator,
{
	updateProgress: function(progress)
	{
		/// <summary>Updates the progress displayed by the control.</summary>
		/// <param name="progress">A value between 0 and 1 that specifies the current progress.</param>
		
		if (progress == 1)
			this.fadeOut();
		else if (this.root.opacity == 0)
			this.fadeIn();
	},
	
	fadeIn: function()
	{
		/// <summary>Fades the control into view.</summary>
		
		var duration = (1 - this.root.opacity) * this.options.fadeAnimationDuration;
		
		if (duration > 0)
		{
			this.fadeAnimation.to = 1;
			this.fadeAnimation.duration = "0:0:" + duration.toFixed(8);
			this.fadeStoryboard.begin();
		}
	},
	
	fadeOut: function()
	{
		/// <summary>Fades the control out of view.</summary>
		
		var duration = this.root.opacity * this.options.fadeAnimationDuration;
		
		if (duration > 0)
		{
			this.fadeAnimation.to = 0;
			this.fadeAnimation.duration = "0:0:" + duration.toFixed(8);
			this.fadeStoryboard.begin();
		}
	},
	
	onControlModulesLoad: function()
	{
		/// <summary>Handles the event fired when all modules configured for the Slide.Show control are loaded.</summary>
		
		this.slideViewer = this.control.modules["SlideViewer"];
		
		if (!this.slideViewer)
			throw new Error("Expected module missing: SlideViewer");
		
		this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));	
		this.slideViewer.addEventListener("downloadProgressChanged", SlideShow.createDelegate(this, this.onSlideDownloadProgressChanged));
	},
	
	onSlideLoading: function(sender, e)
	{
		/// <summary>Resets the progress when the SlideViewer module fires the "slideLoading" event.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (e)
			this.updateProgress(0);
	},
	
	onSlideDownloadProgressChanged: function(sender, e)
	{
		/// <summary>Updates the progress when the SlideViewer module fires the "imageDownloadProgressChanged" event.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.updateProgress(e);
	}
});