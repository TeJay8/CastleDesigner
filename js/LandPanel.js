
var LandPanel = Class.extend({

	constructor: function(resources, target, dimension, gridOffset) {
		this.resources = resources;

		this._target = target;
		this._dimension = dimension || { width: 676, height: 676 };//688
		this._gridOffset = gridOffset || { x: 0, y: 0 };

		this._radius = 4;
		this._edge = 4;

		this._stage = new Konva.Stage({
			container: this._target,
			width: this._dimension.width,
			height: this._dimension.height
		});

		this._layer = new Konva.Layer();
		this._dragLayer = new Konva.Layer();
		this._stage.add(this._layer, this._dragLayer);
	},

	addBuilding: function(coord, buildingName, id, update) {
		//TODO no shadow if its a single tile
		var name = buildingName.toLowerCase();
		var resource = this.resources.get(name);
		var rotation = 0; // TODO if building need to rotated depending on the position
		var building;
		var dimension = Editor.getPosition({
			x: resource.dimension.width,
			y: resource.dimension.height
		});
		var position = Editor.getPosition(coord);
		
		var item = {
			id: id,
			image: resource.image,
			x: position.x,
			y: position.y,
			width: dimension.x,
			height: dimension.y,
			draggable: true,
			rotation: rotation,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: { x: 5, y: 5 },
			shadowOpacity: 0.6,
			startScale: 1,
			buildingName: buildingName.toUpperCase()
		};

		if (name === "keep") item.draggable = false;

		building = new Konva.Image(item);

		this._layer.add(building);

		if (update !== false) {
			this.repaint();
		}
	},

	removeBuilding: function(id) {
		var building = this._findBuilding(id);

		building.destroy();

		this.repaint();
	},

	addBuildings: function(coords, buildingName, id) {
		var i, j;

		for (i = 0, j = coords.length; i < j; i++) {
			this.addBuilding(coords[i], buildingName, id, false);
		}

		this.repaint();
	},

	_findBuilding: function(id) {

		if (id.toString().charAt(0) !== "#") {
			id = "#" + id;
		}

		return this._stage.find(id)[0];
	},

	setPosition: function(shape, position) { shape.setPosition(position); },

	clickBuilding: function(shape, coord) {
		
		var circle = new Konva.Circle({
			x: shape.getX() + shape.getWidth() - this._radius / 2 - this._edge,
			y: shape.getY() + this._radius / 2 + this._edge,
			radius: this._radius,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 1,
			del: coord,
			id: 5
		});

		this._layer.add(circle);
		this.repaint();

		return circle.getAttr("id");
	},

	dragstartBuilding: function(shape) {
		shape.moveTo(this._dragLayer);
		this.repaint();

		shape.setAttrs({
			shadowOffset: { x: 15, y: 15 },
			scale: {
				x: shape.getAttr('startScale'),
				y: shape.getAttr('startScale')
			}
		});
	},

	dragendBuilding: function(shape) {
		shape.moveTo(this._layer);
		this.repaint();

		shape.to({
			duration: 0.5,
			easing: Konva.Easings.ElasticEaseOut,
			scaleX: shape.getAttr('startScale'),
			scaleY: shape.getAttr('startScale'),
			shadowOffsetX: 5,
			shadowOffsetY: 5,
		});
	},

	reset: function() { this._layer.getChildren().destroy(); },

	repaint: function() { this._stage.draw(); },

	getStage: function() { return this._stage; },

	getDimension: function() { return this._dimension; },

	getGridOffset: function() { return this._gridOffset; }
});
