// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.XmlDataProvider
 *******************************************/
SlideShow.XmlDataProvider = function(control, options)
{
	/// <summary>Provides album/slide data from an XML file.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the provider.</param>
	
	SlideShow.XmlDataProvider.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		url: "Data.xml"
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.DataProvider, SlideShow.XmlDataProvider,
{
	getData: function(dataHandler)
	{
		/// <summary>Retrieves the data asynchronously and calls the specified event handler (with the data).</summary>
		/// <param name="dataHandler">The event handler to be called after the data is retrieved.</param>
		
		var parser = new SlideShow.JsonParser({ arrays: "album,slide" });
		parser.addEventListener("parseComplete", dataHandler);
		parser.fromXml(this.options.url, true);
	}
});