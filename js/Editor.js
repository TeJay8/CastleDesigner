
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
		// object reference
		var self = this;
		var stage = this._landPanel.getStage();
		// position and coords
		var mouseOffset = {};
		var position = {};
		var mousedown = false;
		var sliding = false;
		var dragging = false;
		// addBuilding variables
		var inEraser = false;
		var inLimbo = false;
		var inLimboShape;
		var inLimboName = "";
		// dragBuilding variables
		var dragCoordFrom = {};
		var dragCoordTo = {};
		var dragBuilding;

		this._buildingPanel.set(function() {
			inLimboName = this.name;

			if (inLimbo || inEraser) {
				self._landPanel.remove(inLimboShape);
				inLimbo = false;
				inEraser = false;
			}

			if (inLimboName === "eraser") {
				inEraser = true;
			}

			inLimboShape = self._landPanel.create(inLimboName, true);
			mouseOffset = {
				x: inLimboShape.attrs.width  / 2,
				y: inLimboShape.attrs.height / 2
			};
			inLimbo = true;

			self._landPanel.dragstartBuilding(inLimboShape);
		});

		stage.on("contentMousedown.proto", function(evt) {
			evt.evt.preventDefault();

			if (!dragging) {
				
				mousedown = true;

				dragCoordFrom = self.getCoord(stage.getPointerPosition());
			}
		});

		stage.on("contentMousemove.proto", function() {
	
			if (inLimbo && !mousedown && !dragging) {
				var pos = stage.getPointerPosition();

				position = {
					x: pos.x - mouseOffset.x,
					y: pos.y - mouseOffset.y
				};
				inLimboShape.setPosition(position);
				stage.children[1].batchDraw();
			}

			if (mousedown) {
				// animate the sliding of the mouse
				sliding = true;
			}
		});

		stage.on("contentMouseup.proto", function(evt) {
			var e = evt.evt, coord;

			e.preventDefault();

			if (e.button === 2) {
				self._landPanel.remove(inLimboShape);
				inLimbo = false;
				inEraser = false;
			}

			if (e.button === 0 && !dragging) {
				if (inEraser && sliding) {
					coord = self.getCoord(stage.getPointerPosition());

					self.removeBuildings(dragCoordFrom, coord);
				} else if (inEraser) {
					coord = self.getCoord(stage.getPointerPosition());

					self.removeBuilding(coord);
				} else if (sliding) {
					coord = self.getCoord(stage.getPointerPosition());

					self.addBuildings(dragCoordFrom, coord, inLimboName);
				} else if (inLimbo) {
					coord = self.getCoord(position);

					self.addBuilding(coord, inLimboName);
				}
			}

			mousedown = false;
			sliding = false;
		});

		// move a building
		stage.on("dragstart", function(evt) {

			if (!inLimbo && !inEraser) {
				var shape = evt.target;

				dragCoordFrom = self.getCoord(shape.getPosition());
				dragBuilding = self._castle.removeBuilding(dragCoordFrom, false);

				self._landPanel.dragstartBuilding(shape);

				dragging = true;
			}
		});

		stage.on("dragend", function(evt) {

			if (!inLimbo && !inEraser) {
				var shape = evt.target;
				var buildingName = dragBuilding.getBuildingType().getOrdinal();

				dragCoordTo = self.getCoord(shape.getPosition());

				if (self._castle.isValidCoord(dragCoordTo, buildingName)) {
					self._castle.addBuilding(dragCoordTo, buildingName, dragBuilding.getBuildingId());
					self._landPanel.setPosition(shape, Editor.getPosition(dragCoordTo));
				} else {
					self._castle.addBuilding(dragCoordFrom, buildingName, dragBuilding.getBuildingId());
					self._landPanel.setPosition(shape, Editor.getPosition(dragCoordFrom));
				}

				self._landPanel.dragendBuilding(shape);
			}

			dragging = false;
		});

		// add cursor styling
		stage.on("mouseover", function(evt) {

			if (evt.target.getAttr("draggable") && !inLimbo) {
				document.body.style.cursor = "pointer";
			}
		});

		stage.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
	},

	addBuilding: function(coord, buildingName, id) {
		if (coord === undefined) {
			console.error("coord is undefined");
		}

		if (this._castle.isValidCoord(coord, buildingName)) {
			id = this._castle.addBuilding(coord, buildingName, id);
			this._landPanel.addBuilding(coord, buildingName, id, this.isSingleTile(buildingName));

			return true;
		}

		return false;
	},

	removeBuilding: function(coord) {
		if (this._castle._grid.getValue(coord) !== undefined) {
			var tileBuilding = this._castle.removeBuilding(coord);

			this._landPanel.removeBuilding(tileBuilding.getBuildingId());

			return tileBuilding;
		}
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
		var i, j;
		var grid = this._castle.getGrid();
		var min = grid.min(coord1, coord2);
		var max = grid.max(coord1, coord2);
		var length = {
			width:  max.x - min.x,
			height: max.y - min.y
		};
		var coords = [];
		var coordsRemove = [];
		var idsRemove = [];

		grid.loop(function(tileBuilding, index) {
			var coord = grid.getCoord(index);

			if ( !(tileBuilding instanceof TileBuilding)) {
				coords.push(coord);
			}

			if (tileBuilding instanceof TileBuilding) {

				if (self.isSingleTile(tileBuilding.getBuildingType().getOrdinal())) {
					idsRemove.push(tileBuilding.getBuildingId());
					coordsRemove.push(coord);
					coords.push(coord);
				}
			}
			
		}, min, length);

		for (i = 0, j = coordsRemove.length; i < j; i++) {
			this.removeBuilding(coordsRemove[i]);
		}

		for (i = 0, j = coords.length; i < j; i++) {
			this.addBuilding(coords[i], buildingName);
		}
	},

	removeBuildings: function(coord1, coord2) {
		var self = this;
		var grid = this._castle.getGrid();
		var min = grid.min(coord1, coord2);
		var max = grid.max(coord1, coord2);
		var length = {
			width:  max.x - min.x,
			height: max.y - min.y
		};
		var ids = [];
		var coords = [];

		grid.loop(function(tileBuilding, index) {

			if (tileBuilding !== undefined) {
				ids.push(tileBuilding.getBuildingId());
				coords.push(grid.getCoord(index));
			}
		}, min, length);

		this._landPanel.removeBuildings(ids);
		this._castle.removeBuildings(coords);
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
	},

	isSingleTile: function(buildingName) {
		buildingName = buildingName.toUpperCase();

		return name === "KILLING_PIT" || buildingName === "MOAT" || buildingName === "STONE_WALL" || buildingName === "WOODEN_WALL";
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
