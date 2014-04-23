// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ThumbnailNavigation
 *******************************************/
SlideShow.ThumbnailNavigation = function(control, parent, options)
{
	/// <summary>Provides navigation for ThumbnailViewer's page container.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="pageContainer">The page container.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailNavigation" Visibility="Collapsed" />';
	
	SlideShow.ThumbnailNavigation.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		left: 0,
		right: 0,
		height: 20,
		foreground: "#777",
		enablePreviousSlide: false,
		enableNextSlide: false,
		previousPageButton: // FIXME: naming not consistent with AlbumNavigation
		{
			left: 0,
			height: 36,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M-3.3603748,0.016 L-9.344,4.9998124 -3.3599998,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		nextPageButton:
		{
			right: 0,
			height: 36,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent", 
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M6.9063742,0.016 L12.875,4.9998124 6.8910001,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		previousButton:
		{
			top: "50%",
			left: 22,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M256.9375,633.46875L256.9375,636.43725 267.2495,636.43725 267.2495,633.437255242651 Z",
			pathWidth: 8,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		nextButton:
		{
			top: "50%",
			right: 22,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M612.21875,632.78125L612.21875,636.37525 608.56225,636.37525 608.56225,639.281489402504 612.21849996621,639.281489402504 612.21849996621,642.938131479117 615.093888547801,642.938131479117 615.093888547801,639.344555954334 618.8127229171,639.344555954334 618.8127229171,636.375554460764 615.093316965987,636.375554460764 615.12456845465,632.781500021178 Z",
			pathWidth: 8,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		}
	});
	
	this.setOptions(options);
	
	this.previousPageButton = new SlideShow.PathButton(this.control, this, this.options.previousPageButton);
	this.nextPageButton = new SlideShow.PathButton(this.control, this, this.options.nextPageButton);
	
	if (this.options.enablePreviousSlide)
	{
		this.previousButton = new SlideShow.PathButton(this.control, this, this.options.previousButton);
		this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick));
	}
	
	if (this.options.enableNextSlide)
	{
		this.nextButton = new SlideShow.PathButton(this.control, this, this.options.nextButton);
		this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick));
	}
	
	this.previousPageButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousPageClick));
	this.nextPageButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextPageClick));	
};

SlideShow.extend(SlideShow.PageNavigation, SlideShow.ThumbnailNavigation,
{
	onControlModulesLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all modules have loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.ThumbnailNavigation.base.onControlModulesLoad.call(this, sender, e);
		
		if (this.options.enablePreviousSlide || this.options.enableNextSlide)
			this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));
	},
	
	onPreviousPageClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the previous page button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showPreviousPage();
	},
	
	onNextPageClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the next page button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showNextPage();
	},
	
	onPreviousClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the previous button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showPreviousSlide();
		this.fireEvent("previousClick");
	},
	
	onNextClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the next button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showNextSlide();
		this.fireEvent("nextClick");
	},
	
	onPageLoad: function(sender, e) 
	{
		/// <summary>Handles the event fired when a page is loaded in the page container.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		var pageIndex = this.parent.pageContainer.pageIndex;
		var pageCount = this.parent.pageContainer.pageCount;
		
		if (pageIndex > 0)
			this.previousPageButton.enable();
		else
			this.previousPageButton.disable();
		
		if (pageIndex < pageCount - 1)
			this.nextPageButton.enable();
		else
			this.nextPageButton.disable();
	},
	
	onSlideLoading: function(sender, e)
	{
		/// <summary>Handles the event fired when the next slide is loading.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.options.enablePreviousSlide)
		{
			if (this.slideExistsByOffset(-1))
				this.previousButton.enable();
			else
				this.previousButton.disable();
		}
		
		if (this.options.enableNextSlide)
		{
			if (this.slideExistsByOffset(1))
				this.nextButton.enable();
			else
				this.nextButton.disable();
		}
	}
});