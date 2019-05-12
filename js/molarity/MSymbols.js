// Copyright 2013-2017, University of Colorado Boulder

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  var molarity = require( 'MOLARITY/molarity' );

  // strings
  var drinkMixString = require( 'string!MOLARITY/drinkMix' );

  // constants
  var toSubscript = ChemUtils.toSubscript;

  var MSymbols = {
    COBALT_II_NITRATE: toSubscript( 'Co(NO3)2' ),
    COBALT_CHLORIDE: toSubscript( 'CoCl2' ),
    COPPER_SULFATE: toSubscript( 'CuSO4' ),
    DRINK_MIX: drinkMixString,
    GOLD_III_CHLORIDE: toSubscript( 'AuCl3' ),
    NICKEL_II_CHLORIDE: toSubscript( 'NiCl2' ),
    POTASSIUM_CHROMATE: toSubscript( 'K2CrO4' ),
    POTASSIUM_DICHROMATE: toSubscript( 'K2Cr2O7' ),
    POTASSIUM_PERMANGANATE: toSubscript( 'KMnO4' ),
    WATER: toSubscript( 'H2O' ),
    CITRIC_ACID: toSubscript( 'C6H8O7' )
  };

  molarity.register( 'MSymbols', MSymbols );

  return MSymbols;
} );