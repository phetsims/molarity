// Copyright 2016-2018, University of Colorado Boulder

/**
 * Constants used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var molarity = require( 'MOLARITY/molarity' );
  var Range = require( 'DOT/Range' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  // constants
  var SOLUTE_AMOUNT_RANGE = new RangeWithValue( 0, 1, 0.5 ); // moles
  var SOLUTION_VOLUME_RANGE = new RangeWithValue( 0.2, 1, 0.5 ); // liters

  var MConstants = {

    // moles
    SOLUTE_AMOUNT_RANGE: SOLUTE_AMOUNT_RANGE,

    // liters
    SOLUTION_VOLUME_RANGE: SOLUTION_VOLUME_RANGE,

    // M
    CONCENTRATION_RANGE: new Range(
      SOLUTE_AMOUNT_RANGE.min / SOLUTION_VOLUME_RANGE.max,
      SOLUTE_AMOUNT_RANGE.max / SOLUTION_VOLUME_RANGE.min ),

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