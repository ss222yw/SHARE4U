// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.WipeTransition
 *******************************************/
SlideShow.WipeTransition = function(control, options)
{
	/// <summary>A transition which wipes a new image over the current one.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the transition.</param>
	
	SlideShow.WipeTransition.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		direction: "Left",
		duration: 0.8
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.Transition, SlideShow.WipeTransition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		SlideShow.WipeTransition.base.begin.call(this, fromImage, toImage);
		
		var fromClippingPathTo, toClippingPathTop, toClippingPathLeft, toClippingPathFrom, targetProperty;
		
		switch (this.options.direction.toLowerCase())
		{
			case "left":
				fromClippingPathTo = -fromImage.parent.root.width;
				toClippingPathTop = 0;
				toClippingPathLeft = toImage.parent.root.width;
				toClippingPathFrom = toImage.parent.root.width;
				targetProperty = "X";
				break;
			
			case "right":
				fromClippingPathTo = fromImage.parent.root.width;
				toClippingPathTop = 0;
				toClippingPathLeft = -toImage.parent.root.width;
				toClippingPathFrom = -toImage.parent.root.width;
				targetProperty = "X";
				break;
			
			case "up":
				fromClippingPathTo = -fromImage.parent.root.height;
				toClippingPathTop = toImage.parent.root.height;
				toClippingPathLeft = 0;
				toClippingPathFrom = toImage.parent.root.height;
				targetProperty = "Y";
				break;
			
			case "down":
				fromClippingPathTo = fromImage.parent.root.height;
				toClippingPathTop = -toImage.parent.root.height;
				toClippingPathLeft = 0;
				toClippingPathFrom = -toImage.parent.root.height;
				targetProperty = "Y";
				break;
			
			default:
				throw new Error("Invalid direction: " + this.options.direction);
		}
		
		// from image
		var fromGeometryXaml =
			'<RectangleGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Rect="0,0,' + fromImage.parent.root.width + "," + fromImage.parent.root.height + '">' +
			'	<RectangleGeometry.Transform>' +
			'		<TranslateTransform x:Name="VisibleTransform" X="0" Y="0" />' +
			'	</RectangleGeometry.Transform>' +
			'</RectangleGeometry>';
		
		fromImage.root.clip = this.createClippingPath(fromGeometryXaml);
		fromImage.root.visibility = "Visible";
				
		// to image
		var toGeometryXaml =
			'<RectangleGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Rect="0,0,' + toImage.parent.root.width + "," + toImage.parent.root.height + '">' +
			'	<RectangleGeometry.Transform>' +
			'		<TranslateTransform x:Name="VisibleTransform" X="' + toClippingPathLeft + '" Y="' + toClippingPathTop + '" />' +
			'	</RectangleGeometry.Transform>' +
			'</RectangleGeometry>';
		
		toImage.root.clip = this.createClippingPath(toGeometryXaml);
		toImage.root.visibility = "Visible";
		
		fromImage.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
		toImage.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
		
		// out storyboard
		var outAnimationXaml =
			'<DoubleAnimationUsingKeyFrames>' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,0" KeyTime="0:0:0" Value="0" />' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="' + fromClippingPathTo + '" />' +
			'</DoubleAnimationUsingKeyFrames> ';
		
		this.outStoryboard = this.addStoryboard(fromImage, "VisibleTransform", targetProperty, outAnimationXaml);
		this.outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		this.outStoryboard.begin();
		
		// in storyboard
		var inAnimationXaml =
			'<DoubleAnimationUsingKeyFrames>' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,0" KeyTime="0:0:0" Value="' + toClippingPathFrom + '" />' +
			'	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="0" />' +
			'</DoubleAnimationUsingKeyFrames> ';
		
		this.inStoryboard = this.addStoryboard(toImage, "VisibleTransform", targetProperty, inAnimationXaml);
		this.inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		this.inStoryboard.begin();
	},
	
	onSlideImageSizeChanged: function(sender)
	{
		/// <summary>Handles the event fired when the slide image control is resized.</summary>
		/// <summary>Handles the event fired when the control is resized.</summary>

		if (this.state = "Started")
		{
			this.outStoryboard.seek('0:0:' + this.options.duration);
			this.inStoryboard.seek('0:0:' + this.options.duration);
			SlideShow.WipeTransition.base.complete.call(this);
		}

		var clipGeometry = sender.root.clip.children.getItem(0);
		clipGeometry.rect = '0,0,' + sender.parent.root.width + ',' + sender.parent.root.height;
	}
});