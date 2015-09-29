
var TileBuilding = Class.extend({

	constructor: function(buildingType, buildingId) {
		this._buildingType = buildingType;
		this._buildingId = buildingId;
	},

	getBuildingType: function() { return this._buildingType; },

	getBuildingId: function() { return this._buildingId; },

	setBuildingId: function(buildingId) { this._buildingId = buildingId; },

	toString: function() { return this._buildingId; }
});
