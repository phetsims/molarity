// Copyright 2002-2013, University of Colorado

/**
 * Color utilities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var Util = require( "DOT/Util" );

  function ColorUtils() {}

  /**
   * Interpolates between 2 colors in RGBA space. When distance is 0, color1
   * is returned. When distance is 1, color2 is returned. Other values of
   * distance return a color somewhere between color1 and color2. Each color
   * component is interpolated separately.
   *
   * @param {Color} color1
   * @param {Color} color2
   * @param {Number} distance distance between color1 and color2, 0 <= distance <= 1
   */
  ColorUtils.interpolateRBGA = function( color1, color2, distance ) {
    if ( distance < 0 || distance > 1 ) {
      throw new Error( "distance must be between 0 and 1: " + distance );
    }
    var r = Math.round( Util.linear( 0, color1.r, 1, color2.r, distance ) );
    var g = Math.round( Util.linear( 0, color1.g, 1, color2.g, distance ) );
    var b = Math.round( Util.linear( 0, color1.b, 1, color2.b, distance ) );
    var a = Util.linear( 0, color1.a, 1, color2.a, distance );
    return new Color( r, g, b, a );
  };

  return ColorUtils;
} );
