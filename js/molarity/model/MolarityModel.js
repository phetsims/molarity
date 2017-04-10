// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model container for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var MSymbols = require( 'MOLARITY/molarity/MSymbols' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Solute = require( 'MOLARITY/molarity/model/Solute' );
  var Solution = require( 'MOLARITY/molarity/model/Solution' );
  var Water = require( 'MOLARITY/molarity/model/Water' );

  // strings
  var drinkMixString = require( 'string!MOLARITY/drinkMix' );
  var cobaltIINitrateString = require( 'string!MOLARITY/cobaltIINitrate' );
  var cobaltChlorideString = require( 'string!MOLARITY/cobaltChloride' );
  var potassiumDichromateString = require( 'string!MOLARITY/potassiumDichromate' );
  var goldIIIChlorideString = require( 'string!MOLARITY/goldIIIChloride' );
  var potassiumChromateString = require( 'string!MOLARITY/potassiumChromate' );
  var nickelIIChlorideString = require( 'string!MOLARITY/nickelIIChloride' );
  var copperSulfateString = require( 'string!MOLARITY/copperSulfate' );
  var potassiumPermanganateString = require( 'string!MOLARITY/potassiumPermanganate' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityModel( tandem ) {
    assert && assert( MolarityModel.SOLUTION_VOLUME_RANGE.min > 0 ); // model doesn't work for zero volume

    // @public
    this.solutes = [
      new Solute( drinkMixString, MSymbols.DRINK_MIX, 5.95, new Color( 255, 225, 225 ), Color.RED, tandem.createTandem( 'drinkMix' ) ),
      new Solute( cobaltIINitrateString, MSymbols.COBALT_II_NITRATE, 5.65, new Color( 255, 225, 225 ), Color.RED, tandem.createTandem( 'cobaltIINitrate' ) ),
      new Solute( cobaltChlorideString, MSymbols.COBALT_CHLORIDE, 4.35, new Color( 255, 242, 242 ), new Color( 255, 106, 106 ), tandem.createTandem( 'cobaltChloride' ) ),
      new Solute( potassiumDichromateString, MSymbols.POTASSIUM_DICHROMATE, 0.50, new Color( 255, 232, 210 ), new Color( 255, 127, 0 ), tandem.createTandem( 'potassiumDichromate' ) ),
      new Solute( goldIIIChlorideString, MSymbols.GOLD_III_CHLORIDE, 2.25, new Color( 255, 255, 199 ), new Color( 255, 215, 0 ), tandem.createTandem( 'goldIIIChloride' ) ),
      new Solute( potassiumChromateString, MSymbols.POTASSIUM_CHROMATE, 3.35, new Color( 255, 255, 199 ), Color.YELLOW, tandem.createTandem( 'potassiumChromate' ) ),
      new Solute( nickelIIChlorideString, MSymbols.NICKEL_II_CHLORIDE, 5.2, new Color( 234, 244, 234 ), new Color( 0, 128, 0 ), tandem.createTandem( 'nickelIIChloride' ) ),
      new Solute( copperSulfateString, MSymbols.COPPER_SULFATE, 1.40, new Color( 222, 238, 255 ), new Color( 30, 144, 255 ), tandem.createTandem( 'copperSulfate' ) ),
      new Solute( potassiumPermanganateString, MSymbols.POTASSIUM_PERMANGANATE, 0.50, new Color( 255, 0, 255 ), new Color( 139, 0, 139 ), tandem.createTandem( 'potassiumPermanganate' ), { particleColor: Color.BLACK } )
    ];

    // @public
    this.solution = new Solution( Water, this.solutes[ 0 ],
      MolarityModel.SOLUTE_AMOUNT_RANGE.defaultValue, MolarityModel.SOLUTION_VOLUME_RANGE.defaultValue,
      tandem.createTandem( 'solution' ) );

    // compute the max amount of precipitate, used by the view to create the precipitate particles
    var minSaturateConcentration = _.minBy( this.solutes, function( solute ) {
      return solute.saturatedConcentration;
    } ).saturatedConcentration;

    // @public
    this.maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityModel.SOLUTION_VOLUME_RANGE.min, MolarityModel.SOLUTE_AMOUNT_RANGE.max, minSaturateConcentration );
  }

  molarity.register( 'MolarityModel', MolarityModel );

  inherit( Object, MolarityModel, {

    // @public Resets all model elements
    reset: function() {
      this.solution.reset();
    }
  } );

  // @public constants
  MolarityModel.SOLUTE_AMOUNT_RANGE = new RangeWithValue( 0, 1, 0.5 ); // moles
  MolarityModel.SOLUTION_VOLUME_RANGE = new RangeWithValue( 0.2, 1, 0.5 ); // liters
  MolarityModel.CONCENTRATION_RANGE = new RangeWithValue( MolarityModel.SOLUTE_AMOUNT_RANGE.min / MolarityModel.SOLUTION_VOLUME_RANGE.max, MolarityModel.SOLUTE_AMOUNT_RANGE.max / MolarityModel.SOLUTION_VOLUME_RANGE.min ); // M
  MolarityModel.CONCENTRATION_DISPLAY_RANGE = MolarityModel.CONCENTRATION_RANGE; // M

  return MolarityModel;
} );