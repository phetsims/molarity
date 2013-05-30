// Copyright 2002-2013, University of Colorado

/**
 * This function provides a predictable implementation of toFixed.
 * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
 * because the spec doesn't specify whether to round or floor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  "use strict";
  return function toFixed( number, precision ) {
    var multiplier = Math.pow( 10, precision );
    return Math.round( number * multiplier ) / multiplier;
  }
} );