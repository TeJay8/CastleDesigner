
var Resources = Class.extend({

	constructor: function(obj) {
		this._loaded = {};

		if (obj) {
			this.loadRecources(obj);
		}
	},

	_copy: function(obj) {
		var ret = obj.constructor();

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				ret[key] = obj[key];
			}
		}

		return ret;
	},

	hasRecourse: function(name) {
		return this._loaded.hasOwnProperty(name);
	},

	keys: function() {
		var ret = [];

		for (var key in this._loaded) {
			ret.push(key);
		}

		return ret;
	},

	get: function(name) {
		if (this.hasRecourse(name)) {
			return this._loaded[name];
		} else {
			return false; // {}
		}
	},

	loadRecource: function(name, obj) {
		var copy = this._copy(obj);

		if (!this.hasRecourse(name)) {
			this._loaded[name] = copy;

			copy.name = name;
			copy.imageSrc = obj.image;
			copy.image = new Image();
			copy.image.src = obj.image;

			return true;
		}

		return false;
	},

	loadRecources: function(obj) {

		for (var key in obj) {
			this.loadRecource(key, obj[key]);
		}
	}
});
