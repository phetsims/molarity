// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model container for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'molarity' );
  var Color = require( 'SCENERY/util/Color' );
  var MStrings = require( 'molarity/MStrings' );
  var MSymbols = require( 'molarity/MSymbols' );
  var Range = require( 'DOT/Range' );
  var Solute = require( 'molarity/model/Solute' );
  var Solution = require( 'molarity/model/Solution' );
  var Water = require( 'molarity/model/Water' );

  function MolarityModel() {
    assert && assert( MolarityModel.SOLUTION_VOLUME_RANGE.min > 0 ); // model doesn't work for zero volume

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
      new Solute( MStrings.potassiumPermanganate, MSymbols.POTASSIUM_PERMANGANATE, 0.50, new Color( 255, 0, 255 ), new Color( 139, 0, 139 ), { particleColor: Color.BLACK } )
    ];

    thisModel.solution = new Solution( Water, thisModel.solutes[0], MolarityModel.SOLUTE_AMOUNT_RANGE.defaultValue, MolarityModel.SOLUTION_VOLUME_RANGE.defaultValue );

    // compute the max amount of precipitate, used by the view to create the precipitate particles
    var minSaturateConcentration = _.min( thisModel.solutes, function( solute ) {
      return solute.saturatedConcentration;
    } ).saturatedConcentration;
    thisModel.maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityModel.SOLUTION_VOLUME_RANGE.min, MolarityModel.SOLUTE_AMOUNT_RANGE.max, minSaturateConcentration );
  }

  // public constants
  MolarityModel.SOLUTE_AMOUNT_RANGE = new Range( 0, 1, 0.5 ); // moles
  MolarityModel.SOLUTION_VOLUME_RANGE = new Range( 0.2, 1, 0.5 ); // liters
  MolarityModel.CONCENTRATION_RANGE = new Range( MolarityModel.SOLUTE_AMOUNT_RANGE.min / MolarityModel.SOLUTION_VOLUME_RANGE.max, MolarityModel.SOLUTE_AMOUNT_RANGE.max / MolarityModel.SOLUTION_VOLUME_RANGE.min ); // M
  MolarityModel.CONCENTRATION_DISPLAY_RANGE = MolarityModel.CONCENTRATION_RANGE; // M

  MolarityModel.prototype = {

    // Resets all model elements
    reset: function() {
      this.solution.reset();
    },

    step: function( deltaSeconds ) {
      // no animation in this model
    }
  };

  return MolarityModel;
} );