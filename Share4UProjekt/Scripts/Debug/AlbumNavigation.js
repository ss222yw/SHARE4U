// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.AlbumNavigation
 *******************************************/
SlideShow.AlbumNavigation = function(control, parent, options)
{
	/// <summary>Provides page navigation for an AlbumViewer.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumNavigation" Visibility="Collapsed"><TextBlock x:Name="StatusTextBlock" /></Canvas>';
	
	SlideShow.AlbumNavigation.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		left: "50%",
		bottom: 0,
		width: 140,
		height: 30,
		foreground: "#777",
		fontFamily: "Portable User Interface",
		fontSize: 12,
		fontStretch: "Normal",
		fontStyle: "Normal",
		fontWeight: "Normal",
		previousButton:
		{
			width: 24,
			height: 30,
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
		nextButton:
		{
			right: 0,
			width: 24,
			height: 30,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M6.9063742,0.016 L12.875,4.9998124 6.8910001,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		}
	});
	
	this.setOptions(options);
	
	this.previousButton = new SlideShow.PathButton(control, this, this.options.previousButton);
	this.nextButton = new SlideShow.PathButton(control, this, this.options.nextButton);
	this.statusTextBlock = this.root.findName("StatusTextBlock");
	
	this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick));
	this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick));
	parent.pageContainer.addEventListener("pageLoad", SlideShow.createDelegate(this, this.onPageLoad));	
};

SlideShow.extend(SlideShow.PageNavigation, SlideShow.AlbumNavigation,
{	
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.AlbumNavigation.base.render.call(this);
		
		this.statusTextBlock.width = this.options.width - this.previousButton.options.width - this.nextButton.options.width;
		this.statusTextBlock.height = this.options.height;
		this.statusTextBlock.foreground = this.options.foreground;
		this.statusTextBlock.fontFamily = this.options.fontFamily;
		this.statusTextBlock.fontSize = this.options.fontSize;
		this.statusTextBlock.fontStretch = this.options.fontStretch;
		this.statusTextBlock.fontStyle = this.options.fontStyle;
		this.statusTextBlock.fontWeight = this.options.fontWeight;
	},
	
	setStatus: function(text)
	{
		/// <summary>Sets the status text.</summary>
		/// <param name="text">The new text.</param>
		
		SlideShow.addTextToBlock(this.statusTextBlock, text);
		this.statusTextBlock["Canvas.Top"] = this.root.height / 2 - this.statusTextBlock.actualHeight / 2;
		this.statusTextBlock["Canvas.Left"] = this.root.width / 2 - this.statusTextBlock.actualWidth / 2;
	},
	
	onPreviousClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the previous button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showPreviousPage();
	},
	
	onNextClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the next button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showNextPage();
	},
	
	onPageLoad: function(sender, e) 
	{
		/// <summary>Handles the event fired when a page is loaded in the page container.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		var pageIndex = this.parent.pageContainer.pageIndex;
		var pageCount = this.parent.pageContainer.pageCount;
		
		this.setStatus(SlideShow.formatString("Page {0} of {1}", pageIndex + 1, pageCount));
		
		if (pageIndex > 0)
			this.previousButton.enable();
		else
			this.previousButton.disable();
		
		if (pageIndex < pageCount - 1)
			this.nextButton.enable();
		else
			this.nextButton.disable();
		
		this.root.visibility = (pageCount > 0) ? "Visible" : "Collapsed";			
	}
});