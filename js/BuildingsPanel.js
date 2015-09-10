

var BuildingsPanel = Class.extend({

	constructor: function(castle, target, callback, size, menuDimension) {
		this.castle = castle;
		this.target = target;

		this._menuSize = size || { x: 2, y: 7 };
		this._menuDimension = menuDimension || { width: 100, height: 70 };
		this._order = ["tower", "stone", "gatehouse", "wooden", "rest"];

		var keys = this._sortKeys(this.castle.resources.keys());
		var x, y, name, dimension, index;
		var div, button;

		// set the buttons panel
		for (y = 0; y < Math.floor(keys.length / this._menuSize.x); y++) {
			for (x = 0, j = this._menuSize.x; x < j; x++) {

				index = (y * this._menuSize.x) + x;
				name = keys[index];

				div = $("<div></div>");
				button = $("<button name='" + name + "' title='" + this._cleanUp(name) + "'></buttons>");

				dimension = {
					width: getPixelsize(BuildingType.type[name.toUpperCase()].getWidth()),
					height: getPixelsize(BuildingType.type[name.toUpperCase()].getHeight())
				};

				button.click(callback);
				button.css({
					position: "relative",
					background: "url(" + this.castle.resources.get(name).image.src + ") no-repeat",
					width: dimension.width,
					height: dimension.height,
					margin: "auto",
					left: (this._menuDimension.width - dimension.width) / 2,
					top: (this._menuDimension.height - dimension.height) / 2,
				});

				div.css({
					"float": "left",
					width: this._menuDimension.width,
					height: this._menuDimension.height
				});

				div.append(button);

				this.target.append(div);
			}
		}

		// TODO set the quantities panel
		// TODO set the resources panel
		// TODO set the time panel
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

		return str.substring(0, index) + " " + str.substring(index + 1, str.length);
	}
});