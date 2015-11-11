// Copyright 2013-2015, University of Colorado Boulder

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var molarity = require( 'MOLARITY/molarity' );
  var MSymbols = require( 'MOLARITY/molarity/MSymbols' );

  var Water = {
    formula: MSymbols.WATER,
    color: new Color( 224, 255, 255 )
  };

  molarity.register( 'Water', Water );

  return Water;
} );