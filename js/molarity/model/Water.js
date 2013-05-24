// Copyright 2002-2013, University of Colorado

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var MStrings = require( "molarity/MStrings" );

  return { formula: MStrings.water, color: new Color( 224, 255, 255 ) };
});