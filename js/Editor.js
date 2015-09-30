
var Editor = Class.extend({

	constructor: function(resources, landPanel, buildingPanel) {
		this.resources = resources;
		this._version = "0.1";

		this._castle = new Castle();
		this._landPanel = new LandPanel(resources, landPanel);
		this._buildingPanel = new BuildingPanel(resources, buildingPanel);

		this.set();
		this.reset();
	},

	set: function() {
		var self = this;
		var coordFrom = {};
		var coordTo = {};
		var tileBuilding = {};
		var removeId = -1;
		var addDraggable = false;
		var nameDraggable = "";
		var coordStart = {};
		var coordEnd = {};

		// addBuilding buttons
		this._buildingPanel.set(function() {
			var buildingName = this.name;
			var coord = self._castle.getEmptyCoord(buildingName);

			if (buildingName === "killing_pit" || buildingName === "moat" || buildingName === "stone_wall" || buildingName === "wooden_wall") {
				addDraggable = true;
				nameDraggable = buildingName;
			} else if (coord) {
				self.addBuilding(coord, buildingName);
			} else {
				alert("No more buildings can be added");
			}
		});

		// remove a value
		//this._landPanel.getStage().on("click", function(evt) {
		//	var shape = evt.target;
		//
		//	if (shape.getClassName() === "Circle") {
		//		self.removeBuilding(shape.getAttr("del"));
		//	}
		//
		//	if (removeId !== -1) {
		//		self._landPanel.removeBuilding(removeId);
		//		removeId = -1;
		//	}
		//
		//	if (shape.getClassName() === "Image" && shape.getAttr("buildingName") !== "KEEP") {
		//		removeId = self._landPanel.clickBuilding(shape, self.getCoord(shape.getPosition()));
		//	}
		//});
		
		$("#" + this._landPanel._target).mousedown(function(evt) {

			if (addDraggable) {
				coordStart = self.getCoord({ x: evt.offsetX, y: evt.offsetY });
			}
		});

		$("#" + this._landPanel._target).mouseup(function(evt) {

			if (addDraggable) {
				coordEnd = self.getCoord({ x: evt.offsetX, y: evt.offsetY });

				self.addBuildings(coordStart, coordEnd, nameDraggable);

				addDraggable = false;
			}
		});

		// move a building
		this._landPanel.getStage().on("dragstart", function(evt) {
			var shape = evt.target;

			coordFrom = self.getCoord(shape.getPosition());
			tileBuilding = self._castle.removeBuilding(coordFrom, false);

			self._landPanel.dragstartBuilding(shape);
		});

		this._landPanel.getStage().on("dragend", function(evt) {
			var shape = evt.target;
			var buildingName = tileBuilding.getBuildingType().getOrdinal();

			coordTo = self.getCoord(shape.getPosition());

			if (self._castle.isValidCoord(coordTo, buildingName)) {
				self._castle.addBuilding(coordTo, buildingName, tileBuilding.getBuildingId());
				self._landPanel.setPosition(shape, Editor.getPosition(coordTo));
			} else {
				self._castle.addBuilding(coordFrom, buildingName, tileBuilding.getBuildingId());
				self._landPanel.setPosition(shape, Editor.getPosition(coordFrom));
			}

			self._landPanel.dragendBuilding(shape);
		});

		// add cursor styling
		this._landPanel.getStage().on("mouseover", function(evt) {

			if (evt.target.getAttr("draggable")) {
				document.body.style.cursor = "pointer";
			}
		});

		this._landPanel.getStage().on("mouseout", function() {
			document.body.style.cursor = "default";
		});
	},

	addBuilding: function(coord, buildingName, id) {
		if (coord === undefined) {
			console.error("coord is undefined");
		}

		if (this._castle.isValidCoord(coord, buildingName)) {
			id = this._castle.addBuilding(coord, buildingName, id);
			this._landPanel.addBuilding(coord, buildingName, id);

			return true;
		}

		return false;
	},

	removeBuilding: function(coord) {
		var tileBuilding = this._castle.removeBuilding(coord);

		this._landPanel.removeBuilding(tileBuilding.getBuildingId());

		return tileBuilding;
	},

	moveBuilding: function(coordFrom, coordTo, id) {
		var tileBuilding = this._castle.removeBuilding(coordFrom, false);

		if (tileBuilding.getBuildingId() !== id) {
			console.error("not the correct building", id, tileBuilding.getBuildingId());
		}

		this._castle.addBuilding(coordTo, tileBuilding.getBuildingType().getOrdinal(), tileBuilding.getBuildingId());
	},

	addBuildings: function(coord1, coord2, buildingName) {
		// just add on the place that are free and single tiles
		var self = this;
		var grid = this._castle.getGrid();
		var min = grid.min(coord1, coord2);
		var max = grid.max(coord1, coord2);
		var length = {
			width:  max.x - min.x,
			height: max.y - min.y
		};
		var coords = [];

		grid.loop(function(tileBuilding, index) {

			if ( !(tileBuilding instanceof TileBuilding)) {
				coords[coords.length] = grid.getCoord(index);
			} 
		}, min, length);

		id = this._castle.addBuildings(coords, buildingName);
		this._landPanel.addBuildings(coords, buildingName, id);
	},

	removebuildings: function(coord1, coord2) {},

	reset: function() {
		var buildingName = "KEEP";

		this._castle.reset();
		this._landPanel.reset();

		this.addBuilding({ x: 22, y: 22 }, buildingName, 0);
	},

	getCoord: function(position) {
		var gridOffset = this._landPanel.getGridOffset();
		var x = Math.round((position.x - gridOffset.x) / Editor.PIXELS);
		var y = Math.round((position.y - gridOffset.y) / Editor.PIXELS);

		if (x <= 0) x = 0;
		if (y <= 0) y = 0;

		return {
			x: (x < Castle.CASTLE_BOUNDRY_LENGTH) ? x : Castle.CASTLE_BOUNDRY_LENGTH - 1,
			y: (y < Castle.CASTLE_BOUNDRY_LENGTH) ? y : Castle.CASTLE_BOUNDRY_LENGTH - 1
		};
	}
}, {
	PIXELS: 13,
	getPixels: function(length) { return Editor.PIXELS * length; },//+ length - 1
	getPosition: function(coord) {
		return {
			x: Math.floor(coord.x * Editor.PIXELS),
			y: Math.floor(coord.y * Editor.PIXELS)
		};
	} 
});
