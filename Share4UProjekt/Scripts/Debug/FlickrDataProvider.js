// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.FlickrDataProvider
 *******************************************/
SlideShow.FlickrDataProvider = function(control, options)
{
	/// <summary>Provides album/slide data from Flickr.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the provider.</param>
	
	SlideShow.FlickrDataProvider.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		apiKey: "b45329018eafdf2a4f89ebf6fb2bf47a",
		userName: null,
		usePublic: false,
		maxPublicPhotos: 100,
		transition: "CrossFadeTransition"
	});
	
	this.setOptions(options);
	
	this.albums = {};
	this.data = { transition: this.options.transition, album: [] };
};

SlideShow.extend(SlideShow.DataProvider, SlideShow.FlickrDataProvider,
{
	getData: function(dataHandler)
	{
		/// <summary>Retrieves the data asynchronously and calls the specified event handler (with the data).</summary>
		/// <param name="dataHandler">The event handler to be called after the data is retrieved.</param>
		
		this.dataHandler = dataHandler;
		this.getUserId(this.options.userName);
	},
	
	getUserId: function(userName)
	{
		/// <summary>Gets the user ID corresponding to the specified Flickr username.</summary>
		/// <param name="userName">The Flickr username.</param>
		
		this.callFlickr("flickr.people.findByUsername&username=" + userName, SlideShow.createDelegate(this, this.onUserIdCallback));
	},
	
	getPhotosets: function(userId)
	{
		/// <summary>Gets all photosets for the specified Flickr user.</summary>
		/// <param name="userId">The Flickr user ID.</param>
		
		this.callFlickr("flickr.photosets.getList&user_id=" + userId, SlideShow.createDelegate(this, this.onPhotosetsCallback));
	},
	
	getPhotos: function(photosetId)
	{
		/// <summary>Gets all photos for the specified Flickr photoset.</summary>
		/// <param name="photosetId">The Flickr photoset ID.</param>
		
		this.callFlickr("flickr.photosets.getPhotos&photoset_id=" + photosetId, SlideShow.createDelegate(this, this.onPhotosCallback));
	},
	
	getPublicPhotos: function(userId)
	{
		/// <summary>Gets all public photos for the specified Flickr user.</summary>
		/// <param name="userId">The Flickr user ID.</param>
		
		this.callFlickr("flickr.people.getPublicPhotos&user_id=" + userId + "&per_page=" + this.options.maxPublicPhotos, SlideShow.createDelegate(this, this.onPublicPhotosCallback));		
	},
	
	callFlickr: function(query, callbackHandler)
	{
		/// <summary>Calls a method from the Flickr API.</summary>
		/// <param name="query">The method and parameters to append to the REST endpoint URL.</param>
		/// <param name="callbackHandler">The event handler to be called when the callback event is fired.</param>
		
		var callback = SlideShow.getUniqueId("SlideShow_Callback_");
		var parser = new SlideShow.JsonParser();
		parser.addEventListener("callback", callbackHandler);
		parser.fromFeed("http://api.flickr.com/services/rest/?api_key=" + this.options.apiKey + "&format=json&jsoncallback=" + callback + "&method=" + query, callback);
	},
	
	buildAlbum: function(photoset)
	{
		/// <summary>Builds an album object from Flickr data.</summary>
		/// <param name="photoset">The photoset data.</param>
		/// <returns>The album object.</returns>
			
		var album = {};
		album.title = photoset.title._content;
		album.description = photoset.description._content;
		album.image = this.buildImageUrl(photoset.farm, photoset.server, photoset.primary, photoset.secret, "s");
		album.slide = [];
		return album;
	},
	
	buildSlide: function(photo)
	{
		/// <summary>Builds a slide object from Flickr data.</summary>
		/// <param name="photo">The photo data.</param>
		/// <returns>The slide object.</returns>
			
		var slide = {};
		slide.title = photo.title;
		slide.description = photo.description || "";
		slide.image = this.buildImageUrl(photo.farm, photo.server, photo.id, photo.secret);
		return slide;
	},
	
	buildImageUrl: function(farm, server, photoId, secret, option)
	{
		/// <summary>Builds an image URL from Flickr data -- see http://www.flickr.com/services/api/misc.urls.html for additional information.</summary>
		/// <param name="farm">The farm.</param>
		/// <param name="server">The server.</param>
		/// <param name="photoId">The photo ID.</param>
		/// <param name="secret">The secret.</param>
		/// <param name="option">The image option.</param>
		/// <returns>The image URL.</returns>
		
		return SlideShow.formatString("http://farm{0}.static.flickr.com/{1}/{2}_{3}{4}.jpg", farm, server, photoId, secret, (option) ? "_" + option : "");
	},
	
	onUserIdCallback: function(sender, e)
	{
		/// <summary>Handles the event fired when the callback function is called for the "getUserId" method.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (e.stat == "ok")
		{
			if (this.options.usePublic)
				this.getPublicPhotos(e.user.id);
			else
				this.getPhotosets(e.user.id);
		}
		else
		{
			throw new Error("Feed failed: " + e.message);
		}
	},
		
	onPhotosetsCallback: function(sender, e)
	{
		/// <summary>Handles the event fired when the callback function is called for the "getPhotosets" method.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (e.stat == "ok")
		{
			this.albumCount = e.photosets.photoset.length;
			
			for (var i = 0, j = this.albumCount; i < j; i++)
			{
				var photoset = e.photosets.photoset[i];
				var album = this.buildAlbum(photoset);
				this.data.album.push(album);
				this.albums[photoset.id] = album;
				this.getPhotos(photoset.id);
			}
		}
		else
		{
			throw new Error("Feed failed: " + e.message);
		}
	},
	
	onPhotosCallback: function(sender, e)
	{
		/// <summary>Handles the event fired when the callback function is called for the "getPhotos" method.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (e.stat == "ok")
		{
			var album = this.albums[e.photoset.id];
			
			for (var i = 0, j = e.photoset.photo.length; i < j; i++)
			{
				var slide = this.buildSlide(e.photoset.photo[i]);
				album.slide.push(slide);
			}
			
			if (--this.albumCount == 0)
				this.dataHandler(this, { data: this.data });
		}
		else
		{
			throw new Error("Feed failed: " + e.message);
		}
	},
	
	onPublicPhotosCallback: function(sender, e)
	{
		/// <summary>Handles the event fired when the callback function is called for the "getPublicPhotos" method.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (e.stat == "ok")
		{
			// treat public photos as 1 album/photoset
			var album = {};
			album.title = "Public Photos";
			album.description = "";
			
			var firstPhoto = e.photos.photo[0];
			
			if (firstPhoto != null)
			{
				album.image = this.buildImageUrl(firstPhoto.farm, firstPhoto.server, firstPhoto.id, firstPhoto.secret, "s");
				album.slide = [];
				
				this.data.album.push(album);
				this.albums[0] = album;
				this.albumCount = 1;
				
				// retrieve the photos
				for (var i = 0; i < e.photos.total && i < e.photos.perpage; i++)
				{
					var slide = this.buildSlide(e.photos.photo[i]);
					album.slide.push(slide);
				}
			}
			
			if (--this.albumCount == 0)
				this.dataHandler(this, { data: this.data });
		}
		else
		{
			throw new Error("Feed failed: " + e.message);
		}
	}
});