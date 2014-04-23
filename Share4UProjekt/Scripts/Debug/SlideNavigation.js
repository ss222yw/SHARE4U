// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="Silverlight.js" />

/*******************************************
 * class: SlideShow.SlideNavigation
 *******************************************/
SlideShow.SlideNavigation = function(control, parent, xaml)
{
	/// <summary>Provides a base class for navigation controls that interact with a SlideViewer instance.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="xaml">The XAML for the control.</param>
	
	SlideShow.SlideNavigation.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		enableNextSlide: true,
		enablePreviousSlide: true,
		enableTransitionOnNext: true,
		enableTransitionOnPrevious: false
	});
	
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.SlideNavigation,
{
	slideExistsByOffset: function(offset)
	{
		/// <summary>Determines if a slide exists based on the specified offset.</summary>
		/// <param name="offset">The offset from the current slide index.</param>
		/// <returns>True if the offset slide exists.</param>
		
		return (this.slideViewer.currentSlideIndex != this.slideViewer.getDataIndexByOffset(offset)) && (this.options.loopAlbum || this.control.isSlideIndexValid(this.slideViewer.currentAlbumIndex, this.slideViewer.currentSlideIndex + offset));
	},
	
	showPreviousSlide: function()
	{
		/// <summary>Shows the previous slide in the slideshow.</summary>
		
		if (this.slideExistsByOffset(-1))
		{
			if (this.slideViewer.currentTransition && this.slideViewer.currentTransition.state == "Started")
				this.slideViewer.fromImage.setSource(this.slideViewer.toImage.image.source);
			
			this.slideViewer.loadImageByOffset(-1, this.options.enableTransitionOnPrevious);
		}
	},
	
	showNextSlide: function()
	{
		/// <summary>Shows the next slide in the slideshow.</summary>
		
		if (this.slideExistsByOffset(1))
		{
			if (this.slideViewer.currentTransition && this.slideViewer.currentTransition.state == "Started")
				this.slideViewer.fromImage.setSource(this.slideViewer.toImage.image.source);
			
			this.slideViewer.loadImageByOffset(1, this.options.enableTransitionOnNext);
		}
	},
	
	onControlModulesLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all modules have loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.slideViewer = this.control.modules["SlideViewer"];
		
		if (!this.slideViewer)
			throw new Error("Expected module missing: SlideViewer");
	}
});