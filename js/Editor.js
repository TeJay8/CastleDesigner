
var Editor = Class.extend({

	constructor: function(resources, landPanel, buildingPanel) {
		var self = this;

		this.resources = resources;

		this._version = "0.1";

		this._castle = new Castle();
		this._landPanel = new LandPanel(resources, landPanel);
		this._buildingPanel = new BuildingPanel(resources, buildingPanel, function() {
			var buildingName = this.name;
			var coord = self._castle.getEmptyCoord(buildingName);

			if (buildingName === "killing_pit" || buildingName === "moat" || buildingName === "stone_wall" || buildingName === "wooden_wall") {
				self.addDraggable(buildingName);
			} else if (coord) {
				self.addBuilding(coord, buildingName);
			} else {
				alert("No more buildings can be added");
			}
		});

		this.set();
		this.reset();
	},

	set: function() {
		var self = this;
		var coordFrom = {};
		var coordTo = {};

		this._landPanel.getStage().on("dragstart", function(evt) {
			var shape = evt.target;

			coordFrom = self.getCoord(shape.getPosition());

			self._landPanel.dragstartBuilding(shape);
		});

		this._landPanel.getStage().on("dragend", function(evt) {
			var shape = evt.target;

			coordTo = self.getCoord(shape.getPosition());
			// TODO: remove castle grid values of the building that is moved

			if (self._castle.isValidCoord(coordTo, shape.getAttr("buildingName"))) {
				self.moveBuilding(coordFrom, coordTo, shape.getAttr("id"));
				self._landPanel.setPosition(shape, Editor.getPosition(coordTo));
			} else {
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

	addDraggable: function(buildingName) {
		//TODO: a drag function that work only with walls and moat to place large amount of pieces
		console.log("start dragging the building ", buildingName);
	},

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
