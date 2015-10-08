
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

var Building = {
	Type: {},
	Resource: {
		STONE: 0,
		WOOD:  1,
		IRON:  2,
		GOLD:  3
	},
	set: function(resources) {
		var i, j, key, resource,
			keys = resources.keys();

		for (i = 0, j = keys.length; i < j; i++) {
			key = keys[i];
			resource = resources.get(key);

			if (resource.hasOwnProperty("max")) {
				Building.Type[key.toUpperCase()] = new BuildingType(
					key.toUpperCase(),
					resource.colour,
					resource.dimension,
					resource.gapRequired,
					resource.resourceCosts,
					resource.buildTime,
					resource.max
				);
			}
		}
	}
};

var BuildingType = Class.extend({

	/**
	 * constructor saves all the data needed for the building
	 *
	 * @method     constructor
	 * @param      {string}  ordinal        the building name
	 * @param      {string}  colour         colour of the building
	 * @param      {Object}  dimension      object with int width and int height
	 * @param      {bool}    gapRequired    one extra point on all side
	 * @param      {Array}   resourceCosts  array with the resource cost in
	 *                                      order stone, wood, iron, gold
	 * @param      {Number}  buildTime      integer time to build the building
	 * @param      {Number}  maxBuildings   max building allowed -1 if its infinity
	 */
	constructor: function(ordinal, colour, dimension, gapRequired, resourceCosts, buildTime, maxBuildings) {
		this._ordinal = ordinal;
		this._colour = colour;
		this._dimension = dimension;
		this._gapRequired = gapRequired;
		this._buildTime = buildTime;
		this._maxBuildings = maxBuildings;
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
		this._buildingResources = new Map();
		this._buildingResources.set(Building.Resource.STONE, resourceCosts[0]);
		this._buildingResources.set(Building.Resource.WOOD,  resourceCosts[1]);
		this._buildingResources.set(Building.Resource.IRON,  resourceCosts[2]);
		this._buildingResources.set(Building.Resource.GOLD,  resourceCosts[3]);
	},

	getOrdinal: function() { return this._ordinal; },

	getHotspot: function() { 
		return {
			x: Math.floor((this._dimension.width  - 1) / 2),
			y: Math.floor((this._dimension.height - 1) / 2)
		};
	},

	getColour: function() { return this._colour; },

	getDimension: function() { return this._dimension; },

	getGapRequired: function() { return this._gapRequired; },

	getCost: function(buildingResource) { return this._buildingResources.get(buildingResource); },

	getBuildTime: function() { return this._buildTime; },

	getMaxBuildings: function() { return this._maxBuildings; }
});
