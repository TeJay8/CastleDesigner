
var BuildingType = Class.extend({

	constructor: function(a, b, c, d) {

		if (b === undefined) {
			this.set(a.size, a.gapRequired);
		} else {
			this.set(a, b, c, d);
		}
	},

	set: function(dimension, gapRequired, resourceCosts, buildTime) {
		this._dimension = dimension;
		this._gapRequired = gapRequired;
		// resourceCosts and buildTime not in this version
		//this._resourceCosts = resourceCosts;
		//this._resourceCosts = resourceCosts;
	},

	getHotspot: function() {
		return {
			x: Math.floor((this._dimension.width  - 1) / 2),
			y: Math.floor((this._dimension.height - 1) / 2)
		};
	},

	getWidth: function() {
		return this._dimension.width;
	},

	getHeight: function() {
		return this._dimension.height;
	},

	getDimension: function() {
		return this._dimension;
	},

	isGapRequired: function() {
		return this._gapRequired;
	},

	toString: function() {
		return "";
	}
}, {
	type: {
		//EMPTY: new BuildingType({ width: 1, height: 1 }, false)
	},
	setter: function(recourses) {
		var i, j,
			key,
			keys = recourses.keys();

		for (i = 0, j = keys.length; i < j; i++) {
			key = keys[i];

			BuildingType.type[key.toUpperCase()] = new BuildingType(recourses.get(key));
		}
	}
});