
var Grid = Class.extend({

	constructor: function(dimension) {
		this._map = [];
		this._length = dimension.width * dimension.height;
		this._dimension = dimension;

		this.reset();
	},

	reset: function() {
		this._map = [];
		this.setValues(undefined, this.getKeys());
	},

	setValue: function(val, key) {
		var index = this._getIndex(key);

		if (index !== -1) {
			this._map[index] = val;
		}
	},

	setValues: function(vals, keys) {
		var i, j, key;

		for (i = 0, j = keys.length; i < j; i++) {

			if (Array.isArray(vals)) {
				this.setValue(vals[i], keys[i]);
			} else {
				this.setValue(vals, keys[i]);
			}
		}
	},

	getKeys: function(start, length, direction) {
		var keys = [],
			i = 0;

		this.loop(function(val, index) {
			keys[i++] = index;
		}, start, length, direction);

		return keys;
	},

	getValue: function(key) { return this._map[this._getIndex(key)]; },

	getValues: function(keys) {
		var vals = [],
			i, j;
		
		for (i = 0, j = keys.length; i < j; i++) {
			vals[i] = this.getValue(keys[i]);
		}

		return vals;
	},

	removeValue: function(key) {
		var val = this.getValue(key);

		this.setValue(undefined, key);

		return val;
	},

	removeValues: function(keys) {
		var vals = [],
			i, j;

		for (i = 0, j = keys.length; i < j; i++) {
			vals[i] = this.removeValue(keys[i]);
		}

		return vals;
	},

	swapValue: function(key1, key2) {
		var val1 = this.removeValue(key1);
		var val2 = this.removeValue(key2);

		this.setValue(val1, key2);
		this.setValue(val2, key1);
	},

	swapValues: function(keys1, keys2) {
		var i, j;

		if (keys1.length !== keys2.length) {
			return;
		}

		for (i = 0, j = keys1.length; i < j; i++) {
			this.swapValue(keys1[i], keys2[i]);
		}
	},

	moveValue: function(key1, key2) {
		var val = this.removeValue(key1);

		this.setValue(val, key2);
	},

	moveValues: function(keys1, keys2) {
		var i, j;

		if (keys1.length !== keys2.length) {
			return;
		}

		for (i = 0, j = keys1.length; i < j; i++) {
			this.moveValue(keys1[i], keys2[i]);
		}
	},

	hasValue: function(key) {
		var index = this._getIndex(key);

		if (this.getValue(key) !== undefined && this._insideGrid(index)) {
			return true;
		}
		
		return false;
	},

	_insideGrid: function(index) { return index >= 0 && index < this._length; },

	_getIndex: function(key) {
		if (typeof key !== "object") {
			return key;
		}

		if (key.hasOwnProperty("x") && key.hasOwnProperty("y")) {
			return key.x + (key.y * this._dimension.width);
		}

		return -1;
	},

	getCoord: function(index) {
		var y = Math.floor(index / this._dimension.width);
		var x = index - (y * this._dimension.width);

		if (!this._insideGrid(index)) {
			return { x: -1, y: -1 };
		}
	
		return { x: x, y: y };
	},

	loop: function(callback, start, end, direction) { 
		var s = start || { x: 0, y: 0 };
		var e = end || this._dimension;

		if (typeof direction === "undefined") {
			this._loopAtCoord(callback, s, e);
		} else {

			if (typeof direction === "string") {
				direction = parseFloat(direction);
			}

			var length = end;

			switch (direction) {
				case 360: case 0: case 400: case 2 * Math.PI: 
					this._loopCol(callback, start, length, "v+"); break;
				case  90: case 100: case      Math.PI / 2:
					this._loopRow(callback, start, length, "h+"); break;
				case 180: case 200: case      Math.PI:
					this._loopCol(callback, start, length, "v-"); break;
				case 270: case 300: case (3 * Math.PI) / 2:
					this._loopRow(callback, start, length, "h-"); break;
				case  45: case  50: case      Math.PI / 4:
					this["--++"](callback, start, length); break;
				case 135: case 150: case (3 * Math.PI) / 4:
					this["++++"](callback, start, length); break;
				case 225: case 250: case (5 * Math.PI) / 4:
					this["++--"](callback, start, length); break;
				case 315: case 350: case (7 * Math.PI) / 4:
					this["----"](callback, start, length); break;
				default: console.error("direction doesnt exist", direction); break;
			}
		}
	},

	//_loopAtIndex: function(callback, start, end) {
	//	this._loopAtCoord(callback, this.getCoord(start), this.getCoord(end));
	//},

	_loopAtCoord: function(callback, coord, dimension) { 
		var x, y, index, br = false;
		var length = {
			x: coord.x + dimension.width,
			y: coord.y + dimension.height
		};

		for (y = coord.y; y < length.y; y++) {

			if (br) break;

			for (x = coord.x; x < length.x; x++) {

				if (x >= 0 && x < this._dimension.width &&
					y >= 0 && y < this._dimension.height) {

					index = this._getIndex({ x: x, y: y });

					if (callback.call(this, this.getValue(index), index) === -1) {
						br = true;
						break;
					}
				}
			}
		}
	},

	_loopRow: function(callback, start, length) {
		var x;

		if (length === undefined)
			length = this._dimension.x - start.x;

		for (x = start.x; x < start.x + length; x++) {

			this.callback( callback, x, start.y );
		}
	},

	_loopCol: function(callback, start, length) {
		var y;

		if (length === undefined)
			length = this._dimension.y - start.y;

		for (y = start.y; y < start.y + length; y++) {

			this.callback( callback, start.x, y );
		}
	},

	/*
	 * Helper methods
	 */
	"++++": function(callback, start, length) {
		var i, 
			x = start.x, 
			y = start.y;

		for (i = 0; i < length; i++) {

			this.callback( callback, ++x, ++y );
		}
	},
	"----": function(callback, start, length) {
		var i, 
			x = start.x, 
			y = start.y;

		for (i = 0; i < length; i++) {

			this.callback( callback, --x, --y );
		}
	},
	"++--": function(callback, start, length) {
		var i, 
			x = start.x, 
			y = start.y;

		for (i = 0; i < length; i++) {

			this.callback( callback, ++x, --y );
		}
	},
	"--++": function(callback, start, length) {
		var i, 
			x = start.x, 
			y = start.y;

		for (i = 0; i < length; i++) {

			this.callback( callback, --x, ++y );
		}
	},

	min: function(coord1, coord2) {
		var index1 = this._getIndex(coord1);
		var index2 = this._getIndex(coord2);

		if (index1 <= index2) return coord1;
		if (index1 > index2) return coord2;
	},

	max: function(coord1, coord2) { 
		var index1 = this._getIndex(coord1);
		var index2 = this._getIndex(coord2);

		if (index1 >= index2) return coord1;
		if (index1 < index2) return coord2;
	},

	getDimension: function() { return this._dimension; },

	getLength: function() { return this._length; },

	toString: function() {
		var ret = "";

		this.loop(function(val, index) {

			if ( ret.substring(ret.length - 1, ret.length) !== "\n" && ret.length !== 0) {
				ret += " ";
			}

			if (typeof val === "object") {
				ret += val.toString();
			} else if (typeof val === "undefined") {
				ret += "un";
			} else {
				ret += val;
			}

			if (this.getCoord(index).x === this._dimension.width - 1) {
				ret += "\n";
			}
		});

		return ret;
	}
}, {
	DIRECTION: {
		"v-"  : 360,

		"v-h+": 45,
		"--++": 45,

		"v+"  : 90,

		"v+h+": 135,
		"++++": 135,

		"h+"  : 180,

		"v+h-": 225,
		"++--": 225,

		"h-"  : 270,

		"v-h-": 315,
		"----": 315
	}
});