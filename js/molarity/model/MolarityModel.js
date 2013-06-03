// Copyright 2002-2013, University of Colorado

/**
 * Model container for the "Molarity" tab.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var assert = require( "ASSERT/assert" )( "molarity" );
  var Color = require( "SCENERY/util/Color" );
  var MStrings = require( "molarity/MStrings" );
  var MSymbols = require( "molarity/MSymbols" );
  var Range = require( "DOT/Range" );
  var Solute = require( "molarity/model/Solute" );
  var Solution = require( "molarity/model/Solution" );
  var Water = require( "molarity/model/Water" );

  // constants
  var SOLUTE_AMOUNT_RANGE = new Range( 0, 1, 0.5 ); // moles
  var SOLUTION_VOLUME_RANGE = new Range( 0.2, 1, 0.5 ); // liters
  var CONCENTRATION_RANGE = new Range( SOLUTE_AMOUNT_RANGE.min / SOLUTION_VOLUME_RANGE.max, SOLUTE_AMOUNT_RANGE.max / SOLUTION_VOLUME_RANGE.min ); // M
  var CONCENTRATION_DISPLAY_RANGE = CONCENTRATION_RANGE; // M

  function MolarityModel() {
    assert && assert( SOLUTION_VOLUME_RANGE.min > 0 ); // model doesn't work for zero volume

    var thisModel = this;

    thisModel.solutes = [
      new Solute( MStrings.drinkMix, MSymbols.DRINK_MIX, 5.95, new Color( 255, 225, 225 ), Color.RED ),
      new Solute( MStrings.cobaltIINitrate, MSymbols.COBALT_II_NITRATE, 5.65, new Color( 255, 225, 225 ), Color.RED ),
      new Solute( MStrings.cobaltChloride, MSymbols.COBALT_CHLORIDE, 4.35, new Color( 255, 242, 242 ), new Color( 255, 106, 106 ) ),
      new Solute( MStrings.potassiumDichromate, MSymbols.POTASSIUM_DICHROMATE, 0.50, new Color( 255, 232, 210 ), new Color( 255, 127, 0 ) ),
      new Solute( MStrings.goldIIIChloride, MSymbols.GOLD_III_CHLORIDE, 2.25, new Color( 255, 255, 199 ), new Color( 255, 215, 0 ) ),
      new Solute( MStrings.potassiumChromate, MSymbols.POTASSIUM_CHROMATE, 3.35, new Color( 255, 255, 199 ), Color.YELLOW ),
      new Solute( MStrings.nickelIIChloride, MSymbols.NICKEL_II_CHLORIDE, 5.2, new Color( 234, 244, 234 ), new Color( 0, 128, 0 ) ),
      new Solute( MStrings.copperSulfate, MSymbols.COPPER_SULFATE, 1.40, new Color( 222, 238, 255 ), new Color( 30, 144, 255 ) ),
      new Solute( MStrings.potassiumPermanganate, MSymbols.POTASSIUM_PERMANGANATE, 0.50, new Color( 255, 0, 255 ), new Color( 139, 0, 139 ), Color.BLACK )
    ];

    thisModel.solution = new Solution( Water, thisModel.solutes[0], SOLUTE_AMOUNT_RANGE.defaultValue, SOLUTION_VOLUME_RANGE.defaultValue );
  }

  // Resets all model elements
  MolarityModel.prototype.reset = function() {
    this.solution.reset();
  };

  MolarityModel.prototype.step = function( deltaSeconds ) {
    // no animation in this model
  };

  MolarityModel.prototype.getSoluteAmountRange = function() {
    return SOLUTE_AMOUNT_RANGE;
  };

  MolarityModel.prototype.getSolutionVolumeRange = function() {
    return SOLUTION_VOLUME_RANGE;
  };

  MolarityModel.prototype.getConcentrationRange = function() {
    return CONCENTRATION_RANGE;
  };

  // Range to use for concentration display, possibly different than full range of model.
  MolarityModel.prototype.getConcentrationDisplayRange = function() {
    return CONCENTRATION_DISPLAY_RANGE;
  };

  return MolarityModel;
} );