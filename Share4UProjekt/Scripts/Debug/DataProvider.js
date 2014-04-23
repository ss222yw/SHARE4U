// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.DataProvider
 *******************************************/
SlideShow.DataProvider = function(control)
{
	/// <summary>Provides a base class for data providers.</summary>
	/// <param name="control">The Slide.Show control.</param>
	
	SlideShow.DataProvider.base.constructor.call(this);
	
	this.control = control;
};

SlideShow.extend(SlideShow.Object, SlideShow.DataProvider,
{
});