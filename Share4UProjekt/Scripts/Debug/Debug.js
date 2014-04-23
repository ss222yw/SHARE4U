// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * namespace: SlideShow.Debug
 *******************************************/
if (!window.SlideShow.Debug)
	window.SlideShow.Debug = {};

/*******************************************
 * function: SlideShow.Debug.log
 *******************************************/
SlideShow.Debug.log = function(label, message)
{
	/// <summary>Appends a message to the document body.</summary>
	/// <param name="label">The label.</param>
	/// <param name="message">The message.</param>
	
	document.body.innerHTML += '<div><strong>' + label + ': </strong>' + message + '</div>';
};

/*******************************************
 * function: SlideShow.Debug.test
 *******************************************/
SlideShow.Debug.test = function(label, actual, expected)
{
	/// <summary>Tests if the specified values are equal to each other and logs the result with the appropriate background color.</summary>
	/// <param name="label">The label.</param>
	/// <param name="actual">The actual value.</param>
	/// <param name="expected">The expected value.</param>
	
	if (actual === expected)
	{
		SlideShow.Debug.log(label, "Success!");
		
		if (document.body.style.background != "red")
			document.body.style.background = "green";
	}
	else
	{
		SlideShow.Debug.log(label, "Failure!");
		document.body.style.background = "red";
	}
};