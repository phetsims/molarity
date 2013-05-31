// Copyright 2002-2013, University of Colorado

/**
 * Universal chemical symbols, no i18n needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var toSubscript = require( "NITROGLYCERIN/ChemUtils" ).toSubscript;
  var MStrings = require( "molarity/MStrings" );

  function MSymbols() {}

  MSymbols.COBALT_II_NITRATE = toSubscript( "Co(NO3)2" );
  MSymbols.COBALT_CHLORIDE = toSubscript( "CoCl2" );
  MSymbols.COPPER_SULFATE = toSubscript( "CuSO4" );
  MSymbols.DRINK_MIX = MStrings.drinkMix;
  MSymbols.GOLD_III_CHLORIDE = toSubscript( "AuCl3" );
  MSymbols.NICKEL_II_CHLORIDE = toSubscript( "NiCl2" );
  MSymbols.POTASSIUM_CHROMATE = toSubscript( "K2CrO4" );
  MSymbols.POTASSIUM_DICHROMATE = toSubscript( "K2Cr2O7" );
  MSymbols.POTASSIUM_PERMANGANATE = toSubscript( "KMnO4" );
  MSymbols.WATER = toSubscript( "H2O" );

  return MSymbols;
} );