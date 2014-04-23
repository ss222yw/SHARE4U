// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.NavigationTray
 *******************************************/
SlideShow.NavigationTray = function(control, parent, options)
{
	/// <summary>Controls Slide.Show navigation (including albums, slides, and fullscreen mode).</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for the module.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="NavigationTray" Visibility="Collapsed">' +
		'	<Canvas.RenderTransform>' +
		'		<TranslateTransform x:Name="SlideTransform" />' +
		'	</Canvas.RenderTransform>' +
		'	<Canvas.Resources>' +
		'		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="NavigationTray" Storyboard.TargetProperty="Opacity">' +
		'			<DoubleAnimation x:Name="FadeAnimation" />' +
		'		</Storyboard>' +
		'		<Storyboard x:Name="SlideStoryboard" Storyboard.TargetName="SlideTransform" Storyboard.TargetProperty="Y">' +
		'			<DoubleAnimationUsingKeyFrames> ' +
		'				<SplineDoubleKeyFrame x:Name="SlideKeyFrame1" KeySpline="0,0 0,0" KeyTime="0:0:0" />' +
		'				<SplineDoubleKeyFrame x:Name="SlideKeyFrame2" KeySpline="0,0 0,1" />' +
		'			</DoubleAnimationUsingKeyFrames> ' +
		'		</Storyboard>' +	
		'	</Canvas.Resources>' +
		'</Canvas>';
	
	SlideShow.NavigationTray.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		background: "#3C3C3C",
		alwaysVisibleHeight: 42,
		enableFadeAnimation: true,
		enableInitialFade: true,
		initialFadeTimout: 1000,
		initialAlbumView: false,
		fadeOpacity: 0.4,
		fadeInAnimationDuration: 0.5,
		fadeOutAnimationDuration: 0.5,
		slideAnimationDuration: 0.6,
		container:
		{
			top: 0,
			left: "50%",
			width: 500,
			height: 42
		},
		slideShowNavigation:
		{
			top: 11,
			left: 5
		},
		thumbnailViewer:
		{
			top: 3,
			left: 76,
			width: 350,
			height: 36
		},
		toggleAlbumViewButton:
		{
			top: 11,
			right: 32,
			pathData: "M0.3068684,6.6970766E-23 L4.8691305,6.6970766E-23 C5.0380702,3.6356173E-08 5.1759998,0.13792887 5.1759998,0.30690225 L5.1759998,2.6368366 C5.1759998,2.8058099 5.0380702,2.9437565 4.8691305,2.9437565 L0.3068684,2.9437565 C0.13680684,2.9437565 1.2251062E-13,2.8058099 -3.3276147E-30,2.6368366 L-3.3276147E-30,0.30690225 C1.2251062E-13,0.13792887 0.13680684,3.6356173E-08 0.3068684,6.6970766E-23 z M6.5989051,3.4025645E-07 L11.162244,3.4025645E-07 C11.331214,2.5640611E-07 11.468,0.13793494 11.468,0.30690496 L11.468,2.6368515 C11.468,2.8058217 11.331214,2.9437562 11.162244,2.9437562 L6.5989051,2.9437562 C6.4299352,2.9437562 6.2920002,2.8058217 6.2920002,2.6368515 L6.2920002,0.30690496 C6.2920002,0.13793494 6.4299352,2.5640611E-07 6.5989051,3.4025645E-07 z M0.30690471,4.0560001 L4.8690952,4.0560001 C5.0380656,4.0560001 5.1760002,4.1927856 5.1760002,4.3617556 L5.1760002,6.6928522 C5.1760002,6.861822 5.0380656,6.9997566 4.8690952,6.9997566 L0.30690471,6.9997566 C0.1367853,6.9997566 4.0662732E-08,6.861822 -3.3276153E-30,6.6928522 L-3.3276153E-30,4.3617556 C4.0662732E-08,4.1927856 0.1367853,4.0560001 0.30690471,4.0560001 z M6.5989051,4.0560005 L11.162244,4.0560005 C11.331214,4.0560005 11.468,4.192786 11.468,4.3617559 L11.468,6.6928519 C11.468,6.8618216 11.331214,6.9997562 11.162244,6.9997562 L6.5989051,6.9997562 C6.4299352,6.9997562 6.2920002,6.8618216 6.2920002,6.6928519 L6.2920002,4.3617559 C6.2920002,4.192786 6.4299352,4.0560005 6.5989051,4.0560005 z M0.30690471,8.1120001 L4.8690952,8.1120001 C5.0380656,8.1120001 5.1760002,8.2487856 5.1760002,8.4177556 L5.1760002,10.748852 C5.1760002,10.917822 5.0380656,11.055757 4.8690952,11.055757 L0.30690471,11.055757 C0.1367853,11.055757 4.0662732E-08,10.917822 -3.3276153E-30,10.748852 L-3.3276153E-30,8.4177556 C4.0662732E-08,8.2487856 0.1367853,8.1120001 0.30690471,8.1120001 z M6.5989051,8.1120005 L11.162244,8.1120005 C11.331214,8.1120005 11.468,8.248786 11.468,8.4177559 L11.468,10.748852 C11.468,10.917822 11.331214,11.055756 11.162244,11.055756 L6.5989051,11.055756 C6.4299352,11.055756 6.2920002,10.917822 6.2920002,10.748852 L6.2920002,8.4177559 C6.2920002,8.248786 6.4299352,8.1120005 6.5989051,8.1120005 Z",
			pathWidth: 11,
			pathHeight: 11
		},
		albumViewer:
		{
			top: 42
		},
		toggleFullScreenModeButton:
		{
			top: 11,
			right: 5,
			pathData: "M 7.90548,1.32341L 14.6458,1.32341L 14.6458,8.02661L 12.3811,5.78146L 8.43281,9.72004L 6.21009,7.42345L 10.1668,3.57935L 7.90548,1.32341 Z M -1.60064e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -8.30604e-007,14.6963L -2.59563e-008,14.6651L -8.30604e-007,13.3317L -1.60064e-007,2.68583L -2.59563e-008,2.32351L -1.60064e-007,1.35265 Z",
			pathWidth: 12,
			pathHeight: 10
		}
	});
	
	this.setOptions(options);
	
	this.container = new SlideShow.UserControl(control, this, '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="NavigationContainer" Visibility="Collapsed" />', this.options.container);
	this.slideShowNavigation = new SlideShow.SlideShowNavigation(control, this.container, this.options.slideShowNavigation);
	this.thumbnailViewer = new SlideShow.ThumbnailViewer(this.control, this.container, this.options.thumbnailViewer);
	this.toggleAlbumViewButton = new SlideShow.PathButton(control, this.container, this.options.toggleAlbumViewButton);
	this.toggleFullScreenModeButton = new SlideShow.PathButton(control, this.container, this.options.toggleFullScreenModeButton);
	this.albumViewer = new SlideShow.AlbumViewer(control, this, this.options.albumViewer);
	
	this.fadeStoryboard = this.root.findName("FadeStoryboard");
	this.fadeAnimation = this.root.findName("FadeAnimation");
	this.slideTransform = this.root.findName("SlideTransform");
	this.slideStoryboard = this.root.findName("SlideStoryboard");
	this.slideKeyFrame1 = this.root.findName("SlideKeyFrame1");
	this.slideKeyFrame2 = this.root.findName("SlideKeyFrame2");
	
	// slide out events
	this.slideShowNavigation.addEventListener("previousClick", SlideShow.createDelegate(this, this.slideOut));
	this.slideShowNavigation.addEventListener("playClick", SlideShow.createDelegate(this, this.slideOut));
	this.slideShowNavigation.addEventListener("nextClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.addEventListener("thumbnailClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.thumbnailNavigation.addEventListener("previousClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.thumbnailNavigation.addEventListener("nextClick", SlideShow.createDelegate(this, this.slideOut));
	
	// local events
	this.toggleAlbumViewButton.addEventListener("click", SlideShow.createDelegate(this, this.onToggleAlbumViewClick));
	this.toggleFullScreenModeButton.addEventListener("click", SlideShow.createDelegate(this, this.onToggleFullScreenModeClick));
	this.albumViewer.addEventListener("albumClick", SlideShow.createDelegate(this, this.onAlbumClick));
	this.slideStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onSlideStoryboardCompleted));
	
	// control events
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));
	this.control.addEventListener("fullScreenChange", SlideShow.createDelegate(this, this.onControlFullScreenChange));
	
	// fade events
	if (this.options.enableFadeAnimation)
	{
		this.root.addEventListener("MouseMove", SlideShow.createDelegate(this, this.onMouseMove));
		this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
		this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave));
	}
};

SlideShow.extend(SlideShow.UserControl, SlideShow.NavigationTray,
{
	render: function()
	{
		/// <summary>Renders the module using the current options.</summary>
		
		SlideShow.NavigationTray.base.render.call(this);
		
		this.root["Canvas.Top"] = this.root.height - this.options.alwaysVisibleHeight;
		this.toggleFullScreenModeButton.enable();
		
		if (this.options.enableFadeAnimation && this.options.enableInitialFade)
		{
			this.enableFade = true;
			window.setTimeout(SlideShow.createDelegate(this, this.fadeOut), this.options.initialFadeTimout);
		}
	},

	fadeIn: function()
	{
		/// <summary>Fades the control into view.</summary>
		
		if (this.enableFade)
		{
			var start = this.root.opacity;
			var finish = 1;
			var distance = 1 - this.options.fadeOpacity;
			var duration = (finish - start) / distance * this.options.fadeInAnimationDuration;			
			
			if (duration > 0)
			{
				this.fadeAnimation.to = finish;
				this.fadeAnimation.duration = "0:0:" + duration.toFixed(8);
				this.fadeStoryboard.begin();
			}
		}
	},
	
	fadeOut: function()
	{
		/// <summary>Fades the control out of view.</summary>
		
		if (this.enableFade && !this.isAlbumView && !this.isSlidingIn && !this.isSlidingOut)
		{
			var start = this.root.opacity;
			var finish = this.options.fadeOpacity;
			var distance = 1 - this.options.fadeOpacity;
			var duration = (start - finish) / distance * this.options.fadeOutAnimationDuration;		
			
			if (duration > 0)
			{
				this.fadeAnimation.to = finish;
				this.fadeAnimation.duration = "0:0:" + duration.toFixed(8);
				this.fadeStoryboard.begin();
			}
		}
	},	
	
	slideIn: function()
	{
		/// <summary>Slides the entire control into view.</summary>
		
		this.isAlbumView = false;
		this.isSlidingIn = true;
		this.isSlidingOut = false;
		
		this.fadeStoryboard.stop();
		this.albumViewer.pageContainer.refresh();
		this.albumViewer.root.visibility = "Visible";
		
		var start = this.slideTransform.y;
		var finish = -(this.root.height - this.options.alwaysVisibleHeight);
		var distance = this.root.height - this.options.alwaysVisibleHeight;
		var duration = (start - finish) / distance * this.options.slideAnimationDuration;
		
		if (duration > 0)
		{
			this.slideKeyFrame1.value = start;
			this.slideKeyFrame2.value = finish;
			this.slideKeyFrame2.keyTime = "0:0:" + duration.toFixed(8);
			this.slideStoryboard.begin();
		}
		
		this.thumbnailViewer.disablePreview();
	},	
	
	slideOut: function()
	{
		/// <summary>Slides the entire control out of view.</summary>
		
		if (this.isAlbumView || this.isSlidingIn)
		{
			this.isAlbumView = false;
			this.isSlidingIn = false;
			this.isSlidingOut = true;
			
			var start = this.slideTransform.y;
			var finish = 0;
			var distance = this.root.height - this.options.alwaysVisibleHeight;
			var duration = (finish - start) / distance * this.options.slideAnimationDuration;
			
			if (duration > 0)
			{
				this.slideKeyFrame1.value = start;
				this.slideKeyFrame2.value = finish;
				this.slideKeyFrame2.keyTime = "0:0:" + duration.toFixed(8);
				this.slideStoryboard.begin();
			}
			
			this.thumbnailViewer.resetPreview();
		}
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
	
	onControlDataLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configured data is loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>

		if (this.control.isAlbumIndexValid(0))
		{
			this.toggleAlbumViewButton.enable();
			
			if (this.options.initialAlbumView)
				this.slideIn();
		}
	},
	
	onControlFullScreenChange: function(sender, e)
	{
		/// <summary>Handles the event fired when the control changes between embedded and full-screen mode.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.control.isFullScreenMode())
			this.toggleFullScreenModeButton.setPath("M 12.9504,9.72004L 6.21009,9.72004L 6.21009,3.01684L 8.47481,5.26199L 12.4231,1.32341L 14.6458,3.62L 10.6891,7.4641L 12.9504,9.72004 Z M 3.51898e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -1.79383e-006,14.6963L 3.51898e-007,14.6651L -1.79383e-006,13.3317L 3.51898e-007,2.68583L 3.51898e-007,2.32351L 3.51898e-007,1.35265 Z");
		else
			this.toggleFullScreenModeButton.setPath("M 7.90548,1.32341L 14.6458,1.32341L 14.6458,8.02661L 12.3811,5.78146L 8.43281,9.72004L 6.21009,7.42345L 10.1668,3.57935L 7.90548,1.32341 Z M -1.60064e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -8.30604e-007,14.6963L -2.59563e-008,14.6651L -8.30604e-007,13.3317L -1.60064e-007,2.68583L -2.59563e-008,2.32351L -1.60064e-007,1.35265 Z");
	},
	
	onMouseMove: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse moves within the tray.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.fadeIn();
		this.enableFade = false;
	},
	
	onMouseEnter: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse enters the tray.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.fadeIn();
		this.enableFade = false;
	},
	
	onMouseLeave: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse leaves the tray.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.enableFade = true;
		this.fadeOut();
	},
	
	onToggleAlbumViewClick: function(sender, e)
	{
		/// <summary>Handles the event fired when the albums button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.isAlbumView || this.isSlidingIn)
			this.slideOut();
		else
			this.slideIn();
	},
	
	onToggleFullScreenModeClick: function(sender, e)
	{
		/// <summary>Handles the event fired when the full-screen button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.control.toggleFullScreenMode();
	},
	
	onAlbumClick: function(sender, e)
	{
		/// <summary>Handles the event fired when an album button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.thumbnailViewer.pageContainer.pageIndex = 0;
		this.thumbnailViewer.pageContainer.initializePages();
		this.thumbnailViewer.pageContainer.loadPageByOffset(0);
		this.slideOut();
	},

	onSlideStoryboardCompleted: function(sender, e)
	{
		/// <summary>Handles the event fired when an album button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.isAlbumView = this.slideTransform.y != 0;
		this.isSlidingIn = false;
		this.isSlidingOut = false;
		this.onAlbumViewChanged();
	},
	
	onAlbumViewChanged: function()
	{
		this.albumViewer.root.visibility = this.isAlbumView ? "Visible" : "Collapsed";
		this.enableFade = !this.isAlbumView;
		
		if (this.enableFade && this.options.enableFadeAnimation)
			window.setTimeout(SlideShow.createDelegate(this, this.fadeOut), this.options.initialFadeTimout);
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		SlideShow.NavigationTray.base.onSizeChanged.call(this);
		
		this.root["Canvas.Top"] = this.root.height - this.options.alwaysVisibleHeight;
		
		if (this.isAlbumView || this.isSlidingIn)
		{
			this.isAlbumView = true;
			this.isSlidingIn = false;
			this.isSlidingOut = false;
			this.slideStoryboard.stop();
			this.slideTransform.y = -this.root["Canvas.Top"];
			this.onAlbumViewChanged();
		}
		else if (this.isSlidingOut)
		{
			this.isAlbumView = false;
			this.isSlidingIn = false;
			this.isSlidingOut = false;
			this.slideStoryboard.stop();
			this.slideTransform.y = 0;
			this.onAlbumViewChanged();
		}
	}
});