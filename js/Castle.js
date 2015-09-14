
/*
	TODO maybe convert all loops from position to index
*/
var Castle = Class.extend({

	constructor: function(resources) {
		this.resources = resources;
		this._castleBoundryLength = 52;
		this._gridData = [];
		this._lastIdUsed = 10;

		this._resetGridData();
	},

	_getNewId: function() { return ++this._lastIdUsed; },

	importData: function(text) {
		console.log("importing data");
		console.log(text);
	},

	_loopGrid: function(callback) {
		var x, y;

		for (y = 0; y < this._castleBoundryLength; y++) {
			for (x = 0; x < this._castleBoundryLength; x++) {

				callback.call( this, x, y );
			}
		}
	},

	_loopGridStartAtPosition: function(startX, startY, width, height, callback) {
		var x, y, 
			endX = startX + width, 
			endY = startY + height;

		for (y = startY; y < endY; y++) {
			for (x = startX; x < endX; x++) {

				callback.call( this, x, y );
			}
		}
	},

	// setters of tiles
	_removeTileAtPosition: function(x, y) {
		this._setTileAtPosition(x, y, undefined);
	},

	_setTileAtPosition: function(x, y, buildingTile) {
		this._setTileAtGridIndex(this._getIndexAtPosition(x, y), buildingTile);
	},

	_setTileAtGridIndex: function(index, buildingTile) {
		this._gridData[index] = buildingTile;
	},

	// getters of tiles
	_getTileAtPosition: function(x, y) {
		return this._getTileAtIndex(this._getIndexAtPosition(x, y));
	},

	_getTileAtIndex: function(index) {
		return this._gridData[index];
	},

	// getter position and index
	_getIndexAtPosition: function(x, y) {
		var index = (y * this._castleBoundryLength) + x;

		if (index + 1 > this._castleBoundryLength * this._castleBoundryLength) {
			console.error("index out of range");
		}

		return index;
	},

	_getPositionAtIndex: function(index) {
		var y = Math.floor(index / this._castleBoundryLength);
		var x = index - (y * this._castleBoundryLength);

		return { x: x, y: y };
	},


	//TODO all the reset methods should be directed by the editor
	// stats and data methods
	_resetGridData: function() {

		this._loopGrid(function(x, y) {

			this._removeTileAtPosition(x, y);
		});

		var type = BuildingType.type.KEEP;
		var xAndY = (this._castleBoundryLength - BuildingType.type.KEEP.getWidth()) / 2;

		this.addBuilding(type, { x: xAndY, y: xAndY }, 0);
	},

	_updateDesignStats: function() {
		// TODO should be finished later
	},

	/**
	 * Adds a buildingType to the castle grid.
	 *
	 * @method     addBuilding
	 * @param      {int}  position  start position x
	 * @param      {BuildingType}  type    one of the default building types
	 * @param      {int}  id      optional custom id
	 */
	addBuilding: function(type, position, id) {
		
		//if (id === undefined) {
		//	id = this._getNewId;
		//}

		var tile = new TileBuilding(type, id);

		this._loopGridStartAtPosition(
			position.x, position.y,
			type.getWidth(),
			type.getHeight(),
			function(x, y) {

				var gp = this._getTileAtPosition(x, y);

				if (gp !== undefined) {
					// means its a building
					console.log("its a building");
				}

				this._setTileAtPosition(x, y, tile);
			}
		);

		this._updateDesignStats();
	},


	/**
	 * Gets the buildingTile
	 *
	 * @method     getBuilding
	 * @param      {<type>}  x       { description }
	 * @param      {<type>}  y       { description }
	 * @return    {bool} return false if it not a correct building
	 */
	getBuilding: function(x, y) {
		return false;
	},


	/**
	 * Removes the buildingTile from the grid
	 *
	 * @method     removeBuilding
	 * @param      {<type>}  tile    { description }
	 */
	removeBuilding: function(tile) {
		// TODO change param to position
		var id = tile.getId();

		this._loopGrid(function(x, y) {

			var tb = this._getTileAtPosition(x, y);

			if (tb.getId() == id) {

				this._removeTileAtPosition(x, y);
			}
		});
	},





	// methods under here are not final yet

	isGapSatisfied: function(coord, size, buildingTile) {
		// TODO building that are in the position needs te be removed first

		var startX = coord.x - 1, 
			startY = coord.y - 1, 
			width = size.x + 1,
			height = size.y + 1;

		this._loopGridStartAtPosition(startX, startY, width, height, function(x, y) {

			var tileBuilding = this._getTileAtPosition(x, y);

			if (tileBuilding.getType().isGapRequired()) {
				return false;
			}
		});

		return true;
	}
});
