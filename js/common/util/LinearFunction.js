// Copyright 2002-2013, University of Colorado

/**
 * Function for doing a linear mapping between ranges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Util = require( "DOT/Util" );

  /**
   * @param {Range} range1
   * @param {Range} range2
   * @param {Boolean} clamp clamp the result to the provided ranges
   * @constructor
   */
  function LinearFunction( range1, range2, clamp ) {

    clamp = _.isUndefined( clamp ) ? false : clamp;

    var thisFunction = this;

    // Maps from range1 to range2.
    thisFunction.evaluate = function( value ) {
      var output = -range1.min + value;
      output = output * range2.getLength() / range1.getLength();
      output = range2.min + output;
      if ( clamp ) {
        output = Util.clamp( output, range2.min, range2.max );
      }
      return output;
    };

    // Maps from range2 to range1.
    thisFunction.evaluateInverse = function( value ) {
      return new LinearFunction( range2, range1 ).evaluate( value );
    };
  }

  return LinearFunction;

} );