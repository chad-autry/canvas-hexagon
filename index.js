"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module cartesian-hexagonal
 */
 
/**
 * Relates a set of continuous cartesian coordinates to a set of discreet hexagons. Considering +x is right, +y is down (HTML5 canvas) then by default +u is 
 * is +y and +v is to the bottom right (along the line of x=y). See the [READ.md]{@link https://github.com/chad-autry/canvas-hexagon} on github for an explanation with a picture
 * @constructor
 * @param edgeSize { integer } - The number of pixels to a side. If odd the cartesian coordinates of the center of hexagons will be +0.5
 *        This is because HTML5 canvas coordinates lie between pixels. A result of this is even line widths will look sharper with event edgeSizes, 
 *        and odd lines widths will look sharper with odd edgeSizes
 * @param vScale { number } - The amount to scale by to provide an oblique perspective to the grid
 * @param {number} [rotation=0] - The clockwise rotation in radians of the hexagonal coordinates with respect to the cartesian
 * @param {integer} [edgeWidth=0] - The edgewidth of the hexagon, convenience for consuming applications, not used internally.
 * @example var hexDimensions = new (require(canvas-hexagon))(45, 0.5);
 */
 module.exports = function HexDefinition(edgeSize, vScale, rotation, edgeWidth) {
    //Protect the constructor from being called as a normal method
    if (!(this instanceof HexDefinition)) {
        return new HexDefinition(edgeSize, vScale);
    }

    /**
     * The provided edge size for a hex
     * @type {integer} 
     */
    this.edgeSize = edgeSize;
    
    /**
     * The provided vScale
     * @type {number} 
     */
    this.vScale = vScale;

    /**
     * The provided rotation of the coordinate system
     * @type {number} 
     */
    this.rotation = rotation;
    
    /**
     * The provided edge width for a hex
     * @type {integer} 
     */
    this.edgeWidth = edgeWidth;
    
    /**
     * The twiddle factor used to center hexes on whole numbers (even edgeSize) or in between whole numbers
     * @private
     * @type {0 | 0.5}
     */
    this.twiddle = (edgeSize % 2) ? 0.5 : 0; //0 if even, 0.5 if odd


    /**
     * The height of the triangles, if the hex were composed of a rectangle with triangles on top and bottom
     * @private
     * @type {integer}
     */
    this.h = Math.sin(30 * Math.PI / 180) * this.edgeSize; 
    
    /**
     * The width of the triangles, if the two previous triangles were actually composed of mirrored right angle triangles
     * @private
     * @type {integer}
     */
    this.r = Math.cos(30 * Math.PI / 180) * this.edgeSize;
    
    /**
     * Important value, will be added/subtracted from a Hex's center pixel co-ordinate to get 2 of the point co-ordinates
     * If edgeWidth is odd, we discount the center pixel (thus the "- this.twiddle" value)
     * The end result must be a whole number, so that the twiddle factor of the central co-ordinate remains when figuring out the point co-ordinates
     *
     * @type {integer} 
     */
    this.hexagon_half_wide_width = Math.round(this.vScale*(this.edgeSize/2 + this.h));
    
    this.hexagon_wide_width = 2 * this.hexagon_half_wide_width; //the vertical width (hex point up), will be used to calculate co-ord conversions. Needs to be accurate to our roundings above

    this.hexagon_edge_to_edge_width = 2 * Math.round(this.r); //We need this to be a whole, even number. Will be divided by 2 and added to the central co-ordinate
    this.hexagon_scaled_half_edge_size = Math.round(this.vScale * (this.edgeSize/2)); //Need this to be a whole number. Will be added to the central co-ordinate to figure a point
    
    /**
     * This is not a measurement of a single hex. It is the y distance of two adjacent hexes in different y rows when they are oriented horizontal up
     * Used for co-ordinate conversion
     * Could be calculated as this.edgeSize + h, but need it accurate to our other rounded values
     *
     * @type {integer} 
     */
    this.hexagon_narrow_width = this.hexagon_half_wide_width + this.hexagon_scaled_half_edge_size;  //
};

/**
 * Cartesian coordinates
 * @typedef {Object} CartesianCoordinates
 * @property {number} x - The x coordinate
 * @property {number} y - The y coordinate
 */

/**
 * Calculates the cartesian coordinates coresponding to the the center of a hexagon
 * @method getPixelCoordinates
 * @param {integer} u - The u coordinate of the hex
 * @param {integer} v - The v coordinate of the hex
 * @returns {module:canvas-hexagon~CartesianCoordinates}
 */
module.exports.prototype.getPixelCoordinates = function(u, v) {
    //values pre-scaled in the calculation above
    var y = this.hexagon_narrow_width * u + this.twiddle;

    //hexagon_edge_to_edge_width is a whole, even number. Dividing by 2 gives a whole number
    var x = this.hexagon_edge_to_edge_width * (u * 0.5 + v) + this.twiddle;

    return { x: x, y: y };
};

/**
 * Coordinates defining a particular hexagon in a hexagonal coordinate system
 * @typedef {Object} HexagonalCoordinates
 * @property {integer} u - The u coordinate of a hex
 * @property {integer} v - The v coordinate of a hex
 */

/**
 * Calculate the hexagonal coordinates corresponding to the given cartesian coordinates
 * @method getReferencePoint
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @returns {module:canvas-hexagon~HexagonalCoordinates}
 */
module.exports.prototype.getReferencePoint = function(x, y) {
    var u = Math.round(y / this.hexagon_narrow_width);
    var v = Math.round(x / this.hexagon_edge_to_edge_width - u * 0.5);
    return { u: u, v: v };
};