
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

var Resources = Class.extend({

	/**
	 * constructor for class Resources
	 *
	 * @method     constructor
	 * @param      {Object}  obj     object with the key value pairs to be saved
	 */
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

	/**
	 * check if it has the key
	 *
	 * @method     has
	 * @param      {string}  name    key to get the value
	 * @return     {Object}  value that has been saved
	 */
	has: function(name) { return this._loaded.hasOwnProperty(name); },

	/**
	 * get the keys that are saved
	 *
	 * @method     keys
	 * @return     {Array}  { description_of_the_return_value }
	 */
	keys: function() {
		var ret = [];

		for (var key in this._loaded) {
			ret.push(key);
		}

		return ret;
	},

	/**
	 * get the saved value
	 *
	 * @method     get
	 * @param      {string}   name    key to get the value
	 * @return     {Object}   return the saved value or false if its not defined
	 */
	get: function(name) {
		if (this.has(name)) {
			return this._loaded[name];
		} else {
			return false;
		}
	},

	loadRecource: function(name, obj) {
		var copy = this._copy(obj);

		if (!this.has(name)) {
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
