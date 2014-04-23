// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.SlideShowNavigation
 *******************************************/
SlideShow.SlideShowNavigation = function(control, parent, options)
{
	/// <summary>Provides basic slideshow navigation.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="options">The options for this control.</param>
	
	var xaml =
		'<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideShowNavigation" Visibility="Collapsed">' +
		'	<Rectangle x:Name="Background">' +
		'		<Rectangle.Fill>' +
		'			<LinearGradientBrush StartPoint="0.477254,1.16548" EndPoint="0.477254,0.0426189">' +
		'				<LinearGradientBrush.GradientStops>' +
		'					<GradientStop x:Name="BackgroundColor1" Offset="0.232877" />' +
		'					<GradientStop x:Name="BackgroundColor2" Offset="0.987288" />' +
		'				</LinearGradientBrush.GradientStops>' +
		'			</LinearGradientBrush>' +
		'		</Rectangle.Fill>' +
		'	</Rectangle>' +
		'</Canvas>';
	
	SlideShow.SlideShowNavigation.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		width: 66,
		height: 20,
		radius: 2,
		stroke: "#7FF19B77",
		strokeThickness: 1,
		backgroundColor1: "#7F2D12",
		backgroundColor2: "#E9A16B",
		playTimerInterval: 3000,
		enablePlayOnLoad: true,
		loopAlbum: false,
		playButton:
		{
			left: "50%",
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M 100.048,736.889L 98.5482,736.889C 97.9959,736.889 97.5482,736.441 97.5482,735.889L 97.5482,727.889C 97.5482,727.337 97.9959,726.889 98.5482,726.889L 100.048,726.889C 100.6,726.889 101.048,727.337 101.048,727.889L 101.048,735.889C 101.048,736.441 100.6,736.889 100.048,736.889 Z M 106.922,736.889L 105.422,736.889C 104.87,736.889 104.422,736.441 104.422,735.889L 104.422,727.889C 104.422,727.337 104.87,726.889 105.422,726.889L 106.922,726.889C 107.475,726.889 107.922,727.337 107.922,727.889L 107.922,735.889C 107.922,736.441 107.475,736.889 106.922,736.889 Z",
			pathWidth: 10,
			pathHeight: 12,
			pathStretch: "Fill",
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		},
		previousButton:
		{
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "F1 M6.0000005,1.473075E-06 L6.0000005,10.000002 5.9604696E-07,5.0000014 6.0000005,1.473075E-06 z M-1.3709068E-06,4.0019114E-07 L-1.3709068E-06,10.000006 -6.0000029,5.0000029 -1.3709068E-06,4.0019114E-07 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		},
		nextButton:
		{
			right: 0,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "F1 M-5.9999976,1.0552602E-05 L-1.9073478E-06,4.9999938 -1.9073478E-06,1.8062785E-05 5.9999981,5.0000033 -1.9073478E-06,10.000018 -1.9073478E-06,5.0000024 -5.9999976,9.9999857 -5.9999976,1.0552602E-05 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		}
	});
	
	this.setOptions(options);
	
	if (!this.options.enablePlayOnLoad)
		this.options.playButton.pathData = "F1 M 101.447,284.834L 101.447,274.714L 106.906,279.774L 101.447,284.834 Z";
	
	this.playButton = new SlideShow.PathButton(this.control, this, this.options.playButton);
	
	if (this.options.enablePreviousSlide)
	{
		this.previousButton = new SlideShow.PathButton(this.control, this, this.options.previousButton);
		this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick));
	}
	
	if (this.options.enableNextSlide)
	{
		this.nextButton = new SlideShow.PathButton(this.control, this, this.options.nextButton);
		this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick));
	}
	
	this.mode = "Pause";
	this.background = this.root.findName("Background");
	this.backgroundColor1 = this.root.findName("BackgroundColor1");
	this.backgroundColor2 = this.root.findName("BackgroundColor2");
	
	this.playButton.addEventListener("click", SlideShow.createDelegate(this, this.onPlayClick));
	this.control.root.addEventListener("KeyUp", SlideShow.createDelegate(this, this.onControlKeyPressed));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));	
};

SlideShow.extend(SlideShow.SlideNavigation, SlideShow.SlideShowNavigation,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>

		SlideShow.SlideShowNavigation.base.render.call(this);
		
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.backgroundColor1.color = this.options.backgroundColor1;
		this.backgroundColor2.color = this.options.backgroundColor2;
	},
	
	play: function()
	{
		/// <summary>Plays the slideshow.</summary>
		
		if (this.mode != "Play")
		{
			this.mode = "Play";
			this.startPlayTimer();
			this.playButton.setPath("M 100.048,736.889L 98.5482,736.889C 97.9959,736.889 97.5482,736.441 97.5482,735.889L 97.5482,727.889C 97.5482,727.337 97.9959,726.889 98.5482,726.889L 100.048,726.889C 100.6,726.889 101.048,727.337 101.048,727.889L 101.048,735.889C 101.048,736.441 100.6,736.889 100.048,736.889 Z M 106.922,736.889L 105.422,736.889C 104.87,736.889 104.422,736.441 104.422,735.889L 104.422,727.889C 104.422,727.337 104.87,726.889 105.422,726.889L 106.922,726.889C 107.475,726.889 107.922,727.337 107.922,727.889L 107.922,735.889C 107.922,736.441 107.475,736.889 106.922,736.889 Z", 12); // FIXME: 12?
		}
	},
	
	pause: function()
	{
		/// <summary>Pauses the slideshow.</summary>
		
		if (this.mode != "Pause")
		{
			this.mode = "Pause";
			this.stopPlayTimer();
			this.playButton.setPath("F1 M 101.447,284.834L 101.447,274.714L 106.906,279.774L 101.447,284.834 Z");
		}
	},
	
	togglePlayMode: function()
	{
		/// <summary>Toggles the slideshow between play and pause mode.</summary>
	
		if (this.mode == "Pause")
			this.play();
		else
			this.pause();
	},
	
	startPlayTimer: function()
	{
		/// <summary>Starts the play timer.</summary>
		
		if (!this.playTimerId)
			this.playTimerId = window.setTimeout(SlideShow.createDelegate(this, this.showNextSlide), this.options.playTimerInterval);
	},
	
	stopPlayTimer: function()
	{
		/// <summary>Stops the play timer.</summary>
		
		if (this.playTimerId)
		{
			window.clearTimeout(this.playTimerId);
			this.playTimerId = null;
		}
	},
	
	onPreviousClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the previous button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showPreviousSlide();
		this.fireEvent("previousClick");
	},
	
	onPlayClick: function(sender, e)
	{
		/// <summary>Handles the event fired when the play button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.togglePlayMode();
		this.fireEvent("playClick");
	},
	
	onNextClick: function(sender, e) 
	{
		/// <summary>Handles the event fired when the next button is clicked.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.showNextSlide();
		this.fireEvent("nextClick");
	},
	
	onControlModulesLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all modules have loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.SlideShowNavigation.base.onControlModulesLoad.call(this, sender, e);
		this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));
		this.slideViewer.addEventListener("slideChange", SlideShow.createDelegate(this, this.onSlideChange));
	},
	
	onControlDataLoad: function(sender, e)
	{
		/// <summary>Completes initialization after all data has loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>

		if (this.options.enablePlayOnLoad)
			this.play();

		this.slideViewer.loadImageByOffset(0, this.options.enableTransitionOnNext);
	},
	
	onSlideLoading: function(sender, e)
	{
		/// <summary>Handles the event fired when the next slide is loading. Resets the play timeout while the next slide downloads.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.mode == "Play")
			this.stopPlayTimer();
		
		if (this.options.enablePreviousSlide)
		{
			if (this.slideExistsByOffset(-1))
				this.previousButton.enable();
			else
				this.previousButton.disable();
		}

		if (this.options.enableNextSlide)
		{
			if (this.slideExistsByOffset(1))
				this.nextButton.enable();
			else
				this.nextButton.disable();
		}
		
		if (this.slideExistsByOffset(1))
		{
			this.playButton.enable();
		}
		else
		{
			this.pause();
			this.playButton.disable();
		}
	},
	
	onSlideChange: function(sender, e) 
	{
		/// <summary>Handles the event fired when the current slide changes.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.mode == "Play")
			this.startPlayTimer();
	},
	
	onControlKeyPressed: function(sender, e)	
	{
		/// <summary>Handles the event fired when a key is pressed.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		switch (e.key)
		{
			case 9:
				this.togglePlayMode();
				break;
				
			case 14:
				this.showPreviousSlide();
				break;
				
			case 16:
				this.showNextSlide();
				break;
		}
	}
});