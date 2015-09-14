
// TODO a drag function that work only with walls and moat to place large amount of pieces

var Editor = Class.extend({

	constructor: function(castle, landTarget, buildingTarget) {
		this._version = "0.1";

		this.castle = castle;
		this._landPanel = new LandPanel(castle, landTarget);
		this._buildingsPanel = new BuildingsPanel(castle, buildingTarget, function() {
			self.addBuilding(this.name, { x: 22, y: 22 });
		});

		this._selectedBuilding = BuildingType.type.STONE_WALL;
		this._mouseCoords = { x: 0, y: 0 };

		var self = this;
		var landPanel = this._landPanel;
		var stage = this._landPanel._stage;
		var coordsOld;

		// landPanel events
		stage.on("click", function(evt) {
			//console.log("click");
			//console.dir(evt);
			var shape = evt.target;
			var button = false;

			self.setSelectedBuilding(shape.getAttr("buildingType"));
			self.changeGridData(evt, button);
		});

		stage.on("dragstart", function(evt) {
			var shape = evt.target;

			//TODO rotation custem animation for continue
			coordsOld = self._getCoords(shape.getPosition());
			self.setSelectedBuilding(shape.getAttr("buildingType"));

			shape.moveTo(landPanel._dragLayer);
			stage.draw();

			shape.setAttrs({
				shadowOffset: { x: 15, y: 15 },
				scale: {
					x: shape.getAttr('startScale'),
					y: shape.getAttr('startScale')
				}
			});
		});

		stage.on("dragend", function(evt) {
			var shape = evt.target;
			var coords = self._getCoords(shape.getPosition());

			if (self._isValidCoords(coords)) {
				shape.setPosition(coords);
				self.moveBuilding(name, coordsOld, coords);
			}

			shape.moveTo(landPanel._layer);
			stage.draw();

			shape.to({
				duration: 0.5,
				easing: Konva.Easings.ElasticEaseOut,
				scaleX: shape.getAttr('startScale'),
				scaleY: shape.getAttr('startScale'),
				shadowOffsetX: 5,
				shadowOffsetY: 5,
			});
		});

		// add cursor styling
		stage.on("mouseover", function(evt) {

			if (evt.target.attrs.draggable) {
				document.body.style.cursor = "pointer";
			}
		});

		stage.on("mouseout", function() {
			document.body.style.cursor = "default";
		});

		// TODO this is just a test can be deleted later
		this.setSelectedBuilding("GREAT_TOWER");

		for (var i = 0; i < 8; i++) {
			var position = this._getCoords({ x: 34.5 + (83 * i), y: 34.5 });

			this.addBuilding("great_tower", position);
		}
	},

	setSelectedBuilding: function(buildingType) {
		// _selectedBuilding
		if (typeof(buildingType) === "undefined") {
			console.error("Invalid argument undefined to setSelectedBuilding");
		}

		this._selectedBuilding = BuildingType.type[buildingType];
	},

	addBuilding: function(name, buildingCoords, id) {
		if (buildingCoords === undefined) {
			return false;
		}

		if (typeof(id) === "undefined") {
			id = this.castle._getNewId();
		}
		
		if (this._isValidCoords(buildingCoords)) {
			// TODO check if getNewId only get used once when adding a new building
			var type = BuildingType.type[name.toUpperCase()];

			this._landPanel.addBuilding(name, buildingCoords, id);
			this.castle.addBuilding(type, buildingCoords, id);

			return true;
		}
		
		return false;
	},

	removeBuilding: function(name, buildingCoords, id) {
		var buildingTiles = this.castle.getBuilding(buildingCoords);

		if (buildingTiles) {

			this._landPanel.removeBuilding(name, buildingCoords, id);
			this.castle.removeBuilding(buildingTiles);

			return true; // if succeeds
		}

		return false;
	},

	moveBuilding: function(name, oldCoords, newCoords) {
		if (this.removeBuilding(name, oldCoords)) {
			// first remove building
			if (!this.addBuilding(name, newCoords)) {
				//
				this.addBuilding(name, oldCoords);
			}
		}
	},

	changeGridData: function(coords, button) {
		var x, y;

		if (this._isValidCoords(coords)) {
			// button true is left click
			if (button) {
				var dimension = this._selectedBuilding.getDimension();
				var hotspot = this._selectedBuilding.getHotspot();
				var buildingCoords = [];
				var index = 0;

				for (x = mouseCoords.x - hotspot.x; x < mouseCoords.x - hotspot.x + dimension.width; x++) {
					for (y = mouseCoords.y - hotspot.y; y < mouseCoords.y - hotspot.y + dimension.height; y++) {

						buildingCoords[i] = { x: x, y: y };
						index++;
					}
				}

				this.addBuilding(buildingCoords);
			}

			// button false is right click
			if (!button && this._fitsInGrid(coords, { width: 1, height: 1 }, { x: 0, y: 0 })) {
				var tileBuilding = this.castle._getTileAtPosition(coords.x, coords.y);

				if (typeof(building) !== "undefined" && building !== BuildingType.type.KEEP) {
					this.removeBuilding(tileBuilding);
				}
			}
		}
	},

	_snapToGrid: function(coords) {
		return { x: Math.round(coords.x), y: Math.round(coords.y) };
	},

	// checkers
	_isValidCoords: function(coords) {
		var dimension = this._selectedBuilding.getDimension();
		var hotspot = this._selectedBuilding.getHotspot();

		if (this._fitsInGrid(coords, dimension, hotspot) &&
			this._isBuildable(coords, dimension, hotspot)) {

			if (this._selectedBuilding.isGapRequired()) {
				return this._isGapSatisfied(coords, dimension, hotspot);
			} else {
				return true;
			}
		}

		return false;
	},

	_fitsInGrid: function(coords, dimension, hotspot) {
		return (
			coords.x - hotspot.x >= 0 &&
			coords.x - hotspot.x <= this.castle._castleBoundryLength - dimension.width &&
			coords.y - hotspot.y >= 0 &&
			coords.y - hotspot.y <= this.castle._castleBoundryLength - dimension.height
		);
	},

	_isBuildable: function(coords, dimension, hotspot) {
		var x, y;

		for (y = coords.y - hotspot.y; y < coords.y - hotspot.y + dimension.height; y++) {
			for (x = coords.x - hotspot.x; x < coords.x - hotspot.x + dimension.width; x++) {

				var tileBuilding = this.castle._getTileAtPosition(x, y);

				if (tileBuilding !== undefined &&
					tileBuilding.getBuildingType() !== BuildingType.type.WOODEN_WALL &&
					tileBuilding.getBuildingType() !== BuildingType.type.STONE_WALL) {

					return false;
				}
			}
		}

		return true;
	},

	_isGapSatisfied: function(coords, dimension, hotspot) {
		var x, y;

		for (y = coords.y - hotspot.y - 1; y < coords.y - hotspot.y + dimension.height + 1; y++) {
			for (x = coords.x - hotspot.x - 1; x < coords.x - hotspot.x + dimension.width + 1; x++) {
				
				if (x >= 0 && x < this.castle._castleBoundryLength && y >= 0 && y < this.castle._castleBoundryLength) {

					var tileBuilding = this.castle._getTileAtPosition(x, y);

					if (tileBuilding !== undefined && tileBuilding.getBuildingType().isGapRequired()) {
						return false;
					}
				}
			}
		}

		return true;
	},

	_getCoords: function(coords) {
		return {
			x: Math.floor((coords.x - this._landPanel._gridOffset.x) / this._landPanel._tileWidth),
			y: Math.floor((coords.y - this._landPanel._gridOffset.y) / this._landPanel._tileWidth)
		};
	},

	generateExportString: function() {

	},

	importData: function(text) {
		if (typeof(text) === "undefined" || text.length() === 0) {
			return;
		}

		this._landPanel.importData(text);
	}
});