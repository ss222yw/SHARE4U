// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.SlideViewer
 *******************************************/
SlideShow.SlideViewer = function(control, parent, options)
{
	/// <summary>Displays slide images.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the control.</param>
	
	if (options.cacheWindowSize < 3)
		throw new Error("Invalid option: cacheWindowSize");
	
	var xaml = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideViewer" Visibility="Collapsed"><Canvas.Clip><RectangleGeometry x:Name="TransitionClip" /></Canvas.Clip><Image x:Name="BufferImage" Visibility="Collapsed" /></Canvas>';
	
	SlideShow.SlideViewer.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: 0,
		left: 0,
		right: 0,
		bottom: 42,
		cacheWindowSize: 3,
		slideImage: {}
	});
	
	this.setOptions(options);
	
	this.cache = [];
	this.currentAlbumIndex = 0;
	this.currentSlideIndex = 0;
	this.allowSlideChange = false;
	this.transitionNextImage = true;
	this.transitionClip = this.root.findName("TransitionClip");
	this.bufferImage = this.root.findName("BufferImage");
	
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));
	this.bufferImage.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onBufferImageDownloadProgressChanged));
	this.bufferImage.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onBufferImageDownloadFailed));
};

SlideShow.extend(SlideShow.UserControl, SlideShow.SlideViewer,
{	
	loadCache: function()
	{
		/// <summary>Clears the image cache and loads it with new images.</summary>
		
		for (var i = this.cache.length - 1; i >= 0; i--)
			this.removeCacheImage(i);
		
		this.cache = [];
		this.cacheSize = Math.floor(this.options.cacheWindowSize / 2);
	
		for (var offset = -this.cacheSize; offset < this.cacheSize; offset++)
		{
			var dataIndex = this.getDataIndexByOffset(offset);
			
			if (dataIndex != null)
				this.cache.push(this.addCacheImage(dataIndex));
		}
	},
	
	addCacheImage: function(index)
	{
		/// <summary>Adds an image to the cache for the specified index in the current album.</summary>
		/// <param name="index">The index of the image to add.</param>
		/// <returns>The added image.</returns>
		
		var image;
		
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, index))
		{
			image = this.control.host.content.createFromXaml('<Image Visibility="Collapsed" />');
			var source = this.control.data.album[this.currentAlbumIndex].slide[index].image;
			
			if (!source)
				throw new Error("Invalid data: image");
			
			image.source = source;
			this.root.children.add(image);
		}
		
		return image;
	},
	
	removeCacheImage: function(index)
	{
		/// <summary>Removes the image at the specified index from the cache.</summary>
		/// <param name="index">The index of the image to remove.</param>
		
		this.root.children.remove(this.cache[index]);
		this.cache[index] = null;
		this.cache.splice(index, 1);
	},

	getDataIndexByOffset: function(offset)
	{
		/// <summary>Gets the slide index using an offset from the current slide index.</summary>
		/// <param name="offset">A positive or negative offset from the current slide index.</param>
		/// <returns>The slide index.</returns>
		
		var count = 0;
		
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, 0))
			count = this.control.data.album[this.currentAlbumIndex].slide.length;
		
		if (count > 0)
		{
			var index = this.currentSlideIndex + offset;
			var mod = index % count;
			return (mod < 0) ? count + mod : mod;
		}
		
		return null;
	},
	
	loadImageByOffset: function(offset, useTransition)
	{
		/// <summary>Loads an image using an offset from the current slide index.</summary>
		/// <param name="offset">A positive or negative offset from the current slide index.</param>
		/// <param name="useTransition">A value indicating whether or not a transition should be used.</param>
		
		this.currentSlideIndex = this.getDataIndexByOffset(offset);
		this.loadImage(useTransition);
	},
	
	loadImage: function(transitionNextImage)
	{
		/// <summary>Loads the image at the current slide index and fires the "slideLoading" event.</summary>
		/// <param name="transitionNextImage">Specifies whether or not to use a transition for the slide.</param>
		
		this.allowSlideChange = true;
		this.transitionNextImage = transitionNextImage;
		
		var bufferSource = this.getCurrentImageSource();
		
		if (bufferSource)
			this.bufferImage.source = bufferSource;
		else
			this.changeImage("");
		
		this.fireEvent("slideLoading", this.getCurrentSlideData());
	},
	
	getCurrentImageSource: function()
	{
		/// <summary>Gets the source for the current image.</summary>
		/// <returns>The current image source.</returns>
		
		this.adjustCacheWindow();
		
		if (this.cache.length > 0)
			return this.cache[this.cacheSize].source;
		
		return "";
	},
	
	getCurrentSlideData: function()
	{
		/// <summary>Gets the data for the current slide.</summary>
		/// <returns>The current slide data.</returns>
		
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, this.currentSlideIndex))
			return this.control.data.album[this.currentAlbumIndex].slide[this.currentSlideIndex];
		
		return null;
	},
	
	adjustCacheWindow: function()
	{
		/// <summary>Adjusts the cache window to the new slide index.</summary>
		
		var currentSlide = this.getCurrentSlideData();
		
		if (currentSlide)
		{
			var cacheIndex;
			
			for (var i = 0, j = this.cache.length; i < j; i++)
			{
				if (this.cache[i].source == currentSlide.image)
				{
					cacheIndex = i;
					break;
				}
			}

			if (cacheIndex == null)
			{
				this.loadCache();
			}
			else
			{
				var dataIndex, image;
				var offset = cacheIndex - this.cacheSize;
				var absOffset = Math.abs(offset);
				
				if (offset < 0)
				{
					for (var k = 1; k <= absOffset; k++)
					{
						dataIndex = this.getDataIndexByOffset(0 - k);
						image = this.addCacheImage(dataIndex);
						this.cache.unshift(image);
						this.removeCacheImage(this.cache.length - 1);
					}
				}
				else if (offset > 0)
				{
					for (var l = 1; l <= absOffset; l++)
					{
						dataIndex = this.getDataIndexByOffset(l);
						image = this.addCacheImage(dataIndex);
						this.cache.push(image);
						this.removeCacheImage(0);
					}
				}
			}
		}
		else
		{
			this.loadCache();
		}
	},
	
	changeImage: function(toImageSource)
	{
		/// <summary>Changes the image to the new slide.</summary>
		/// <param name="toImageSource">Specifies the source for the next slide image.</param>
		
		this.initializeSlideImages();
		
		if (this.slideImage1.root.visibility == "Visible")
		{
			this.fromImage = this.slideImage1;
			this.toImage = this.slideImage2;
		}
		else
		{
			this.fromImage = this.slideImage2;
			this.toImage = this.slideImage1;
		}
		
		this.toImage.setSource(toImageSource);
		
		this.currentTransition = null;
		
		if (this.transitionNextImage)
		{
			var transitionData = this.control.getSlideTransitionData(this.currentAlbumIndex, this.currentSlideIndex);
			this.currentTransition = this.control.createObjectInstanceFromConfig(transitionData);
		}
		else
		{
			this.currentTransition = this.control.createObjectInstanceFromConfig({ type: "NoTransition" });
			this.transitionNextImage = true;
		}
		
		this.currentTransition.addEventListener("complete", SlideShow.createDelegate(this, this.onSlideChange));
		this.currentTransition.begin(this.fromImage, this.toImage);
	},
	
	initializeSlideImages: function()
	{
		/// <summary>Initializes slide images for use in the next transition.</summary>
	
		if (this.slideImage1 == null || this.slideImage2 == null)
		{
			this.slideImage1 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			this.slideImage2 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			this.slideImage1.options.visibility = "Collapsed";
		}
		else
		{
			var slideImage1 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			slideImage1.options.visibility = this.slideImage1.root.visibility;
			slideImage1.setSource(this.slideImage1.image.source);
			
			var slideImage2 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			slideImage2.options.visibility = this.slideImage2.root.visibility;
			slideImage2.setSource(this.slideImage2.image.source);
			
			this.slideImage1.dispose();
			this.slideImage2.dispose();
			
			this.slideImage1 = slideImage1;
			this.slideImage2 = slideImage2;
		}
		
		this.slideImage1.render();
		this.slideImage2.render();
	},
	
	onControlDataLoad: function(sender, e)
	{
		/// <summary>Initializes the current album and slide indexes and loads the first available slide.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.control.isAlbumIndexValid(0))
		{
			if (this.control.data.startalbumindex || this.control.data.startslideindex)
			{
				this.currentAlbumIndex = this.control.data.startalbumindex || 0;
				this.currentSlideIndex = this.control.data.startslideindex || 0;
				this.loadImage(true);
			}
			else
			{
				for (var i = 0, j = this.control.data.album.length; i < j; i++)
				{
					var slides = this.control.data.album[i].slide;
					
					if (slides && slides.length > 0)
					{
						this.currentAlbumIndex = i;
						this.currentSlideIndex = 0;
						this.loadImage(true);
						break;
					}
				}
			}
		}
	},
	
	onBufferImageDownloadProgressChanged: function(sender, e)
	{
		/// <summary>Handles the event fired while a slide image is downloading.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (sender.downloadProgress == 1 && this.allowSlideChange)
		{
			this.allowSlideChange = false;
			this.changeImage(sender.source);
		}
		
		this.fireEvent("downloadProgressChanged", sender.downloadProgress);
	},
	
	onBufferImageDownloadFailed: function(sender, e)
	{
		/// <summary>Handles the event fired when a slide image failed to download.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		throw new Error("Image download failed: " + sender.source);
	},
	
	onSlideChange: function(sender, e)
	{
		/// <summary>Fires the slideChange event when a transition between slides is complete.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.fireEvent("slideChange", this.getCurrentSlideData());
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.SlideViewer.base.onSizeChanged.call(this);
		this.transitionClip.rect = this.root["Canvas.Left"] + "," + this.root["Canvas.Top"] + "," + this.root.width + "," + this.root.height;
	}
});