
// Copyright (c) 2015 Tejay.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var LandPanel = Class.extend({

	constructor: function(resources, target, dimension, gridOffset) {
		this.resources = resources;

		this._target = target;
		this._dimension = dimension || { width: 676, height: 676 };
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

	addBuilding: function(coord, buildingName, id, isSingleTile, update) {
		var building = this.create(buildingName.toLowerCase(), !isSingleTile, id);

		building.setPosition( Editor.getPosition(coord) );

		if (buildingName.toLowerCase() === "keep") {
			building.setAttr("draggable", false);
		}

		if (update !== false) {
			this.repaint();
		}
	},

	removeBuilding: function(id, update) {
		var building = this._findBuilding(id);

		if (building !== undefined) {
			building.destroy();
		}

		if (update !== false) {
			this.repaint();
		}
	},

	addBuildings: function(coords, buildingName, ids, isSingleTile) {
		var i, j;

		for (i = 0, j = coords.length; i < j; i++) {
			this.addBuilding(coords[i], buildingName, ids[i], isSingleTile, false);
		}

		if (coords.length > 0) {
			this.repaint();
		}
	},

	removeBuildings: function(ids) {
		var i, j;

		for (i = 0, j = ids.length; i < j; i++) {
			this.removeBuilding(ids[i], false);
		}

		if (ids.length > 0) {
			this.repaint();
		}
	},

	_findBuilding: function(id) {

		if (id.toString().charAt(0) !== "#") {
			id = "#" + id;
		}

		return this._stage.find(id)[0];
	},

	setPosition: function(shape, position) { shape.setPosition(position); },

	create: function(buildingName, shadow, id) {
		var resource = this.resources.get(buildingName.toLowerCase());
		var dimension = Editor.getPosition({
			x: resource.dimension.width,
			y: resource.dimension.height
		});

		if (id === undefined) {
			id = "limbo";
		}

		var item = {
			id: id,
			image: resource.image,
			width: dimension.x,
			height: dimension.y,
			draggable: true,
			rotation: 0,
			startScale: 1,
			buildingName: buildingName.toUpperCase()
		};

		if (shadow) {
			item.shapeshadowColor = 'black';
			item.shadowBlur = 10;
			item.shadowOffset = { x: 5, y: 5 };
			item.shadowOpacity = 0.6;
		}

		var shape = new Konva.Image(item);

		this._layer.add(shape);

		return shape;
	},

	remove: function(shape) { this.removeBuilding(shape.getAttr("id")); },

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

	repaint: function() { this._stage.children[0].batchDraw(); },

	getStage: function() { return this._stage; },

	getDimension: function() { return this._dimension; },

	getGridOffset: function() { return this._gridOffset; }
});
