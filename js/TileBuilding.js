/*
	TODO: when TileBuilding get added to the grid it should be one building still
	TODO: keep the recourse stored here can only have so many recourses
*/
var TileBuilding = Class.extend({

	constructor: function(type, id) {
		this._type = type || 0;
		this._id = id || 0;
	},

	getBuildingType: function() {
		return this._type;
	},

	setBuildingType: function(type) {
		this._type = type;
	},

	getBuildingId: function() {
		return this._id;
	},

	setBuildingId: function(id) {
		this._id = id;
	}
});