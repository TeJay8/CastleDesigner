
$(document).ready(function() {
	// data of the building
	var data = {
		ballista_tower: {
			buildTime: 18000,
			colour: "230,200,60",
			dimension: { width: 3, height: 3 },
			gapRequired: false,
			image: "images/ballista_tower.png",
			max: 10,
			resourceCosts: [ 0, 10000, 0, 0 ]
		},
		great_tower: {
			buildTime: 86400,
			colour: "200,200,200",
			dimension: { width: 5, height: 5 },
			gapRequired: true,
			image: "images/great_tower.png",
			max: -1,
			resourceCosts: [ 2500, 0, 0, 0 ]
		},
		guard_house: {
			buildTime: 10800,
			colour: "255,200,180",
			dimension: { width: 3, height: 3 },
			gapRequired: false,
			image: "images/guard_house.png",
			max: 38,
			resourceCosts: [ 0, 400, 0, 0 ]
		},
		keep: {
			buildTime: 0,
			colour: "0, 0, 0",
			dimension: { width: 8, height: 8 },
			gapRequired: false,
			image: "images/keep.png",
			max: 1,
			resourceCosts: [ 0, 0, 0, 0 ]
		},
		killing_pit: {
			buildTime: 3600,
			colour: "120,100,0",
			dimension: { width: 1, height: 1 },
			gapRequired: false,
			image: "images/killing_pit.png",
			max: -1,
			resourceCosts: [ 0, 0, 100, 0 ]
		},
		large_tower: {
			buildTime: 57600,
			colour: "200,200,200",
			dimension: { width: 4, height: 4 },
			gapRequired: true,
			image: "images/large_tower.png",
			max: -1,
			resourceCosts: [ 1500, 0, 0, 0 ]
		},
		lookout_tower: {
			buildTime: 14400,
			colour: "200,200,200",
			dimension: { width: 2, height: 2 },
			gapRequired: true,
			image: "images/lookout_tower.png",
			max: -1,
			resourceCosts: [ 300, 0, 0, 0 ]
		},
		moat: {
			buildTime: 900,
			colour: "0,200,255",
			dimension: { width: 1, height: 1 },
			gapRequired: false,
			image: "images/moat.png",
			max: 500,
			resourceCosts: [ 0, 0, 0, 20 ]
		},
		small_tower: {
			buildTime: 28800,
			colour: "200,200,200",
			dimension: { width: 3, height: 3 },
			gapRequired: true,
			image: "images/small_tower.png",
			max: -1,
			resourceCosts: [ 800, 0, 0, 0 ]
		},
		smelter: {
			buildTime: 21600,
			colour: "200,30,30",
			dimension: { width: 4, height: 4 },
			gapRequired: false,
			image: "images/smelter.png",
			max: -1,
			resourceCosts: [ 0, 0, 400, 0 ]
		},
		stone_gatehouse: {
			buildTime: 7200,
			colour: "100,100,100",
			dimension: { width: 3, height: 3 },
			gapRequired: true,
			image: "images/stone_gatehouse.png",
			max: -1,
			resourceCosts: [ 500, 0, 0, 0 ]
		},
		stone_wall: {
			buildTime: 900,
			colour: "230,230,230",
			dimension: { width: 1, height: 1 },
			gapRequired: false,
			image: "images/stone_wall.png",
			max: -1,
			resourceCosts: [ 100, 0, 0, 0 ]
		},
		turret: {
			buildTime: 14400,
			colour: "0,0,80",
			dimension: { width: 2, height: 2 },
			gapRequired: false,
			image: "images/turret.png",
			max: 10,
			resourceCosts: [ 2000, 0, 0, 0 ]
		},
		wooden_gatehouse: {
			buildTime: 3600,
			colour: "100,50,0",
			dimension: { width: 3, height: 3 },
			gapRequired: true,
			image: "images/wooden_gatehouse.png",
			max: -1,
			resourceCosts: [ 0, 200, 0, 0 ]
		},
		wooden_tower: {
			buildTime: 10800,
			colour: "125,58,0",
			dimension: { width: 2, height: 2 },
			gapRequired: false,
			image: "images/wooden_tower.png",
			max: -1,
			resourceCosts: [ 0, 200, 0, 0 ]
		},
		wooden_wall: {
			buildTime: 225,
			colour: "150,75,0",
			dimension: { width: 1, height: 1 },
			gapRequired: false,
			image: "images/wooden_wall.png",
			max: -1,
			resourceCosts: [ 0, 20, 0, 0 ]
		},
		eraser: {
			dimension: { width: 2, height: 2 },
			image: "images/eraser.png"
		}
	};
	var resources = new Resources(data);

	Building.set(resources);
	// TODO: css clean up
	// TODO: change the cursor: body, html { cursor: url(cursor.gif), pointer;
	// TODO: click and drag should be animated maybe add a bunch Images to the canvas off screen and the setPosition all of them.
	
	var editor = new Editor(resources, "container", "buildings");
});
