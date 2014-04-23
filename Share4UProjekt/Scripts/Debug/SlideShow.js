// Slide.Show, version 1.2
// This source is provided under the Microsoft Public License (Ms-PL)
// available at http://www.codeplex.com/SlideShow/license.
// Copyright © 2008 Vertigo Software, Inc. All rights reserved.

/// <reference path="Silverlight.js" />

/*******************************************
 * namespace: SlideShow
 *******************************************/
if (!window.SlideShow)
	window.SlideShow = {};

/*******************************************
 * function: SlideShow.createDelegate
 *******************************************/
SlideShow.createDelegate = function(instance, method)
{
	/// <summary>Creates a delegate function that executes the specified method in the correct context.</summary>
	/// <param name="instance">The instance whose method should be executed.</param>
	/// <param name="method">The method to execute.</param>
	/// <returns>The delegate function.</returns>
	
	return function()
	{
		return method.apply(instance, arguments);
	};
};

/*******************************************
 * function: SlideShow.merge
 *******************************************/
SlideShow.merge = function(destination, source, preventNew)
{
	/// <summary>Merges properties from a source object into a destination object.</summary>
	/// <param name="destination">The destination object.</param>
	/// <param name="source">The source object.</param>
	/// <param name="preventNew">Indicates whether or not new properties are prevented from being added to the destination object.</param>
	
	var root = destination;
	
	for (var i in source)
	{
		var s = source[i], d;
		var properties = i.split(".");
		var count = properties.length;
		
		for (var j = 0; j < count; j++)
		{
			i = properties[j];
			d = destination[i];
			
			if (d)
			{
				if (typeof(d) == "object")
					destination = d;
			}
			else if (j > 0 && j < count - 1)
			{
				var obj = {};
				obj[properties.slice(j, count).join(".")] = s;
				s = obj;
				break;
			}
		}
		
		if (d && typeof(d) == "object" && typeof(s) == "object")
			this.merge(d, s, false);
		else if (preventNew && count <= 1 && typeof(d) == "undefined")
			throw new Error("Undefined property: " + i);
		else
			destination[i] = s;
		
		destination = root;
	}
};

/*******************************************
 * function: SlideShow.extend
 *******************************************/
SlideShow.extend = function(baseClass, derivedClass, derivedMembers)
{
	/// <summary>Provides support for class inheritance.</summary>
	/// <param name="baseClass">The base class.</param>
	/// <param name="derivedClass">The derived class.</param>
	/// <param name="derivedMembers">The members to add to the derived class and override in the base class.</param>
	
	var F = function() {};
	F.prototype = baseClass.prototype;
	derivedClass.prototype = new F();
	derivedClass.prototype.constructor = derivedClass;
	derivedClass.base = baseClass.prototype;
	
	if (baseClass.prototype.constructor == Object.prototype.constructor)
		baseClass.prototype.constructor = baseClass;
	
	// Note: IE will not enumerate derived members that exist in the Object
	// prototype (e.g. toString, valueOf). If overriding these members
	// is necessary, search for "_IEEnumFix" for one possible solution.
	if (derivedMembers)
		for (var i in derivedMembers)
			derivedClass.prototype[i] = derivedMembers[i];
};

/*******************************************
 * function: SlideShow.parseBoolean
 *******************************************/
SlideShow.parseBoolean = function(value)
{
	/// <summary>Parses a boolean from the specified value.</summary>
	/// <param name="value">The value to parse.</param>
	/// <returns>True if the specified value is parsed as true.</returns>
	
	return (typeof(value) == "string") ? (value.toLowerCase() == "true") : Boolean(value);
};

/*******************************************
 * function: SlideShow.formatString
 *******************************************/
SlideShow.formatString = function(value)
{
	/// <summary>Formats a string.</summary>
	/// <param name="value">The string to format.</param>
	/// <returns>The formatted string.</returns>
	
	for(i = 1, j = arguments.length; i < j; i++)
		value = value.replace("{" + (i - 1) + "}", arguments[i]);
	
	return value;
};

/*******************************************
 * function: SlideShow.getUniqueId
 *******************************************/
SlideShow.getUniqueId = function(prefix)
{
	/// <summary>Gets a random unique identifier.</summary>
	/// <param name="prefix">The prefix to prepend to the generated identifier.</param>
	/// <returns>The unique identifier.</returns>
	
	return prefix + Math.random().toString().substring(2);
};

/*******************************************
 * function: SlideShow.addTextToBlock
 *******************************************/
SlideShow.addTextToBlock = function(textBlock, text)
{
	/// <summary>Sets the text in the specified block, truncating it to fit if necessary.</summary>
	/// <param name="textBlock">The element to modify.</param>
	/// <param name="text">The text to set.</param>
	
	if (text)
	{
		text = text.toString();
		textBlock.text = text;
		
		var width = textBlock.width;
		var height = textBlock.height;
		
		try
		{
			if (textBlock.actualWidth <= width && textBlock.actualHeight <= height)
				return;
			
			var min = 0;
			var max = text.length;
			var nonWordChars = /\W*$/;
			var ellipsis = "\u2026";
			
			// binary search
			while (true)
			{
				var mid = Math.floor((max + min) / 2);
				textBlock.text = text.substring(0, mid).replace(nonWordChars, ellipsis);
				
				if (mid == min)
					break;
				
				if (textBlock.actualWidth > width || textBlock.actualHeight > height)
					max = mid;
				else
					min = mid;
			}
			
			// clear if text still doesn't fit
			if (textBlock.actualWidth > width || textBlock.actualHeight > height)
				textBlock.text = null;
		}
		catch (error)
		{
			// ignore if textBlock.actualWidth can't be evaluated
		}
	}
	else
	{
		textBlock.text = null;
	}
};

/*******************************************
 * class: SlideShow.Object
 *******************************************/
SlideShow.Object = function()
{
	/// <summary>Provides a common base class with support for options and events.</summary>
	
	this.options = {};
	this.eventHandlers = {};
};

SlideShow.Object.prototype = 
{
	setOptions: function(options)
	{
		/// <summary>Merges the specified options with existing options.</summary>
		/// <param name="options">The options to merge.</param>
		
		SlideShow.merge(this.options, options, true);
	},
	
	addEventListener: function(name, handler)
	{
		/// <summary>Adds an event handler to the list of handlers to be called when the specified event is fired.</summary>
		/// <param name="name">The event name.</param>
		/// <param name="handler">The event handler to add.</param>
		/// <returns>The identifying token (i.e. index) for the added event handler.</return>
		
		var handlers = this.eventHandlers[name];
		
		if (!handlers)
			this.eventHandlers[name] = handlers = [];
		
		// regarding token, see http://msdn2.microsoft.com/en-us/library/bb232863.aspx
		var token = handlers.length;
		handlers[token] = handler;
		return token;
	},
	
	removeEventListener: function(name, handlerOrToken)
	{
		/// <summary>Removes the first matching event handler from the list of handlers to be called when the specified event is fired.</summary>
		/// <param name="name">The event name.</param>
		/// <param name="handlerOrToken">The event handler or indentifying token to remove.</param>
		
		if (typeof(handlerOrToken) == "function")
		{
			var handlers = this.eventHandlers[name];
			
			if (handlers)
			{
				for (var i = 0, j = handlers.length; i < j; i++)
					if (handlers[i] == handlerOrToken)
						break;
				
				handlers.splice(i, 1);
			}
		}
		else
		{
			handlers.splice(handlerOrToken, 1);
		}
	},
	
	fireEvent: function(name, e)
	{
		/// <summary>Fires the specified event and calls each listening handler.</summary>
		/// <param name="name">The name of the event to fire.</param>
		/// <param name="e">The event arguments to pass to each handler.</param>
		
		var handlers = this.eventHandlers[name];
		
		if (handlers)
			for (var i = 0, j = handlers.length; i < j; i++)
				handlers[i](this, e);			
	},
	
	dispose: function()
	{
		/// <summary>Releases the object from memory.</summary>
		
		this.options = null;
		this.eventHandlers = null;
	}
};

/*******************************************
 * class: SlideShow.JsonParser
 *******************************************/
SlideShow.JsonParser = function(options)
{
	/// <summary>Provides support for JSON parsing.</summary>
	/// <param name="options">The options for the parser.</param>

	SlideShow.JsonParser.base.constructor.call(this);
	
	SlideShow.merge(this.options,
	{
		arrays: null
	});
	
	this.setOptions(options);
	
	this.initializeForcedArrays();
};

SlideShow.extend(SlideShow.Object, SlideShow.JsonParser,
{
	initializeForcedArrays: function()
	{
		/// <summary>Converts the "arrays" option into a hash for lookups.</summary>
		
		this.forcedArrays = {};
		
		if (this.options.arrays)
		{
			var items = this.options.arrays.split(",");
			
			for (var i = 0, j = items.length; i < j; i++)
				this.forcedArrays[items[i]] = true;
		}
	},
	
	fromFeed: function(url, callback)
	{
		/// <summary>Adds an external script tag that references the specified JSON feed which calls the specified callback function.</summary>
		/// <param name="url">The location of the feed.</param>
		/// <param name="callback">The name of the callback function.</param>
		
		window[callback] = SlideShow.createDelegate(this, this.onFeedCallback);
		var scriptId = SlideShow.getUniqueId("SlideShow_Script_");
		SlideShow.ScriptManager.addExternalScript(scriptId, "text/javascript", url);
	},
	
	onFeedCallback: function(obj)
	{
		/// <summary>Handles the callback from a JSON feed and fires the "callback" event.</summary>
		/// <param name="obj">The returned JSON object.</param>
		
		this.fireEvent("callback", obj);
	},	
	
	fromXml: function(url, async)
	{
		/// <summary>Parses a JSON object from the specified XML file and fires the "parseComplete" event.</summary>
		/// <param name="url">The location of the file to parse.</param>
		/// <param name="async">Specifies whether or not to parse the XML asynchronously.</param>
		
		var request;
		
		if (window.XMLHttpRequest)
			request = new window.XMLHttpRequest();
		else if (window.ActiveXObject)
			request = new window.ActiveXObject("Microsoft.XMLHTTP");
		else
			throw new Error("XML parsing failed: Unsupported browser");
		
		var handleReadyStateChange = function()
		{
			if (request.readyState == 4) 
			{
				if (request.status == 200)
				{
					var document = request.responseXML;
					var obj = this.parseXmlDocument(document);
					this.fireEvent("parseComplete", obj);
				}
				else
				{
					throw new Error("XML parsing failed: " + request.statusText);
				}
			}
		};
		
		if (async)
		{
			request.onreadystatechange = SlideShow.createDelegate(this, handleReadyStateChange);
			request.open("GET", url, true);
			request.send(null);
		}
		else
		{
			request.open("GET", url, false);
			request.send(null);
			handleReadyStateChange.apply(this);
		}
	},
	
	parseXmlDocument: function(document)
	{
		/// <summary>Parses a JSON object from the specified XML document.</summary>
		/// <param name="document">The document to parse.</param>
		/// <returns>The parsed object.</returns>
		
		var element = document.documentElement;
		
		if (!element)
			return;
		
		var elementName = element.nodeName;
		var elementType = element.nodeType;
		var elementValue = this.parseXmlNode(element);
		
		if (this.forcedArrays[elementName])
			elementValue = [ elementValue ];
		
		// document fragment
		if (elementType == 11)
			return elementValue;
		
		var obj = {};
		obj[elementName] = elementValue;
		return obj;
	},
	
	parseXmlNode: function(node)
	{
		/// <summary>Recursively parses a JSON object from the specified XML node.</summary>
		/// <param name="element">The node to parse.</param>
		/// <returns>The parsed object.</returns>
		
		switch (node.nodeType)
		{
			// comment
			case 8:
				return;
			
			// text and cdata
			case 3:
			case 4:
			
				var nodeValue = node.nodeValue;
				
				if (!nodeValue.match(/\S/))
					return;
				
				return this.formatValue(nodeValue);
			
			default:
				
				var obj;
				var counter = {};
				var attributes = node.attributes;
				var childNodes = node.childNodes;
				
				if (attributes && attributes.length)
				{
					obj = {};
					
					for (var i = 0, j = attributes.length; i < j; i++)
					{
						var attribute = attributes[i];
						var attributeName = attribute.nodeName.toLowerCase(); // lowered in order to be consistent with Safari
						var attributeValue = attribute.nodeValue;
						
						if (typeof(counter[attributeName]) == "undefined")
							counter[attributeName] = 0;
						
						this.addProperty(obj, attributeName, this.formatValue(attributeValue), ++counter[attributeName]);
					}
				}
				
				if (childNodes && childNodes.length)
				{
					var textOnly = true;
					
					if (obj)
						textOnly = false;
					
					for (var k = 0, l = childNodes.length; k < l && textOnly; k++)
					{
						var childNodeType = childNodes[k].nodeType;
						
						// text or cdata
						if (childNodeType == 3 || childNodeType == 4)
							continue;
						
						textOnly = false;
					}
					
					if (textOnly)
					{
						if (!obj)
							obj = "";
					
						for (var m = 0, n = childNodes.length; m < n; m++)
							obj += this.formatValue(childNodes[m].nodeValue);
					}
					else
					{
						if (!obj)
							obj = {};
						
						for (var o = 0, p = childNodes.length; o < p; o++)
						{
							var childNode = childNodes[o];
							var childName = childNode.nodeName;
							
							if (typeof(childName) != "string")
								continue;
							
							var childValue = this.parseXmlNode(childNode);
							
							if (!childValue)
								continue;
							
							if (typeof(counter[childName]) == "undefined")
								counter[childName] = 0;
							
							this.addProperty(obj, childName, this.formatValue(childValue), ++counter[childName]);
						}
					}
				}
				
				return obj;
		}
	},
	
	formatValue: function(value)
	{
		/// <summary>Formats the specified value to its most suitable type.</summary>
		/// <param name="value">The value to format.</param>
		/// <returns>The formatted value or the original value if no more suitable type exists.</returns>
		
		if (typeof(value) == "string" && value.length > 0)
		{
			var loweredValue = value.toLowerCase();
			
			if (loweredValue == "true")
				return true;
			else if (loweredValue == "false")
				return false;
			
			if (!isNaN(value))
				return new Number(value).valueOf(); // fixes number issue with option values
		}
		
		return value;
	},
	
	addProperty: function(obj, name, value, count)
	{
		/// <summary>Adds a property to the specified object.</summary>
		/// <param name="obj">The target object.</param>
		/// <param name="name">The name of the property.</param>
		/// <param name="value">The value of the property.</param>
		/// <param name="count">A count that indicates whether or not the property should be an array.</param>
		
		if (this.forcedArrays[name])
		{
			if (count == 1)
				obj[name] = [];
			
			obj[name][obj[name].length] = value;
		}
		else
		{
			switch (count)
			{
				case 1:
					obj[name] = value;
					break;
				
				case 2:
					obj[name] = [ obj[name], value ];
					break;
				
				default:
					obj[name][obj[name].length] = value;
					break;
			}
		}
	}	
});

/*******************************************
 * class: SlideShow.XmlConfigProvider
 *******************************************/
SlideShow.XmlConfigProvider = function(options)
{
	/// <summary>Provides configuration data to the Slide.Show control from an XML file.</summary>

	SlideShow.XmlConfigProvider.base.constructor.call(this);
	
	SlideShow.merge(this.options,
	{
		url: "Configuration.xml"
	});
	
	this.setOptions(options);
};

SlideShow.extend(SlideShow.Object, SlideShow.XmlConfigProvider,
{
	getConfig: function(configHandler)
	{
		/// <summary>Retrieves the configuration data synchronously and calls the specified event handler (with the data).</summary>
		/// <param name="configHandler">The event handler to be called after the configuration data is retrieved.</param>
		
		var parser = new SlideShow.JsonParser({ arrays: "module,option,script,transition" });
		parser.addEventListener("parseComplete", configHandler);
		parser.fromXml(this.options.url, false);
	}
});

/*******************************************
 * class: SlideShow.ScriptManager
 *******************************************/
SlideShow.ScriptManager = function()
{
	/// <summary>Provides support for loading scripts dynamically.</summary>
	
	SlideShow.ScriptManager.base.constructor.call(this);
	this.scripts = {};
	this.timeoutId = null;
};

SlideShow.extend(SlideShow.Object, SlideShow.ScriptManager,
{
	register: function(key, url, extendsClass)
	{
		/// <summary>Registers a script to be loaded.</summary>
		/// <param name="key">The unique key that identifies the script.</param>
		/// <param name="url">The location of the script.</param>
		
		if (this.scripts[key])
			throw new Error("Duplicate script: " + key);
		
		this.scripts[key] = { url: url, extendsClass: extendsClass, loaded: false };
	},
	
	load: function()
	{
		/// <summary>Loads the registered scripts.</summary>
		
		// timeout after 15 seconds
		this.timeoutId = window.setTimeout(SlideShow.createDelegate(this, this.onLoadTimeout), 15000);
		
		for (var key in this.scripts)
			this.loadScript(key);
		
		this.checkLoadStatus();
	},
	
	loadScript: function(key)
	{
		var script = this.scripts[key];

		if (script.extendsClass)
		{
			if (typeof (eval("SlideShow." + script.extendsClass)) == "undefined")
			{
				// wait for inherited class to load
				var context = this;
				window.setTimeout(function() { context.loadScript.call(context, key); }, 100);
				return;
			}
		}

		var id = "SlideShow_Script_" + key;
		SlideShow.ScriptManager.addExternalScript(id, "text/javascript", script.url);
	},
	
	checkLoadStatus: function()
	{
		/// <summary>Fires the "loadComplete" event when all registered scripts are loaded.</summary>
		
		// checks that all the lowest level classes have finished loading
		for (var key in this.scripts)
		{
			var script = this.scripts[key];
			
			if (!script.loaded)
			{
				if (typeof(eval("SlideShow." + key)) == "undefined")
				{
					window.setTimeout(SlideShow.createDelegate(this, this.checkLoadStatus), 100);
					return;
				}
				else
				{
					script.loaded = true;
				}
			}
		}
		
		if (this.timeoutId)
		{
			window.clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		
		this.fireEvent("loadComplete");
	},
	
	onLoadTimeout: function()
	{
		/// <summary>Handles the event fired when the registered scripts fail to load within the allowed time.</summary>
		
		this.timeoutId = null;
		throw new Error("Scripts failed to load in time");
	}
});

SlideShow.ScriptManager.addExternalScript = function(id, type, url)
{
	/// <summary>Adds an external script tag to the document head.</summary>
	/// <param name="id">The ID that uniquely identifies the script element.</param>
	/// <param name="type">The script type.</param>
	/// <param name="url">The script location.</param>
	
	if (!document.getElementById(id))
	{
		var element = document.createElement("script");
		element.id = id;
		element.type = "text/javascript";
		element.src = url;
		document.getElementsByTagName("head")[0].appendChild(element);
	}
};

SlideShow.ScriptManager.addInlineScript = function(id, type, text)
{
	/// <summary>Adds an inline script tag to the document head.</summary>
	/// <param name="id">The ID that uniquely identifies the script element.</param>
	/// <param name="type">The script type.</param>
	/// <param name="text">The script text.</param>
	
	if (!document.getElementById(id))
	{
		var element = document.createElement("script");
		element.id = id;
		element.type = type;
		element.text = text;
		
		try
		{
			// Safari workaround
			element.innerText = text;
		}
		catch (error)
		{
		}
		
		document.getElementsByTagName("head")[0].appendChild(element);
	}
};

/*******************************************
 * class: SlideShow.UserControl
 *******************************************/
SlideShow.UserControl = function(control, parent, xaml, options)
{
	/// <summary>Provides a base class for user controls.</summary>
	/// <param name="control">The Slide.Show control.</param>
	/// <param name="parent">The parent control.</param>
	/// <param name="xaml">The XAML for the control.</param>
	/// <param name="options">The options for the control.</param>
	
	SlideShow.UserControl.base.constructor.call(this);
	
	SlideShow.merge(this.options,
	{
		top: "Auto",
		left: "Auto",
		bottom: "Auto",
		right: "Auto",
		width: "Auto",
		height: "Auto",
		background: "Transparent",
		opacity: 1,
		visibility: "Visible",
		cursor: "Default"
	});
	
	this.setOptions(options);
	
	this.control = control;
	this.children = [];
	
	if (parent)
	{
		this.parent = parent;
		this.parent.children.push(this);
	}
	
	if (xaml)
		this.root = control.host.content.createFromXaml(xaml, true);
	
	if (this.parent && this.parent.root && this.root)
		this.parent.root.children.add(this.root);
};

SlideShow.extend(SlideShow.Object, SlideShow.UserControl,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		this.resize(this.options.width, this.options.height);
		this.reposition();
		
		this.root.background = this.options.background;
		this.root.opacity = this.options.opacity;
		this.root.visibility = this.options.visibility;
		this.root.cursor = this.options.cursor;
		
		for (var i = 0, j = this.children.length; i < j; i++)
			this.children[i].render();
	},
	
	resize: function(width, height)
	{
		/// <summary>Resizes the control.</summary>
		/// <param name="width">The width.</param>
		/// <param name="height">The height.</param>
		
		var auto = "Auto";
		var currentWidth = this.root.width;
		var currentHeight = this.root.height;
		
		this.root.width = (width != auto) ? Math.max(width, 0) : 0;
		this.root.height = (height != auto) ? Math.max(height, 0) : 0;
		
		if (currentWidth != this.root.width || currentHeight != this.root.height)
			this.onSizeChanged();
	},
	
	reposition: function()
	{
		/// <summary>Positions the control relative to the parent control.</summary>
		
		var auto = "Auto";
		var currentWidth = this.root.width;
		var currentHeight = this.root.height;
		
		this.root["Canvas.Top"] = (this.options.top != auto) ? this.getPosition("top", this.options.top) : 0;
		this.root["Canvas.Left"] = (this.options.left != auto) ? this.getPosition("left", this.options.left) : 0;
		
		if (this.options.bottom != auto && this.parent)
		{
			if (this.options.height != auto && this.options.top == auto)
				this.root["Canvas.Top"] = this.parent.root.height - this.root.height - this.getPosition("bottom", this.options.bottom);
			else if (this.options.height == auto && this.options.top != auto)
				this.root.height = Math.max(this.parent.root.height - this.root["Canvas.Top"] - this.getPosition("bottom", this.options.bottom), 0);
		}
		
		if (this.options.right != auto && this.parent)
		{
			if (this.options.width != auto && this.options.left == auto)
				this.root["Canvas.Left"] = this.parent.root.width - this.root.width - this.getPosition("right", this.options.right);
			else if (this.options.width == auto && this.options.left != auto)
				this.root.width = Math.max(this.parent.root.width - this.root["Canvas.Left"] - this.getPosition("right", this.options.right), 0);
		}
		
		if (currentWidth != this.root.width || currentHeight != this.root.height)
			this.onSizeChanged();
	},
	
	getPosition: function(name, value)
	{
		/// <summary>Gets the normalized position.</summary>
		/// <param name="name">The position direction (e.g. top, left, bottom, right).</param>
		/// <param name="value">The position value (e.g. -106, 50%).</param>
		/// <returns>The normalized position (in pixels).</returns>
		
		if (!isNaN(value))
			return value;
		
		// trim trailing "%"
		var percent = value.slice(0, value.length - 1) / 100;
		
		if (this.parent)
		{
			switch (name)
			{
				case "top": return this.parent.root.height * percent - this.root.height / 2;
				case "left": return this.parent.root.width * percent - this.root.width / 2;
				case "bottom": return (1 - this.parent.root.height * percent) - this.root.height / 2;
				case "right": return (1 - this.parent.root.width * percent) - this.root.width / 2;
				default: throw new Error("Invalid name: " + name);
			}
		}
	},
	
	dispose: function()
	{
		/// <summary>Releases the control from memory.</summary>
		
		SlideShow.UserControl.base.dispose.call(this);
		
		if (this.parent)
		{
			for (var i = 0, j = this.parent.children.length; i < j; i++)
				if (this.parent.children[i] == this)
					break;
			
			this.parent.children.splice(i, 1);
			this.parent.root.children.remove(this.root);
			this.parent = null;
		}
		
		this.control = null;
		this.children = null;
		this.root = null;
	},
	
	onSizeChanged: function()
	{
		/// <summary>Handles the event fired when the control is resized.</summary>
		
		for (var i = 0, j = this.children.length; i < j; i++)
			this.children[i].reposition();
	}
});

/*******************************************
 * class: SlideShow.Control
 *******************************************/
SlideShow.Control = function(options)
{
	/// <summary>Initializes and renders a Slide.Show control.</summary>
	/// <param name="options">The options for the control.</param>
	
	SlideShow.Control.base.constructor.call(this);
	
	SlideShow.merge(this.options,
	{
		id: null,
		width: 640,
		height: 480,
		background: "Black",
		windowless: false,
		framerate: 48,
		enableframeratecounter: false,
		enableredrawregions: false,
		enabletrace: false,
		installinplace: true,
		installunsupportedbrowsers: false,
		cssclass: "SlideShow",
		scripts: null,
		modules: null,
		transitions: null,
		dataProvider: null
	});
	
	if (options instanceof SlideShow.XmlConfigProvider)
	{
		var configProvider = options;
		configProvider.getConfig(SlideShow.createDelegate(this, this.onConfigLoad));
	}
	else
	{
		this.onConfigLoad(this, { configuration: options });
	}
};

SlideShow.extend(SlideShow.UserControl, SlideShow.Control,
{
	render: function()
	{
		/// <summary>Renders the control using the current options.</summary>
		
		if (this.options.enabletrace)
		{
			this.traceLog = this.host.content.createFromXaml('<TextBlock Canvas.Top="10" Canvas.Left="10" Canvas.ZIndex="999" Foreground="#66FFFFFF" FontSize="10" />');
			this.root.children.add(this.traceLog);
		}
		
		this.host.settings.enableFrameRateCounter = this.options.enableframeratecounter;
		this.host.settings.enableRedrawRegions = this.options.enableredrawregions;	
		
		this.resize(this.options.width, this.options.height);
		this.reposition();
		
		this.root.background = this.options.background;
		this.root.opacity = this.options.opacity;
		this.root.visibility = this.options.visibility;
		
		for (var i = 0, j = this.children.length; i < j; i++)
			this.children[i].render();
	},
	
	createObject: function()
	{
		/// <summary>Creates and adds the necessary DOM elements for the control.</summary>
		
		this.id = this.options.id || SlideShow.getUniqueId("SlideShow_");
		var sourceElementId = "SlideShow_Source";
		var parentElementId = this.id;
		var objectElementId = parentElementId + "_Object";
		
		// add the source element
		var xaml = '<Canvas xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="Control" Visibility="Collapsed" Cursor="Wait"></Canvas>';
		SlideShow.ScriptManager.addInlineScript(sourceElementId, "text/xaml", xaml);
		
		// add the parent element
		document.write('<div id="' + parentElementId + '" class="' + this.options.cssclass + '"></div>');
		
		// add the object element
		Silverlight.createObjectEx(
		{
			id: objectElementId,
			source: "#" + sourceElementId,
			parentElement: document.getElementById(parentElementId),
			properties:
			{
				width: String(this.options.width),
				height: String(this.options.height),
				background: this.options.background,
				isWindowless: String(this.options.windowless),
				framerate: String(this.options.framerate),
				inplaceInstallPrompt: SlideShow.parseBoolean(this.options.installinplace),
				ignoreBrowserVer: SlideShow.parseBoolean(this.options.installunsupportedbrowsers),
				version: "1.0"
			},
			events:
			{
				onLoad: SlideShow.createDelegate(this, this.onObjectLoad)
			}
		});
	},
	
	getTypeFromConfig: function(config)
	{
		/// <summary>Gets the type from the specified configuration.</summary>
		/// <param name="config">The configuration.</param>
		/// <returns>The evaluated type.</returns>
		
		var type = eval("SlideShow." + config.type);
		
		if (!type)
			throw new Error("Invalid type: " + config.type);
		
		return type;
	},
	
	getOptionsFromConfig: function(config)
	{
		/// <summary>Gets options (in hash format for lookups) from the specified configuration.</summary>
		/// <param name="config">The configuration.</param>
		/// <returns>The options hash.</returns>
		
		var options = {};
		
		if (config.option)
		{
			for (var i = 0, j = config.option.length; i < j; i++)
			{
				var name = config.option[i]["name"];
				var value = config.option[i]["value"];
				options[name] = value;
			}
		}
		
		return options;
	},
	
	createObjectInstanceFromConfig: function(config)
	{
		/// <summary>Creates an instance of the configured object.</summary>
		/// <param name="config">The configuration.</param>
		/// <returns>The instance.</returns>
		
		var type = this.getTypeFromConfig(config);
		var options = this.getOptionsFromConfig(config);
		return new type(this, options);
	},
	
	createModuleInstanceFromConfig: function(config)
	{
		/// <summary>Creates an instance of the configured module.</summary>
		/// <param name="config">The configuration.</param>
		/// <returns>The instance.</returns>
		
		var type = this.getTypeFromConfig(config);
		var options = this.getOptionsFromConfig(config);
		return new type(this, this, options);
	},
	
	loadScripts: function()
	{
		/// <summary>Loads the scripts configured for the control.</summary>
		
		if (this.options.scripts && this.options.scripts.script)
		{
			var manager = new SlideShow.ScriptManager();
			manager.addEventListener("loadComplete", SlideShow.createDelegate(this, this.onScriptsLoad));
			
			for (var i = 0, j = this.options.scripts.script.length; i < j; i++)
			{
				var script = this.options.scripts.script[i];
				manager.register(script.key, script.url, script.extendsclass);
			}
			
			manager.load();
		}
		else
		{
			this.onScriptsLoad(this);
		}
	},
	
	loadModules: function()
	{
		/// <summary>Loads the modules configured for the control.</summary>
		
		if (this.options.modules && this.options.modules.module)
		{
			var modules = {};
			
			for (var i = 0, j = this.options.modules.module.length; i < j; i++)
			{
				var config = this.options.modules.module[i];
				var module = modules[config.type] = this.createModuleInstanceFromConfig(config);
				module.render();
			}
			
			this.onModulesLoad(this, modules);
		}
	},
	
	loadData: function()
	{
		/// <summary>Loads the data configured for the control.</summary>
		
		if (this.options.dataProvider)
		{
			var provider = this.createObjectInstanceFromConfig(this.options.dataProvider);
			provider.getData(SlideShow.createDelegate(this, this.onDataLoad));
		}
		else
		{
			this.onLoad(this);
		}
	},
	
	isAlbumIndexValid: function(albumIndex)
	{
		/// <summary>Determines whether or not the specified album index is valid.</summary>
		/// <param name="albumIndex">The album index to check.</param>
		/// <returns>True if the album index is valid.</returns>
		
		return this.data && this.data.album && this.data.album[albumIndex];
	},
	
	isSlideIndexValid: function(albumIndex, slideIndex)
	{
		/// <summary>Determines whether or not the specified album and slide indexes are valid.</summary>
		/// <param name="albumIndex">The album index to check.</param>
		/// <param name="slideIndex">The slide index to check.</param>
		/// <returns>True if the indexes are valid.</returns>
		
		if (this.isAlbumIndexValid(albumIndex))
			return this.data.album[albumIndex].slide && this.data.album[albumIndex].slide[slideIndex];
		
		return false;
	},
	
	getSlideTransitionData: function(albumIndex, slideIndex)
	{
		/// <summary>Gets the transition data for a slide.</summary>
		/// <param name="albumIndex">The album index.</param>
		/// <param name="slideIndex">The slide index.</param>
		/// <returns>The transition data.</returns>
		
		var transitionName;
		
		if (!this.transitions)
			this.transitions = { notransition: { type: "NoTransition" } };
		
		if (this.isSlideIndexValid(albumIndex, slideIndex))
			transitionName = this.data.album[albumIndex].slide[slideIndex].transition;
		
		if (transitionName == null && this.isAlbumIndexValid(albumIndex))
			transitionName = this.data.album[albumIndex].transition;
		
		if (transitionName == null && this.data)
			transitionName = this.data.transition;
		
		if (transitionName == null)
			transitionName = "NoTransition";
		
		var key = transitionName.toLowerCase();
		var transition = this.transitions[key];
		
		if (!transition)
		{
			if (this.options.transitions && this.options.transitions.transition)
			{
				for (var i = 0, j = this.options.transitions.transition.length; i < j; i++)
				{
					if (this.options.transitions.transition[i].name.toLowerCase() == key)
					{
						transition = this.options.transitions.transition[i];
						break;
					}
				}
			}
			
			if (transition)
				this.transitions[key] = transition;
			else
				throw new Error("Invalid transition: " + transitionName);
		}
		
		return transition;
	},
	
	resize: function(width, height)
	{
		/// <summary>Resizes the control.</summary>
		/// <param name="width">The width value.</param>
		/// <param name="height">The height value.</param>
		
		this.host.setAttribute("width", width);
		this.host.setAttribute("height", height);
	},
	
	showEmbeddedMode: function()
	{
		/// <summary>Shows the control in embedded mode.</summary>
		
		this.host.content.fullScreen = false;
	},
	
	showFullScreenMode: function()
	{
		/// <summary>Shows the control in full-screen mode.</summary>
		
		this.host.content.fullScreen = true;
	},
	
	toggleFullScreenMode: function()
	{
		/// <summary>Toggles the control between embedded and full-screen mode.</summary>
		
		this.host.content.fullScreen = !this.host.content.fullScreen;
	},
	
	isFullScreenMode: function()
	{
		/// <summary>Specifies whether or not the control is in full-screen mode.</summary>
		/// <returns>True if the control is in full-screen mode.</returns>
		
		return this.host.content.fullScreen;
	},	
	
	trace: function(message)
	{
		/// <summary>Prepends a message to the on-screen trace log.</summary>
		/// <param name="message">The message to display.</param>
		
		if (this.traceLog)
		{
			if (this.traceLog.actualHeight > this.host.content.actualHeight - 10)
				this.traceLog.text = "";
			
			this.traceLog.text = message + "\n" + this.traceLog.text;
		}
	},
	
	onObjectLoad: function(host, context, root)
	{
		/// <summary>Handles the event fired when the Silverlight object is loaded.</summary>
		/// <param name="host">The host object.</param>
		/// <param name="context">The user context.</param>
		/// <param name="root">The root element.</param>
		
		this.root = root;
		this.host = host;
		
		this.render();
		this.onResize(this); // fixes a resize issue when width and height is set directly by createObjectEx
		
		this.host.content.onResize = SlideShow.createDelegate(this, this.onResize);
		this.host.content.onFullScreenChange = SlideShow.createDelegate(this, this.onFullScreenChange);
		
		this.loadScripts();
	},
	
	onConfigLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configuration is loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.setOptions(e.configuration);
		this.createObject();
	},
	
	onScriptsLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configured scripts are loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.loadModules();
		this.loadData();
	},
	
	onModulesLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configured modules are loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.modules = e;
		this.fireEvent("modulesLoad");
	},
	
	onDataLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the configured data is loaded.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.data = e.data;
		
		if (this.data)
		{
			if (this.data.startalbumindex != null && !this.isAlbumIndexValid(this.data.startalbumindex))
				throw new Error("Invalid configuration: startalbumindex");
			
			if (this.data.startslideindex != null && !this.isSlideIndexValid((this.data.startalbumindex) ? this.data.startalbumindex : 0, this.data.startslideindex))
				throw new Error("Invalid configuration: startslideindex");
		}
		
		this.fireEvent("dataLoad");
		this.onLoad(this);
	},
	
	onLoad: function(sender, e)
	{
		/// <summary>Handles the event fired when the control is resized in embedded mode.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.root.cursor = this.options.cursor;
		this.fireEvent("load");
	},
	
	onResize: function(sender, e)
	{
		/// <summary>Handles the event fired when the control is resized in embedded mode.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		SlideShow.Control.base.resize.call(this, this.host.content.actualWidth, this.host.content.actualHeight);
	},
	
	onFullScreenChange: function(sender, e)
	{
		/// <summary>Handles the event fired when the control changes between embedded and full-screen mode.</summary>
		/// <param name="sender">The event source.</param>
		/// <param name="e">The event arguments.</param>
		
		this.onResize(this);
		this.fireEvent("fullScreenChange");
	}
});

//var initCounter = 0;
//var loadCounter = 0;