// Copyright 2013-2019, University of Colorado Boulder

/**
 * Model container for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const MolaritySymbols = require( 'MOLARITY/molarity/MolaritySymbols' );
  const Solute = require( 'MOLARITY/molarity/model/Solute' );
  const Solution = require( 'MOLARITY/molarity/model/Solution' );
  const StringCasingPair = require( 'SCENERY_PHET/accessibility/StringCasingPair' );
  const Water = require( 'MOLARITY/molarity/model/Water' );

  // strings
  const cobaltChlorideString = require( 'string!MOLARITY/cobaltChloride' );
  const cobaltIINitrateString = require( 'string!MOLARITY/cobaltIINitrate' );
  const copperSulfateString = require( 'string!MOLARITY/copperSulfate' );
  const drinkMixString = require( 'string!MOLARITY/drinkMix' );
  const goldIIIChlorideString = require( 'string!MOLARITY/goldIIIChloride' );
  const nickelIIChlorideString = require( 'string!MOLARITY/nickelIIChloride' );
  const potassiumChromateString = require( 'string!MOLARITY/potassiumChromate' );
  const potassiumDichromateString = require( 'string!MOLARITY/potassiumDichromate' );
  const potassiumPermanganateString = require( 'string!MOLARITY/potassiumPermanganate' );

  // a11y strings
  // color strings
  const soluteColorsLowercaseRedString = MolarityA11yStrings.soluteColors.lowercase.red.value;
  const soluteColorsLowercasePinkString = MolarityA11yStrings.soluteColors.lowercase.pink.value;
  const soluteColorsLowercaseOrangeString = MolarityA11yStrings.soluteColors.lowercase.orange.value;
  const soluteColorsLowercaseGoldString = MolarityA11yStrings.soluteColors.lowercase.gold.value;
  const soluteColorsLowercaseYellowString = MolarityA11yStrings.soluteColors.lowercase.yellow.value;
  const soluteColorsLowercaseGreenString = MolarityA11yStrings.soluteColors.lowercase.green.value;
  const soluteColorsLowercaseBlueString = MolarityA11yStrings.soluteColors.lowercase.blue.value;
  const soluteColorsLowercasePurpleString = MolarityA11yStrings.soluteColors.lowercase.purple.value;

  // capitalized color strings
  const soluteColorsCapitalizedRedString = MolarityA11yStrings.soluteColors.capitalized.red.value;
  const soluteColorsCapitalizedPinkString = MolarityA11yStrings.soluteColors.capitalized.pink.value;
  const soluteColorsCapitalizedOrangeString = MolarityA11yStrings.soluteColors.capitalized.orange.value;
  const soluteColorsCapitalizedGoldString = MolarityA11yStrings.soluteColors.capitalized.gold.value;
  const soluteColorsCapitalizedYellowString = MolarityA11yStrings.soluteColors.capitalized.yellow.value;
  const soluteColorsCapitalizedGreenString = MolarityA11yStrings.soluteColors.capitalized.green.value;
  const soluteColorsCapitalizedPurpleString = MolarityA11yStrings.soluteColors.capitalized.purple.value;
  const soluteColorsCapitalizedBlueString = MolarityA11yStrings.soluteColors.capitalized.blue.value;

  // Lowercase solute name strings
  const cobaltChlorideLowercaseString = MolarityA11yStrings.cobaltChlorideLowercase.value;
  const cobaltIINitrateLowercaseString = MolarityA11yStrings.cobaltIINitrateLowercase.value;
  const copperSulfateLowercaseString = MolarityA11yStrings.copperSulfateLowercase.value;
  const drinkMixLowercaseString = MolarityA11yStrings.drinkMixLowercase.value;
  const goldIIIChlorideLowercaseString = MolarityA11yStrings.goldIIIChlorideLowercase.value;
  const nickelIIChlorideLowercaseString = MolarityA11yStrings.nickelIIChlorideLowercase.value;
  const potassiumChromateLowercaseString = MolarityA11yStrings.potassiumChromateLowercase.value;
  const potassiumDichromateLowercaseString = MolarityA11yStrings.potassiumDichromateLowercase.value;
  const potassiumPermanganateLowercaseString = MolarityA11yStrings.potassiumPermanganateLowercase.value;

  // constants
  const blueStringPair = new StringCasingPair( soluteColorsLowercaseBlueString, soluteColorsCapitalizedBlueString );
  const redStringPair = new StringCasingPair( soluteColorsLowercaseRedString, soluteColorsCapitalizedRedString );
  const pinkStringPair = new StringCasingPair( soluteColorsLowercasePinkString, soluteColorsCapitalizedPinkString );
  const orangeStringPair = new StringCasingPair( soluteColorsLowercaseOrangeString, soluteColorsCapitalizedOrangeString );
  const goldStringPair = new StringCasingPair( soluteColorsLowercaseGoldString, soluteColorsCapitalizedGoldString );
  const yellowStringPair = new StringCasingPair( soluteColorsLowercaseYellowString, soluteColorsCapitalizedYellowString );
  const greenStringPair = new StringCasingPair( soluteColorsLowercaseGreenString, soluteColorsCapitalizedGreenString );
  const purpleStringPair = new StringCasingPair( soluteColorsLowercasePurpleString, soluteColorsCapitalizedPurpleString );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function MolarityModel( tandem ) {
    assert && assert( MolarityConstants.SOLUTION_VOLUME_RANGE.min > 0 ); // model doesn't work for zero volume

    // @public
    this.solutes = [
      new Solute( drinkMixString, MolaritySymbols.DRINK_MIX, 5.95, new Color( 255, 225, 225 ), Color.RED,
        drinkMixLowercaseString, redStringPair, {
          tandem: tandem.createTandem( 'drinkMix' )
        } ),
      new Solute( cobaltIINitrateString, MolaritySymbols.COBALT_II_NITRATE, 5.65, new Color( 255, 225, 225 ),
        Color.RED, cobaltIINitrateLowercaseString, redStringPair, {
          tandem: tandem.createTandem( 'cobaltIINitrate' )
        } ),
      new Solute( cobaltChlorideString, MolaritySymbols.COBALT_CHLORIDE, 4.35, new Color( 255, 242, 242 ),
        new Color( 255, 106, 106 ), cobaltChlorideLowercaseString, pinkStringPair, {
          tandem: tandem.createTandem( 'cobaltChloride' )
        } ),
      new Solute( potassiumDichromateString, MolaritySymbols.POTASSIUM_DICHROMATE, 0.50, new Color( 255, 232, 210 ),
        new Color( 255, 127, 0 ), potassiumDichromateLowercaseString, orangeStringPair, {
          tandem: tandem.createTandem( 'potassiumDichromate' )
        } ),
      new Solute( goldIIIChlorideString, MolaritySymbols.GOLD_III_CHLORIDE, 2.25, new Color( 255, 255, 199 ),
        new Color( 255, 215, 0 ), goldIIIChlorideLowercaseString, goldStringPair, {
          tandem: tandem.createTandem( 'goldIIIChloride' )
        } ),
      new Solute( potassiumChromateString, MolaritySymbols.POTASSIUM_CHROMATE, 3.35, new Color( 255, 255, 199 ),
        Color.YELLOW, potassiumChromateLowercaseString, yellowStringPair, {
          tandem: tandem.createTandem( 'potassiumChromate' )
        } ),
      new Solute( nickelIIChlorideString, MolaritySymbols.NICKEL_II_CHLORIDE, 5.2, new Color( 234, 244, 234 ),
        new Color( 0, 128, 0 ), nickelIIChlorideLowercaseString, greenStringPair, {
          tandem: tandem.createTandem( 'nickelIIChloride' )
        } ),
      new Solute( copperSulfateString, MolaritySymbols.COPPER_SULFATE, 1.40, new Color( 222, 238, 255 ),
        new Color( 30, 144, 255 ), copperSulfateLowercaseString, blueStringPair, {
          tandem: tandem.createTandem( 'copperSulfate' )
        } ),
      new Solute( potassiumPermanganateString, MolaritySymbols.POTASSIUM_PERMANGANATE, 0.50, new Color( 255, 0, 255 ),
        new Color( 139, 0, 139 ), potassiumPermanganateLowercaseString, purpleStringPair, {
          tandem: tandem.createTandem( 'potassiumPermanganate' ),
          particleColor: Color.BLACK
        } )
    ];

    // @public
    this.solution = new Solution( Water, this.solutes[ 0 ],
      MolarityConstants.SOLUTE_AMOUNT_RANGE.defaultValue, MolarityConstants.SOLUTION_VOLUME_RANGE.defaultValue,
      tandem.createTandem( 'solution' ) );

    // @public (read-only) BooleanProperty
    this.resetInProgressProperty = new BooleanProperty( false );

    // compute the max amount of precipitate, used by the view to create the precipitate particles
    const minSaturateConcentration = _.minBy( this.solutes, function( solute ) {
      return solute.saturatedConcentration;
    } ).saturatedConcentration;

    // @public
    this.maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityConstants.SOLUTION_VOLUME_RANGE.min,
      MolarityConstants.SOLUTE_AMOUNT_RANGE.max, minSaturateConcentration );
  }

  molarity.register( 'MolarityModel', MolarityModel );

  inherit( Object, MolarityModel, {

    // @public Resets all model elements
    reset: function() {
      this.resetInProgressProperty.set( true );
      this.solution.reset();
      this.resetInProgressProperty.set( false );
    }
  } );

  return MolarityModel;
} );
