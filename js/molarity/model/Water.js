// Copyright 2013-2019, University of Colorado Boulder

/**
 * Water, as a solvent. Solvents have a formula and a color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolaritySymbols = require( 'MOLARITY/molarity/MolaritySymbols' );

  const Water = {
    formula: MolaritySymbols.WATER,
    color: new Color( 224, 255, 255 )
  };

  molarity.register( 'Water', Water );

  return Water;
} );