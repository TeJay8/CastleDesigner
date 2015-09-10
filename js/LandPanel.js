

var LandPanel = Class.extend({

	constructor: function(castle, target, size, gridOffset, tileWidth) {
		this.castle = castle;
		this.target = target;

		this._size = size || { width: 727, height: 727 };
		this._gridOffset = gridOffset || { x: 0, y: 0 };
		this._tileWidth = tileWidth || 13;
		
		this._stage = new Konva.Stage({
			container: this.target,
			width: this._size.width,
			height: this._size.height
		});

		this._layer = new Konva.Layer();
		this._dragLayer = new Konva.Layer();
		this._stage.add(this._layer, this._dragLayer);

		this.resetGridData();
	},

	removeBuilding: function() {

	},

	addBuilding: function(name, position, id) {
		// TODO position middle of image?
		// TODO get the checkers from the java project
		// TODO make a removeBuilding method
		// TODO link the addBuilding method to castle object grid
		// TODO fix when the building moves the shadow doesnt get reset
		var resource = this.castle.resources.get(name);
		var rotation = 0; // TODO if building need to rotated depending on the position

		var item = {
			id: id,
			image: resource.image,
			x: position.x,
			y: position.y,
			width: getPixelsize(resource.size.width),
			height: getPixelsize(resource.size.height),
			draggable: true,
			rotation: rotation,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: { x: 5, y: 5 },
			shadowOpacity: 0.6,
			startScale: 1
		};

		if (name === "keep") item.draggable = false;

		var building = new Konva.Image(item);

		//TODO no shadow if its moat

		this._layer.add(building);
		this.repaint();
	},

	findBuilding: function(id) {

		if (id.charAt(0) !== "#") {
			id = "#" + id;
		}

		var building = this._stage.find(id)[0];

		return building;
	},

	repaint: function() {
		//TODO make it update the Konva canvas when an building is added
		//console.log("repaint");
		this._stage.draw();
	},

	



	importData: function(text) {
		this.castle.importData(text);

		this.repaint();
	},

	clearData: function() {
		this.resetGridData();
		this.repaint();
	},

	resetGridData: function() {
		// set the keep
		this.addBuilding("keep", { x: 22 * 14, y: 22 * 14 });

		//this.castle._resetGridData();
	}

});
