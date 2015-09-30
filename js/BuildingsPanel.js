
var BuildingPanel = Class.extend({

	constructor: function(resources, target, dimension, button) {
		this.resources = resources;

		this._target = $("#" + target);
		this._dimension = dimension || { width: 2, height: 7 };
		this._button = button || { width: 100, height: 70 };
		this._order = ["tower", "stone", "gatehouse", "wooden", "rest"];
	},

	set: function(callback) {
		this._callback = callback;

		var keys = this._sortKeys(this.resources.keys());
		var x, y, index;

		// set the buttons panel
		for (y = 0; y < Math.floor(keys.length / this._dimension.width); y++) {
			for (x = 0; x < this._dimension.width; x++) {

				index = (y * this._dimension.width) + x;

				this.addButton(keys[index]);
			}
		}

		// TODO set the quantities panel
		// TODO set the resources panel
		// TODO set the time panel
	},

	addButton: function(name) {
		var div = $("<div></div>");
		var button = $("<button name='" + name + "' title='" + this._cleanUp(name) + "'></buttons>");
		var dimension = Building.Type[name.toUpperCase()].getDimension();

		dimension = { 
			width: Editor.getPixels(dimension.width),
			height: Editor.getPixels(dimension.height)
		};

		button.click(this._callback);
		button.css({
			position: "relative",
			background: "url(" + this.resources.get(name).image.src + ") no-repeat",
			backgroundSize: "100%",
			width: dimension.width,
			height: dimension.height,
			margin: "auto",
			left: (this._button.width - dimension.width) / 2,
			top: (this._button.height - dimension.height) / 2,
		});

		div.css({
			"float": "left",
			width: this._button.width,
			height: this._button.height
		});

		div.append(button);

		this._target.append(div);
	},

	_contains: function(array, str) {
		var i, j;

		for (i = 0, j = array.length; i < j; i++) {
			if (array[i] === str) return true;
		}

		return false;
	},

	_sortKeys: function(keys) {
		// TODO sort by material [ STONE, WOOD, IRON, STONE ]
		var ret = [];
		var i, j, indexOf, name, current;
		var index = 0;

		for (i = 0; i < this._order.length; i++) {
			current = this._order[i];

			for (j = 0; j < keys.length; j++) {
				name = keys[j];

				if (current !== "rest") {

					indexOf = name.indexOf(current);

					if (indexOf >= 0 && name !== "keep" && !this._contains(ret, name)) {

						ret[index] = name;
						index++;
					}
				} else {
					if (name !== "keep" && !this._contains(ret, name)) {
						
						ret[index] = name;
						index++;
					}
				}
			}
		}

		return ret;
	},

	_cleanUp: function(str) {
		var index = str.indexOf("_");

		if (index < 0) {
			return str;
		}

		return str.substring(0, index) + " " + str.substring(index + 1, str.length);
	}
});
