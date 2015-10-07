
var Castle = Class.extend({

	constructor: function(dimension, callStackLength) {
		this._dimension = dimension || { width: Castle.CASTLE_BOUNDRY_LENGTH, height: Castle.CASTLE_BOUNDRY_LENGTH };
		this._grid = new Grid(this._dimension);
		this._lastIdUsed = 9;
		this._totalBuildingTime = 0;
		this._buildingQuantities = new Map();
		this._buildingResources = new Map();

		this._callStack = [];
		this._callStackCurrent = -1;
		this._callStackLength = callStackLength || 10;

		this._selectedBuilding = Building.Type.STONE_WALL;
	},

	addBuilding: function(coord, buildingName, id, update) {

		if (typeof id === "undefined") {
			id = this._getNewId();
		}

		var buildingType = this._setSelectedBuilding(buildingName);
		var tileBuilding = new TileBuilding(buildingType, id);
		var keys = this._grid.getKeys(coord, buildingType.getDimension());

		this._grid.setValues(tileBuilding, keys);

		if (update !== false) {
			//this._push(this._grid.toString());
			this._updateDesignStats();
		}

		return id;
	},

	removeBuilding: function(coord, update) {
		var tileBuilding = this._grid.getValue(coord);

		if ( !(tileBuilding instanceof TileBuilding) ) {
			console.error("tileBuilding is incorrect");
		}

		this._setSelectedBuilding(tileBuilding.getBuildingType().getOrdinal());

		var id = tileBuilding.getBuildingId();
		var keys = this._grid.getKeys(this._getBaseCoord(coord), tileBuilding.getBuildingType().getDimension());

		this._grid.removeValues(keys);

		if (update !== false) {
			//this._push(this._grid.toString());
			this._updateDesignStats();
		}

		return tileBuilding;
	},

	addBuildings: function(coords, buildingName) {
		var i, j, id;
		var ret = [];
		
		for (i = 0, j = coords.length; i < j; i++) {
			id = this._getNewId();

			this.addBuilding(coords[i], buildingName, id, false);

			ret.push(id);
		}

		if (coords.length > 0) {
			//this._push(this._grid.toString());
			this._updateDesignStats();
		}

		return ret;
	},

	removeBuildings: function(coords) {
		var i, j;

		for (i = 0, j = coords.length; i < j; i++) {
			this.removeBuilding(coords[i], false);
		}

		if (coords.length > 0) {
			//this._push(this._grid.toString());
			this._updateDesignStats();
		}
	},

	reset: function() {
		var self = this;

		this._grid.reset();
		this._buildingQuantities = new Map();

		this._forEach(Building.Type, function(buildingType, buildingName) {
			self._buildingQuantities.set(buildingName, 0);
		});
	},

	_getBaseCoord: function(coord) {
		var tileBuilding =  this._grid.getValue(coord);
		var tb,	x = coord.x, y = coord.y;

		if (tileBuilding === undefined) {
			return { x: -1, y: -1 };
		}

		while (x >= 0) {
			tb = this._grid.getValue({ x: x - 1, y: y});

			if (tb === tileBuilding) {
				x--;
			} else {
				break;
			}
		}

		while (y >= 0) {
			tb = this._grid.getValue({ x: x, y: y - 1});

			if (tb === tileBuilding) {
				y--;
			} else {
				break;
			}
		}

		return { x: x, y: y };
	},

	getNumberOfBuildings: function(buildingType) { return this._buildingQuantities.get(buildingType); },

	getTotalResource: function(resource) { return this._buildingResources.get(resource); },

	getTotalBuildingTime: function() { return this._totalBuildingTime; },

	getGrid: function() { return this._grid; },
	
	_getNewId: function(buildingName) { return ++this._lastIdUsed; },

	_updateDesignStats: function() {
		var buildingCounts = new Map();

		this._totalBuildingTime = 0;

		// reset the _buildingResources map
		this._forEach(Building.Resource, function(buildingResource) {
			this._buildingResources.set(buildingResource, 0);
		}, this);

		// set the buildingCounts to building name and to zero
		this._forEach(Building.Type, function(buildingType, buildingName) {
			buildingCounts.set(buildingName, 0);
		}, this);

		// counting the buildingType
		this._grid.loop(function(tileBuilding, index) {

			if (tileBuilding !== undefined) {
				var buildingType = tileBuilding.getBuildingType();

				buildingCounts.set(buildingType.getOrdinal(), buildingCounts.get(buildingType.getOrdinal()) + 1);
			}
		});

		// calculating cost and time
		this._forEach(Building.Type, function(buildingType, buildingName) {
			var numberOfBuildings = this._calculateNumberOfBuildings(buildingType, buildingCounts.get(buildingName));

			this._buildingQuantities.set(buildingName, numberOfBuildings);

			this._forEach(Building.Resource, function(buildingResource) {
				var cumulativeCost = this._buildingResources.get(buildingResource) + buildingType.getCost(buildingResource) * numberOfBuildings;

				this._buildingResources.set(buildingResource, cumulativeCost);
			}, this);

			this._totalBuildingTime += buildingType.getBuildTime() * numberOfBuildings;
		}, this);
	},

	_calculateNumberOfBuildings: function(buildingType, numberOfTiles) {
		var dimension = buildingType.getDimension();

		return Math.floor(numberOfTiles / (dimension.width * dimension.height));
	},

	backward: function() {
		var operation;

		if (this._callStackCurrent === -1) {
			return false;
		}

		operation = this._callStack[this._callStackCurrent];

		this._grid[operation.action.backward](operation.argsFirst, operation.argSecond);

		if (this._callStackCurrent > 0) {
			this._callStackCurrent--;
		}

		return true;
	},

	forward: function() {
		var operation;

		if (this._callStackCurrent === -1) {
			return false;
		}

		operation = this._callStack[this._callStackCurrent];

		this._grid[operation.action.forward](operation.argsFirst, operation.argSecond);

		if (this._callStackCurrent < this._callStackLength) {
			this._callStackCurrent++;
		}

		return true;
	},

	_push: function(string) {
		if (this._callStack.length >= this._callStackLength) {
			this._callStack.splice(0, 1);
		} else {
			this._callStackCurrent++;
		}

		this._callStack.push(string);
	},

	_setSelectedBuilding: function(buildingName) {
		if (typeof(buildingName) === "undefined") {
			console.error("Invalid argument undefined to setSelectedBuilding");
		}

		var buildingType = Building.Type[buildingName.toUpperCase()];

		this._selectedBuilding = buildingType;

		return buildingType;
	},

	getEmptyCoord: function(buildingName) {
		var ret = false;
		var self = this;
		
		this._setSelectedBuilding(buildingName);

		this._grid.loop(function(tileBuilding, index) {
			var coord = self._grid.getCoord(index);

			if (self.isValidCoord(coord, buildingName) && ret === false) {
				ret = coord;
				return -1;
			}
		});

		return ret;
	},

	isValidCoord: function(coord, buildingName) {

		this._setSelectedBuilding(buildingName);

		if (this._fitsinGrid(coord) && this._isBuildable(coord) && this._hasMaxBuildings()) {

			if (this._selectedBuilding.getGapRequired()) {
				return this._isGapSatisfied(coord);
			} else {
				return true;
			}
		}

		return false;
	},

	_fitsinGrid: function(coord) {
		var dimension = this._selectedBuilding.getDimension();

		return (
			coord.x >= 0 && coord.y >= 0 &&
			coord.x <= this._dimension.width - dimension.width &&
			coord.y <= this._dimension.height - dimension.height
		);
	},

	_isBuildable: function(coord) {
		var dimension = this._selectedBuilding.getDimension();
		var ret = true;

		this._grid.loop(function(tileBuilding, index) {

			if (tileBuilding !== undefined &&
				tileBuilding.getBuildingType() !== Building.Type.WOODEN_WALL &&
				tileBuilding.getBuildingType() !== Building.Type.STONE_WALL) {

				ret = false;
				return -1;
			}
		}, coord, dimension);

		return ret;
	},

	_isGapSatisfied: function(coord) {
		var dimension = this._selectedBuilding.getDimension();
		var ret = true;
		var start = {
			x: coord.x - 1,
			y: coord.y - 1
		};
		var end = {
			width: dimension.width + 2,
			height: dimension.height + 2
		};

		this._grid.loop(function(tileBuilding, index) {

			if (tileBuilding !== undefined && tileBuilding.getBuildingType().getGapRequired()) {
				ret = false;
				return -1;
			}
		}, start, end);

		return ret;
	},

	_hasMaxBuildings: function() { 
		var max = this._selectedBuilding.getMaxBuildings();

		if (max === -1 || this.getNumberOfBuildings(this._selectedBuilding.getOrdinal()) < max) {
			return true;
		}

		return false;
	},

	_forEach: function(obj, callback, ctx) {
		Object.keys(obj).sort().forEach(function(key, index) {
			callback.call( ctx, obj[key], key, index );
		});
	},

	//exportData: function() {
	//	var exp = {};
	//	var tileBuilding, coord, type;
//
	//	exp[Building.Type.WOODEN_WALL] = "";
	//	exp[Building.Type.STONE_WALL] = "";
	//	exp[Building.Type.MOAT] = "";
	//	exp[Building.Type.KILLING_PIT] = "";
	//	exp[STRUCTURES] = "";
//
	//	this.loop(function(index) {
	//		tileBuilding = this.getGridDataIndex(index);
	//		coord = this.getCoord(index);
//
	//		if (tileBuilding === undefined) {
	//			return;
	//		}
//
	//		type = tileBuilding.getBuildingType();
//
	//		switch (type) {
	//			case Building.Type.WOODEN_WALL: case Building.Type.STONE_WALL:
	//			case Building.Type.MOAT: case Building.Type.KILLING_PIT:
	//				exp[type] += this._convertToLetters(coord.x);
	//				exp[type] += this._convertToLetters(coord.y);
	//				break;
	//			default:
	//				//exp.STRUCTURES += this._convertToLetters(tileBuilding.getBuildingId());
	//				exp.STRUCTURES += this._convertToLetters(tileBuilding.getBuildingType());
	//				exp.STRUCTURES += this._convertToLetters(coord.x);
	//				exp.STRUCTURES += this._convertToLetters(coord.y);
	//				break;
	//		}
	//	});
//
	//	return (
	//		exp[Building.Type.WOODEN_WALL] + "@" + 
	//		exp[Building.Type.STONE_WALL] + "@" + 
	//		exp[Building.Type.MOAT] + "@" + 
	//		exp[Building.Type.KILLING_PIT] + "@" + 
	//		exp[STRUCTURES]
	//	);
	//},
//
	////TODO make this compatible with the java program
	//importData: function(text) {
	//	var dataStrings = text.split("@");
//
	//	this.resetGridData();
//
	//	this._importSingleTiles(Building.Type.WOODEN_WALL, dataString[0]);
	//	this._importSingleTiles(Building.Type.STONE_WALL, dataString[1]);
	//	this._importSingleTiles(Building.Type.MOAT, dataString[2]);
	//	this._importSingleTiles(Building.Type.KILLING_PIT, dataString[3]);
//
	//	var buildingType = this._convertToInt(dataString[4]);
	//	var x = this._convertToInt(dataString[4].substring(i, i + 2));
	//	var y = this._convertToInt(dataString[4].substring(i + 2, i + 3));
//
	//	this._updateDesignStats();
	//},
//
	//_importSingleTiles: function(buildingType, dataString) {
	//	var i = 0, x, y;
	//	var coords = [];
//
	//	while (i < dataString.length()) {
	//		x = this._convertToInt(dataString.substring(i, i + 1));
	//		y = this._convertToInt(dataString.substring(i + 1, i + 2));
//
	//		coords[i] = { x: x, y: y };
//
	//		i += 2;
	//	}
//
	//	this.addBuilding(coords, buildingType, undefined, false);
	//},
//
	//_convertToLetters: function(val) {
	//	var ret = "";
//
	//	while (val > 0) {
	//		val--;
	//		ret = String.fromCharCode(97 + (val % 26)) + ret;
	//		val = Math.floor(val / 26);
	//	}
//
	//	return ret;
	//},
//
	//_convertToInt: function(val) {
	//	var i,
	//		index = 0,
	//		ret = 0;
//
	//	for (i = val.length; i >= 0; i--) {
	//		ret += ((val.charCodeAt(i) - 97) * index);
//
	//		index++;
	//	}
//
	//	return ret;
	//},

}, {
	CASTLE_BOUNDRY_LENGTH: 52
});

