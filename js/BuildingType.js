
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
