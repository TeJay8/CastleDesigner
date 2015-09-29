
var LandPanel = Class.extend({

	constructor: function(resources, target, dimension, gridOffset) {
		this.resources = resources;

		this._target = target;
		this._dimension = dimension || { width: 676, height: 676 };//688
		this._gridOffset = gridOffset || { x: 0, y: 0 };

		this._stage = new Konva.Stage({
			container: this._target,
			width: this._dimension.width,
			height: this._dimension.height
		});

		this._layer = new Konva.Layer();
		this._dragLayer = new Konva.Layer();
		this._stage.add(this._layer, this._dragLayer);
	},

	addBuilding: function(coord, buildingName, id, callback) {
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
		this.repaint();
	},

	removeBuilding: function(id) {
		var building = this._findBuilding(id);

		building.destroy();

		this.repaint();
	},

	_findBuilding: function(id) {

		if (id.charAt(0) !== "#") {
			id = "#" + id;
		}

		return this._stage.find(id)[0];
	},

	setPosition: function(shape, position) { shape.setPosition(position); },

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
