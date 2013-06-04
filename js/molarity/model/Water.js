// Copyright 2002-2013, University of Colorado

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var MSymbols = require( "molarity/MSymbols" );

  return { formula: MSymbols.WATER, color: new Color( 224, 255, 255 ) };
} );