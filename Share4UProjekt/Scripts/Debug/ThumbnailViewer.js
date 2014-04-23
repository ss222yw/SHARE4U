// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ThumbnailViewer
 *******************************************/
SlideShow.ThumbnailViewer = function(control, parent, options)
{
	/// <summary>Displays pages of thumbnails to choose from.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailViewer" Visibility="Collapsed" />';
	
	SlideShow.ThumbnailViewer.base.constructor.call(this, control, parent, xaml);
	
	// FIXME: incorrect calculations require strange values for top, left, etc. in page container below
	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		enablePreview: true,
		thumbnailViewerBackground: {},
		thumbnailNavigation:
		{
			height: 30
		},
		thumbnailPreview: {},
		thumbnailButton: {},
		pageContainer:
		{
			top: 3,
			left: 19,
			right: 19,
			bottom: -5,
			padding: 0,
			spacing: 3,
			itemWidth: 30,
			itemHeight: 30
		}		
	});
	
	this.setOptions(options);
	
	this.previewEnabled = this.options.enablePreview;
	this.thumbnailViewerBackground = new SlideShow.ThumbnailViewerBackground(this.control, this, this.options.thumbnailViewerBackground);
	this.thumbnailNavigation = new SlideShow.ThumbnailNavigation(this.control, this, this.options.thumbnailNavigation);
	this.thumbnailPreview = new SlideShow.ThumbnailPreview(this.control, this, this.options.thumbnailPreview);
	this.pageContainer = new SlideShow.PageContainer(this.control, this, this.options.pageContainer);
	
	this.pageContainer.addEventListener("pageLoad", SlideShow.createDelegate(this.thumbnailNavigation, this.thumbnailNavigation.onPageLoad));
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailViewer,
{
	getItems: function(fromIndex, count)
	{
		/// <summary>Retrieves a page of items from the overall collection of slides for the current album.</summary>
		/// <param name="fromIndex">The first index to retrieve from the current album's slides.</param>
		/// <param name="count">The number of items to retrieve overall.</param>
		
		var currentPageItems = [];
		this.currentItemListenerTokens = [];
		
		for (k = 0, l = this.currentItemListenerTokens.length; k < l; k++)
			this.slideViewer.removeEventListener(this.currentItemListenerTokens[k]);
		
		for (var i = fromIndex, j = fromIndex + count; i < j; i++)
		{
			if (this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i])
			{
				var item = new SlideShow.ThumbnailButton(this.control, null, this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i], this.options.thumbnailButton);
				
				item.addEventListener("click", SlideShow.createDelegate(this, this.onThumbnailClick));
				this.currentItemListenerTokens.push(this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(item, item.onSlideLoading)));
				item.onSlideLoading(null, this.control.data.album[this.slideViewer.currentAlbumIndex].slide[this.slideViewer.currentSlideIndex]);
				
				if (this.options.enablePreview)
				{
					item.addEventListener("mouseEnter", SlideShow.createDelegate(this, this.onThumbnailEnter));
					item.addEventListener("mouseLeave", SlideShow.createDelegate(this, this.onThumbnailLeave));
				}
				currentPageItems.push(item);
			}
		}
		
		return currentPageItems;
	},
	
	getItemCount: function()
	{
		/// <summary>Retrieves the total number of items in the current album's slide collection.</summary>
	
		if (this.control.data && this.control.data.album && this.control.data.album[this.slideViewer.currentAlbumIndex].slide)
			return this.control.data.album[this.slideViewer.currentAlbumIndex].slide.length;
		
		return 0;
	},
	
	disablePreview: function()
	{
		/// <summary>Disables the thumbnail preview feature.</summary>
		
		this.previewEnabled = false;
	},
	
	resetPreview: function()
	{
		/// <summary>Resets the thumbnail preview feature according to originally specified options.</summary>
	
		this.previewEnabled = this.options.enablePreview;
	},
	
	onControlDataLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configured data is loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
	
		if (this.control.data)
			this.pageContainer.loadPageByOffset(0);
	},
	
	onControlModulesLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all modules have loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.slideViewer = this.control.modules["SlideViewer"];
		
		if (!this.slideViewer)
			throw new Error("Expected module missing: SlideViewer");
	},
	
	onThumbnailEnter: function(sender, isSelected)
	{
		/// <summary>Handles the event fired when the mouse enters a thumbnail.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="isSelected">Event arguments that indicate if the thumbnail corresponds to the current image.</param>
		
		if (!isSelected && this.previewEnabled)
		{
			var top = sender.root["Canvas.Top"] - this.thumbnailPreview.root.height - this.thumbnailPreview.arrow.height + 3;
			var left = this.pageContainer.root["Canvas.Left"] + this.pageContainer.currentPage["Canvas.Left"] + sender.root["Canvas.Left"] + sender.root.width / 2 - this.thumbnailPreview.root.width / 2;
			
			this.thumbnailPreview.setOptions({ top: top, left: left });
			this.thumbnailPreview.reposition();			
			this.thumbnailPreview.show(sender.getThumbnailImageSource());
		}
	},
	
	onThumbnailLeave: function(sender, isSelected)
	{
		/// <summary>Handles the event fired when the mouse leaves a thumbnail.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="isSelected">Event arguments that indicate if the thumbnail corresponds to the current image.</param>
		
		this.thumbnailPreview.hide();
	},
	
	onThumbnailClick: function(sender, e)
	{
		/// <summary>Changes the currently displayed slide to the selected image and bubbles up an event to indicate that a thumbnail has been selected.</summary>
		/// <param name="sender">The ThumbnailButton instance that was clicked.</param>
		/// <param name="e">The slide data associated with the selected instance.</param>
		
		for (var i = 0, j = this.control.data.album[this.slideViewer.currentAlbumIndex].slide.length; i < j; i++)
		{
			if (this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i] == e && this.slideViewer.currentSlideIndex != i)
			{
				this.slideViewer.currentSlideIndex = i;
				this.slideViewer.loadImageByOffset(0, true);
			}
		}
		
		if (this.previewEnabled)
			this.thumbnailPreview.hide();
		
		this.fireEvent("thumbnailClick", e);
	}
});