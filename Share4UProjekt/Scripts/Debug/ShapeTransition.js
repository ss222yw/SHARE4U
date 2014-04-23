// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.ShapeTransition
 *******************************************/
SlideShow.ShapeTransition = function(control, options)
{
	/// <summary>A transition which cuts to a new image from the current one using a shape.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="options">The options for the transition.</param>
	
	SlideShow.ShapeTransition.base.constructor.call(this, control);
	
	SlideShow.merge(this.options,
	{
		shape: "Circle",
		direction: "Out",
		duration: 0.8
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.Transition, SlideShow.ShapeTransition,
{
	begin: function(fromImage, toImage)
	{
		/// <summary>Begins the transition between the specified images.</summary>
		/// <param name="fromImage">The initial image.</param>
		/// <param name="toImage">The final image.</param>
		
		SlideShow.ShapeTransition.base.begin.call(this, fromImage, toImage);
		
		switch (this.options.shape.toLowerCase())
		{
			case "circle":
				var direction = this.options.direction.toLowerCase();
				
				if (direction != "out" && direction != "in")
					throw new Error("Invalid direction: " + direction);
				
				var maxSize = Math.max(this.control.root.width, this.control.root.height);
				var clipFrom = (direction == "out") ? 0 : maxSize;
				var clipTo = (direction == "out") ? maxSize : 0;
				
				var simpleXaml = '<EllipseGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="CircleBehaviorPath" Center="' + (this.control.root.width / 2) + ',' + (this.control.root.height / 2) + '" RadiusX="' + clipFrom + '" RadiusY="' + clipFrom + '" />';
				var complexXaml = simpleXaml + '<RectangleGeometry Rect="0,0,' + this.control.root.width + ',' + this.control.root.height + '" />';
				
				if (direction == "out")
				{
					fromImage.root.clip = this.createClippingPath(complexXaml);
					toImage.root.clip = this.createClippingPath(simpleXaml);
				}
				else
				{
					fromImage.root.clip = this.createClippingPath(simpleXaml);
					toImage.root.clip = this.createClippingPath(complexXaml);
				}
				
				fromImage.root.visibility = "Visible";
				toImage.root.visibility = "Visible";
				
				fromImage.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
				toImage.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
				
				// out storyboard
				var animationXaml =
					'<DoubleAnimation Storyboard.TargetProperty="RadiusX" Duration="0:0:' + this.options.duration + '" To="' + clipTo + '" />' +
					'<DoubleAnimation Storyboard.TargetProperty="RadiusY" Duration="0:0:' + this.options.duration + '" To="' + clipTo + '" />';
				
				this.outStoryboard = this.addStoryboard(fromImage, "CircleBehaviorPath", "RadiusX", animationXaml);
				this.outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
				this.outStoryboard.begin();
				
				// in storyboard
				this.inStoryboard = this.addStoryboard(toImage, "CircleBehaviorPath", "RadiusX", animationXaml);
				this.inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
				this.inStoryboard.begin();
				
				break;

			default:
				throw new Error("Invalid shape: " + this.options.shape.toLowerCase());
		}
	},

	onSlideImageSizeChanged: function(sender)
	{
		/// <summary>Handles the event fired when the slide image control is resized.</summary>

		if (this.state = "Started")
		{
			this.outStoryboard.stop();
			this.inStoryboard.stop();
			SlideShow.ShapeTransition.base.complete.call(this);
		}

		var clipGeometry = sender.root.clip.children.getItem(0);
		var maxSize = Math.max(this.control.root.width, this.control.root.height);
		var center = (sender.parent.root.width / 2) + ',' + (sender.parent.root.height / 2);
		clipGeometry.center = center;
		clipGeometry.radiusX = maxSize;
		clipGeometry.radiusY = maxSize;
	}
});