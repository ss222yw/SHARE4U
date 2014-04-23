// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="Silverlight.js" />

/*******************************************
 * class: SlideShow.PageContainer
 *******************************************/
SlideShow.PageContainer = function(control, parent, options)
{
	/// <summary>A resizable control that renders pages of controls.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="PageContainer" Visibility="Collapsed">' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="storyboard">' +
		'			<DoubleAnimationUsingKeyFrames Storyboard.TargetName="currentPageTransform" Storyboard.TargetProperty="X"> ' +
		'				<SplineDoubleKeyFrame x:Name="currentPageSplineFrom" KeySpline="0,0 0,0" KeyTime="0:0:0" />' +
		'				<SplineDoubleKeyFrame x:Name="currentPageSplineTo" KeySpline="0,0 0,1" />' +
		'			</DoubleAnimationUsingKeyFrames> ' +
		'			<DoubleAnimationUsingKeyFrames Storyboard.TargetName="nextPageTransform" Storyboard.TargetProperty="X"> ' +
		'				<SplineDoubleKeyFrame x:Name="nextPageSplineFrom" KeySpline="0,0 0,0" KeyTime="0:0:0" />' +
		'				<SplineDoubleKeyFrame x:Name="nextPageSplineTo" KeySpline="0,0 0,1" />' +
		'			</DoubleAnimationUsingKeyFrames> ' +
		'		</Storyboard>' +
		'	</Canvas.Resources>' +
		'	<Canvas.Clip>' +
		'		<RectangleGeometry x:Name="centerClip" />' +
		'	</Canvas.Clip>' +
		'	<Canvas x:Name="currentPage">' +
		'		<Canvas.RenderTransform>' +
		'			<TranslateTransform x:Name="currentPageTransform" />' +
		'		</Canvas.RenderTransform>' +
		'	</Canvas>' +
		'	<Canvas x:Name="nextPage">' +
		'		<Canvas.RenderTransform>' +
		'			<TranslateTransform x:Name="nextPageTransform" />' +
		'		</Canvas.RenderTransform>' +
		'	</Canvas>' +
		'</Canvas>';
	
	SlideShow.PageContainer.base.constructor.call(this, control, parent, xaml);

	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		itemWidth: 220,
		itemHeight: 80,
		padding: 10,
		spacing: 10,
		animatePageChanges: true,
		animationDuration: 0.6
	});
	
	this.setOptions(options);
	
	this.columns = 0;
	this.rows = 0;
	this.itemCountPerPage = 0;	
	this.pageIndex = 0;
	this.pageCount = 0;
	this.currentPage = this.root.findName("currentPage");
	this.nextPage = this.root.findName("nextPage");
	this.centerClip = this.root.findName("centerClip");
	this.currentPageTransform = this.root.findName("currentPageTransform");
	this.nextPageTransform = this.root.findName("nextPageTransform");
	this.storyboard = this.root.findName("storyboard");
	this.currentPageSplineFrom = this.root.findName("currentPageSplineFrom");
	this.currentPageSplineTo = this.root.findName("currentPageSplineTo");
	this.nextPageSplineFrom = this.root.findName("nextPageSplineFrom");
	this.nextPageSplineTo = this.root.findName("nextPageSplineTo");
	
	this.storyboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onStoryboardComplete));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.PageContainer,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		SlideShow.PageContainer.base.render.call(this);
		
		this.currentPage.visibility = "Visible";
		this.nextPage.visibility = "Collapsed";		
	},
	
	determineItemFit: function(itemSize, containerSize)
	{
		/// <summary>Determines how many items can fit within a container.</summary>
		/// <param name="itemSize">The item size.</param>
		/// <param name="containerSize">The container size.</param>
		/// <returns>The number of items.</returns>
		
		if (containerSize == 0 || itemSize == 0)
			return 0;

		var itemCount = 0;
		containerSize -= this.options.padding * 2;

		if (itemSize <= containerSize)
		{
			itemCount++;
			containerSize -= itemSize;
		}

		var totalSpacePerItem = itemSize + this.options.spacing;
		itemCount += Math.floor(containerSize / totalSpacePerItem);

		return itemCount;
	},
	
	determineCanvasPosition: function(itemSize, itemIndex)
	{
		/// <summary>Determines where to position an item.</summary>
		/// <param name="itemSize">The item size.</param>
		/// <param name="itemIndex">The item index.</param>
		/// <returns>The position.</returns>
		
		var spacingSize = this.options.spacing * itemIndex;
		var existingItemSize = itemIndex * itemSize;
		return existingItemSize + spacingSize;
	},
	
	initializePages: function()
	{
		/// <summary>Initializes rows, columns, and items on the pages.</summary>
		
		//++initCounter;
		//this.control.trace("initCounter: " + initCounter);
		
		var reload = false;
		var columns = this.determineItemFit(this.options.itemWidth, this.root.width);
		var rows = this.determineItemFit(this.options.itemHeight, this.root.height);
		
		if (this.columns != columns || this.rows != rows)
		{
			reload = true;
			this.columns = columns;
			this.rows = rows;
			this.itemCountPerPage = columns * rows;
		}
		
		var pageWidth = this.columns * this.options.itemWidth + (this.columns - 1) * this.options.spacing;
		var pageHeight = this.rows * this.options.itemHeight + (this.rows - 1) * this.options.spacing;
		var centeringWidth = Math.max(this.root.width / 2 - pageWidth / 2, this.options.padding);
		var centeringHeight = this.options.padding;
		
		this.currentPage.width = this.nextPage.width = pageWidth;
		this.currentPage.height = this.nextPage.height = pageHeight;
		this.currentPage["Canvas.Left"] = this.nextPage["Canvas.Left"] = centeringWidth;
		this.currentPage["Canvas.Top"] = this.nextPage["Canvas.Top"] = centeringHeight;
		this.centerClip.Rect = centeringWidth + "," + centeringHeight + "," + pageWidth + "," + pageHeight;
		
		return reload;
	},
	
	showPage: function(items, animationDirection)
	{
		/// <summary>Displays the specified page of items.</summary>
		/// <param name="items">The items to display.</param>
		/// <param name="animationDirection">The animation direction (i.e. "Next" or "Previous").</param>
		
		var currentDuration = 0;
		var nextDuration = 0;
		var currentToValue = 0;
		var nextToValue = 0;
	
		if (animationDirection && this.options.animatePageChanges)
		{
			if (animationDirection == "Next")
			{
				currentDuration = (this.currentPageTransform.x + this.root.width) / this.root.width * this.options.animationDuration;
				nextDuration = (this.nextPageTransform.x + this.root.width) / this.root.width * this.options.animationDuration;
				currentToValue = -(this.currentPage.width + this.options.spacing);
				nextToValue = -(this.nextPage.width + this.options.spacing);
				this.nextPage["Canvas.Left"] = (this.currentPage["Canvas.Left"] + this.nextPage.width + this.options.spacing);
			}
			else
			{
				currentDuration = (this.root.width - this.currentPageTransform.x) / this.root.width * this.options.animationDuration;
				nextDuration = (this.root.width - this.nextPageTransform.x) / this.root.width * this.options.animationDuration;
				currentToValue = this.currentPage.width + this.options.spacing;
				nextToValue = this.nextPage.width + this.options.spacing;
				this.nextPage["Canvas.Left"] = (this.currentPage["Canvas.Left"] - this.nextPage.width - this.options.spacing);
			}
		}
		
		this.addItemsToContainer(this.nextPage, items);
		this.nextPage.visibility = "Visible";
		
		this.currentPageSplineFrom.value = this.currentPageTransform.x;
		this.currentPageSplineTo.value = currentToValue;
		this.currentPageSplineTo.keyTime = "0:0:" + currentDuration.toFixed(8);
		
		this.nextPageSplineFrom.value = this.nextPageTransform.x;
		this.nextPageSplineTo.value = nextToValue;
		this.nextPageSplineTo.keyTime = "0:0:" + nextDuration.toFixed(8);
		
		this.storyboard.begin();
	},
	
	addItemsToContainer: function(page, items)
	{
		/// <summary>Adds an array of items to a page.</summary>
		/// <param name="page">The page.</param>
		/// <param name="items">The items to add.</param>
		
		page.children.clear();
		
		for (var i = 0, j = 0; j < this.rows; j++)
		{
			for (var k = 0; k < this.columns; k++, i++)
			{
				if (items.length > i)
				{
					var item = items[i];
					page.children.add(item.root);
					
					item.setOptions(
					{
						width: this.options.itemWidth,
						height: this.options.itemHeight,
						top: this.determineCanvasPosition(this.options.itemHeight, j),
						left: this.determineCanvasPosition(this.options.itemWidth, k)
					});
										
					item.render();
				}
			}
		}	
	},
	
	loadPageByOffset: function(offset)
	{
		/// <summary>Displays a new page based on an offset from the current page index.</summary>
		/// <param name="offset">An offset from the current page index.</param>
		
		//++loadCounter;
		//this.control.trace("loadCounter: " + loadCounter + ", initCounter: " + initCounter);
		
		var itemCount = this.parent.getItemCount();
		
		if (itemCount > 0 && this.itemCountPerPage > 0)
			this.pageCount = Math.ceil(itemCount / this.itemCountPerPage);
		else
			this.pageCount = 0;
		
		var pageIndex = this.pageIndex + offset;
		
		if (pageIndex < 0)
			pageIndex = 0;
		
		if (pageIndex < this.pageCount)
		{
			this.pageIndex = pageIndex;
			var page = this.parent.getItems(this.pageIndex * this.itemCountPerPage, this.itemCountPerPage);
			var direction = (offset > 0) ? "Next" : (offset < 0) ? "Previous" : null;
			this.showPage(page, direction);
		}
		
		this.fireEvent("pageLoad");
	},
	
	refresh: function()
	{
		if (this.initializePages())
			this.loadPageByOffset(0);
	},
	
	onStoryboardComplete: function(sender, e)
	{
		/// <summary>Swaps the page instance references and resets the animation storyboard for the next page change.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		var nextPage = this.nextPage;
		var currentPage = this.currentPage;
		
		nextPage.visibility = "Visible";
		currentPage.visibility = "Collapsed";
		currentPage.children.clear(); 
		
		this.currentPage = this.nextPage;
		this.nextPage = currentPage;
		this.storyboard.stop();
		
		this.initializePages();
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.PageContainer.base.onSizeChanged.call(this);
		
		this.pageIndex = 0;
		
		if (this.parent.root.visibility != "Collapsed")
		{
			window.clearTimeout(this.refreshTimerId);
			this.refreshTimerId = window.setTimeout(SlideShow.createDelegate(this, this.refresh), 10);
		}
	}
});