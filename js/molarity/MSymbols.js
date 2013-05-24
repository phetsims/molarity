// Copyright 2002-2013, University of Colorado

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ChemUtils = require( "common/util/ChemUtils" );
  var MStrings = require( "molarity/MStrings" );

  function MSymbols() {}

  MSymbols.COBALT_II_NITRATE = ChemUtils.toSubscript( "Co(NO3)2" );
  MSymbols.COBALT_CHLORIDE = ChemUtils.toSubscript( "CoCl2" );
  MSymbols.COPPER_SULFATE = ChemUtils.toSubscript( "CuSO4" );
  MSymbols.DRINK_MIX = MStrings.drinkMix;
  MSymbols.NICKEL_II_CHLORIDE = ChemUtils.toSubscript( "NiCl2" );
  MSymbols.POTASSIUM_CHROMATE = ChemUtils.toSubscript( "K2CrO4" );
  MSymbols.POTASSIUM_DICHROMATE = ChemUtils.toSubscript( "K2Cr2O7" );
  MSymbols.POTASSIUM_PERMANGANATE = ChemUtils.toSubscript( "KMnO4" );
  MSymbols.WATER = ChemUtils.toSubscript( "H2O" );

  return MSymbols;
} );