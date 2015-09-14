
$(document).ready(function() {
	// when adding to git ignore bower_packages

	// data of the buildings
	var data = {
		ballista_tower: {
			image: "images/ballista_tower.png",
			size: { width: 3, height: 3 },
			max: 10,
			gapRequired: false
		},
		great_tower: {
			image: "images/great_tower.png",
			size: { width: 5, height: 5 },
			max: -1,
			gapRequired: true
		},
		guard_house: {
			image: "images/guard_house.png",
			size: { width: 3, height: 3 },
			max: 38,
			gapRequired: false
		},
		keep: {
			image: "images/keep.png",
			size: { width: 8, height: 8 },
			max: -1,
			gapRequired: false
		},
		killing_pit: {
			image: "images/killing_pit.png",
			size: { width: 1, height: 1 },
			max: -1,
			gapRequired: false
		},
		large_tower: {
			image: "images/large_tower.png",
			size: { width: 4, height: 4 },
			max: -1,
			gapRequired: true
		},
		lookout_tower: {
			image: "images/lookout_tower.png",
			size: { width: 2, height: 2 },
			max: -1,
			gapRequired: true
		},
		moat: {
			image: "images/moat.png",
			size: { width: 1, height: 1 },
			max: 500,
			gapRequired: false
		},
		small_tower: {
			image: "images/small_tower.png",
			size: { width: 3, height: 3 },
			max: -1,
			gapRequired: true
		},
		smelter: {
			image: "images/smelter.png",
			size: { width: 4, height: 4 },
			max: -1,
			gapRequired: false
		},
		stone_gatehouse: {
			image: "images/stone_gatehouse.png",
			size: { width: 3, height: 3 },
			max: -1,
			gapRequired: true
		},
		stone_wall: {
			image: "images/stone_wall.png",
			size: { width: 1, height: 1 },
			max: -1,
			gapRequired: false
		},
		turret: {
			image: "images/turret.png",
			size: { width: 2, height: 2 },
			max: 10,
			gapRequired: false
		},
		wooden_gatehouse: {
			image: "images/wooden_gatehouse.png",
			size: { width: 3, height: 3 },
			max: -1,
			gapRequired: true
		},
		wooden_tower: {
			image: "images/wooden_tower.png",
			size: { width: 2, height: 2 },
			max: -1,
			gapRequired: false
		},
		wooden_wall: {
			image: "images/wooden_wall.png",
			size: { width: 1, height: 1 },
			max: -1,
			gapRequired: false
		}
	};

	// TODO build screen 728 pixels wide
	var resources = new Resources(data);

	// setting the buildings
	BuildingType.setter(resources);

	var castle = new Castle(resources);
	var editor = new Editor(castle, "container", $("#buildings"));
	
});
//Arcade Fire - Wake Up
//Band of Horses = No one gonna love you
//Dilly Dally - Desire
//Jamie T - Sticks 'n' Stones
//Modest Mouse - The ground Walks
//Phantogram - Fall In Love
//Radiohead = Just

var pixels = 13;

var getPixelsize = function(n) {
	return (n * pixels) + n - 1;
};
