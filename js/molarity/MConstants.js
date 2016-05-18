// Copyright 2016, University of Colorado Boulder

/**
 * Constants used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var molarity = require( 'MOLARITY/molarity' );

  var MConstants = {

    // decimal places for solute amount, used in view
    SOLUTE_AMOUNT_DECIMAL_PLACES: 3,

    // decimal places for solution volume, used in view
    SOLUTION_VOLUME_DECIMAL_PLACES: 3,

    // decimal places for concentration, used in both model and view
    CONCENTRATION_DECIMAL_PLACES: 3,

    // decimal places for all min/max range values in the view
    RANGE_DECIMAL_PLACES: 1
  };

  molarity.register( 'MConstants', MConstants );

  return MConstants;
} );