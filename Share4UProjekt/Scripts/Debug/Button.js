// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="SlideShow.js" />

/*******************************************
 * class: SlideShow.Button
 *******************************************/
SlideShow.Button = function(control, parent, xaml)
{
	/// <summary>Provides a base class for button controls.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="xaml">The XAML for the button.</param>
	
	SlideShow.Button.base.constructor.call(this, control, parent, xaml);
	
	SlideShow.merge(this.options,
	{
		width: 22,
		height: 20,
		cursor: "Hand"
	});
	
	this.state = "Default";
	
	this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
	this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave));
	this.root.addEventListener("MouseLeftButtonDown", SlideShow.createDelegate(this, this.onMouseDown));
	this.root.addEventListener("MouseLeftButtonUp", SlideShow.createDelegate(this, this.onMouseUp));	
};

SlideShow.extend(SlideShow.UserControl, SlideShow.Button,
{
	render: function()
	{
		/// <summary>Renders the button using the current options.</summary>
		
		SlideShow.Button.base.render.call(this);
		
		this.root.cursor = this.options.cursor;
	},
	
	setState: function(state)
	{
		/// <summary>Sets the state of the button.</summary>
		/// <param name="state">The new state.</param>
		
		this.state = state;
		
		switch (state)
		{
			case "Disabled":
				this.root.cursor = "Default";
				break;	
			
			default:	
				this.root.cursor = this.options.cursor;
				break;
		}
	},
	
	enable: function()
	{
		/// <summary>Enables the button.</summary>
		
		if (this.state == "Disabled")
			this.setState("Default");
	},
	
	disable: function()
	{
		/// <summary>Disables the button.</summary>
		
		if (this.state != "Disabled")
			this.setState("Disabled");
	},
	
	onMouseEnter: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse enters the button.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.state != "Disabled")
			this.setState((this.state.indexOf("Active") > -1) ? "ActiveHover" : "Hover");
	},
	
	onMouseLeave: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse leaves the button.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.state != "Disabled")
			this.setState((this.state.indexOf("Active") > -1) ? "ActiveUnhover" : "Unhover");
	},
	
	onMouseDown: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse button is pressed.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.state != "Disabled")
		{
			this.setState((this.state.indexOf("Hover") > -1) ? "ActiveHover" : "Default");
			sender.captureMouse();
		}
	},
	
	onMouseUp: function(sender, e)
	{
		/// <summary>Handles the event fired when the mouse button is released.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		if (this.state != "Disabled")
		{
			var isClick = (this.state == "ActiveHover");
			this.setState((this.state.indexOf("Hover") > -1) ? "InactiveHover" : "Default");
			sender.releaseMouseCapture();
			
			if (isClick)
				this.onClick(e);
		}
	},
	
	onClick: function(e)
	{
		/// <summary>Handles the event fired when the button is clicked.</summary>
		/// <param name="e">The event arguments.</param>
		
		if (this.state != "Disabled")
			this.fireEvent("click", e);
	}
});