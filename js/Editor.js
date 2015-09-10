
// TODO a drag function that work only with walls and moat to place large amount of pieces

var Editor = Class.extend({

	constructor: function(castle, landTarget, buildingTarget) {
		this._version = "0.1";

		this.castle = castle;
		this._landPanel = new LandPanel(castle, landTarget);
		this._buildingsPanel = new BuildingsPanel(castle, buildingTarget, function() {
			self.addBuilding(this.name);
		});

		this._selectedBuilding = BuildingType.type.STONE_WALL;
		this._mouseCoords = { x: 0, y: 0 };

		var self = this;
		var landPanel = this._landPanel;
		var stage = this._landPanel._stage;

		// landPanel events
		stage.on("click", function(evt) {
			console.log("click");
			console.dir(evt);
			var button = false;

			self.changeGridData(evt, button);
		});

		stage.on("dragstart", function(evt) {
			var shape = evt.target;

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
		for (var i = 0; i < 8; i++) {
			this.addBuilding("great_tower", { x: 34.5 + (83 * i), y: 34.5 });
		}
	},

	setSelectedBuilding: function(buildingType) {
		// selectedBuilding
		if (typeof(buildingType) === "undefined") {
			console.error("Invalid argument undefined to setSelectedBuilding");
		}

		this.selectedBuilding = building;
	},

	addBuilding: function(name, buildingCoords) {
		if (buildingCoords === undefined) {
			buildingCoords = { x: 48, y: 26 };
		}

		// TODO check if getNewId only get used once when adding a new building
		var id = this.castle._getNewId();
		var type = BuildingType.type[name.toUpperCase()];

		this._landPanel.addBuilding(name, buildingCoords, id);
		this.castle.addBuilding(type, buildingCoords, id);
	},

	removeBuilding: function(tileBuilding) {
		console.log("removing building needs to add this method");
	},

	changeGridData: function(coords, button) {
		var x, y;

		if (this._isValidCoords(coords)) {
			// button true is left click
			if (button) {
				var dimension = this.selectedBuilding.getDimension();
				var hotspot = this.selectedBuilding.getHotspot();
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

				var tileBuilding = castle._getTileAtPosition(x, y);

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

					var tileBuilding = castle._getTileAtPosition(x, y);

					if (tileBuilding !== undefined && tileBuilding.getBuildingType().isGapRequired()) {
						return false;
					}
				}
			}
		}

		return true;
	},

	_getCoords: function(ex, ey) {
		return {
			x: Math.floor((ex - this._gridOffset.x) / this._tileWidth),
			y: Math.floor((ey - this._gridOffset.y) / this._tileWidth)
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