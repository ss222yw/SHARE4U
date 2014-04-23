// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="Silverlight.js" />

/*******************************************
 * class: SlideShow.PageNavigation
 *******************************************/
SlideShow.PageNavigation = function(control, parent, xaml)
{
	/// <summary>Provides a base class for page container navigation.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="xaml">The XAML for the control.</param>
	
	SlideShow.PageNavigation.base.constructor.call(this, control, parent, xaml);
};

SlideShow.extend(SlideShow.SlideNavigation, SlideShow.PageNavigation,
{
	showPreviousPage: function()
	{
		/// <summary>Shows the previous page in the page container.</summary>
		
		this.parent.pageContainer.loadPageByOffset(-1);
	},
	
	showNextPage: function()
	{
		/// <summary>Shows the next page in the page container.</summary>
		
		this.parent.pageContainer.loadPageByOffset(1);
	}
});