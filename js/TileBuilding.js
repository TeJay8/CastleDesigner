
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

var TileBuilding = Class.extend({

	/**
	 * object that gets saved in the grid
	 *
	 * @method     constructor
	 * @param      {BuildingType}  buildingType  object with all the building data
	 * @param      {Number}        buildingId    id of the building saved in the grid and the landingPanel
	 */
	constructor: function(buildingType, buildingId) {
		this._buildingType = buildingType;
		this._buildingId = buildingId;
	},

	getBuildingType: function() { return this._buildingType; },

	getBuildingId: function() { return this._buildingId; },

	setBuildingId: function(buildingId) { this._buildingId = buildingId; },

	toString: function() { return this._buildingType.getOrdinal().substring(0, 2) + "," + this._buildingId; }
});
