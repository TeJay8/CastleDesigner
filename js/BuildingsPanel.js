
// Copyright (c) 2015 Tejay.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var BuildingPanel = Class.extend({

	constructor: function(resources, target, dimension, button) {
		this.resources = resources;

		this._target = $("#" + target);
		this._dimension = dimension || { width: 2, height: 7 };
		this._button = button || { width: 100, height: 70 };
		this._materials = [ "STONE", "WOOD", "IRON", "GOLD" ];
	},

	set: function(callback) {
		this._callback = callback;

		var keys = this._sortKeys();
		
		for (i = 0, j = keys.length; i < j; i++) {
			this.addButton(keys[i]);
		}

		this.addDivider();
		this.addButton("eraser");
		//this.addButton("save");
		this.addDivider();

		// TODO set the quantities panel
		// TODO set the resources panel
		// TODO set the time panel
	},

	addButton: function(name) {
		var button = $("<button name='" + name + "' title='" + this._cleanUp(name) + "'></buttons>");
		//var dimension = Building.Type[name.toUpperCase()].getDimension();
		var dimension;
		var resource = this.resources.get(name);

		if (resource) {

			dimension = { 
				width: Editor.getPixels(resource.dimension.width),
				height: Editor.getPixels(resource.dimension.height)
			};

			button.click(this._callback);
			button.css({
				position: "relative",
				background: "url(" + resource.image.src + ") no-repeat",
				backgroundSize: "100%",
				width: dimension.width,
				height: dimension.height,
				margin: "auto",
				left: (this._button.width - dimension.width) / 2,
				top: (this._button.height - dimension.height) / 2,
			});

			this._setElement(button);
		}
	},

	addDivider: function() {
		var hr = $("<hr>");

		this._setElement(hr, {
			width: this._dimension.width * this._button.width,
			height: 5
		});
	},

	_setElement: function(element, dimension) {
		var div = $("<div></div>");

		if (dimension === undefined) {
			dimension = this._button;
		}

		div.css({
			"float": "left",
			width: dimension.width,
			height: dimension.height
		});

		div.append(element);

		this._target.append(div);
	},

	_largestMaterial: function(materials) {
		var i, j;
		var largest = 0;

		for (i = 1, j = materials.length; i < j; i++) {
			if (materials[i - 1] < materials[i]) {
				largest = i;
			}
		}

		return this._materials[largest];
	},

	_sortKeys: function() {
		var ret = {
			STONE: [],
			WOOD: [],
			IRON: [],
			GOLD: []
		};
		var i, j, key, resource;
		var keys = this.resources.keys();

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			resource = this.resources.get(key);

			if (resource.hasOwnProperty("resourceCosts") && key !== "keep") {
				ret[this._largestMaterial(resource.resourceCosts)].push(key);
			}
		}
		
		return ret.STONE.concat( ret.WOOD.concat( ret.IRON.concat( ret.GOLD ) ) );
	},

	_cleanUp: function(str) {
		var index = str.indexOf("_");

		if (index < 0) {
			return str;
		}

		return str.substring(0, index) + " " + str.substring(index + 1, str.length);
	}
});
