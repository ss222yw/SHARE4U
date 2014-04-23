// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.AlbumViewer
 *******************************************/
SlideShow.AlbumViewer = function(control, parent, options)
{
	/// <summary>Displays pages of albums to choose from.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumViewer" Visibility="Collapsed" />';
	
	SlideShow.AlbumViewer.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		background: "Black",
		visibility: "Collapsed",
		transitionSlideOnAlbumChange: true,
		pageContainer: {},
		albumNavigation: {},
		albumButton: {}
	});
	
	this.setOptions(options);
	
	this.pageContainer = new SlideShow.PageContainer(control, this, this.options.pageContainer);
	this.albumNavigation = new SlideShow.AlbumNavigation(control, this, this.options.albumNavigation);
	this.pageContainer.options.bottom = this.albumNavigation.options.height;
	
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onModulesLoad));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.AlbumViewer,
{	
	getItems: function(fromIndex, count)
	{
		/// <summary>Retrieves a set of items from the album collection.</summary>
		/// <param name="fromIndex">The index from which to retrieve items from the album collection.</param>
		/// <param name="count">The number of items to retrieve.</param>
		/// <returns>An array of AlbumButton items.</returns>
		
		var items = [];
		
		for (var i = fromIndex, j = fromIndex + count; i < j; i++)
		{
			var album = this.control.data.album[i];
			
			if (album)
			{
				var item = new SlideShow.AlbumButton(this.control, null, album, this.options.albumButton);
				item.addEventListener("click", SlideShow.createDelegate(this, this.onAlbumClick));
				items.push(item);
			}
		}
		
		return items;
	},
	
	getItemCount: function()
	{
		/// <summary>Retrieves the number of items in the album collection.</summary>
		
		return this.control.isAlbumIndexValid(0) ? this.control.data.album.length : 0;
	},
	
	onModulesLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all modules have loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.slideViewer = this.control.modules["SlideViewer"];
		
		if (!this.slideViewer)
			throw new Error("Expected module missing: SlideViewer");
	},

	onAlbumClick: function(sender, e)
	{
		/// <summary>Bubbles up an event to indicate that an album has been selected.</summary>
		/// <param name="sender">The AlbumButton instance that was clicked.</param>
		/// <param name="e">The album information associated with the selected instance.</param>
	
		for (var i = 0, j = this.control.data.album.length; i < j; i++)
		{
			if (this.control.data.album[i] == e && (this.slideViewer.currentAlbumIndex != i || this.slideViewer.currentSlideIndex != 0))
			{
				this.slideViewer.currentAlbumIndex = i;
				this.slideViewer.currentSlideIndex = 0;
				this.slideViewer.loadImageByOffset(0, this.options.transitionSlideOnAlbumChange);
			}
		}
		
		this.fireEvent("albumClick", e);
	}
});