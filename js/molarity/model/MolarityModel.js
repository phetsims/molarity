// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model container for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringCasingPair from '../../../../scenery-phet/js/accessibility/StringCasingPair.js';
import { Color } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';
import MolarityConstants from '../MolarityConstants.js';
import MolaritySymbols from '../MolaritySymbols.js';
import Solute from './Solute.js';
import Solution from './Solution.js';
import Water from './Water.js';

const cobaltChlorideString = MolarityStrings.cobaltChloride;
const cobaltIINitrateString = MolarityStrings.cobaltIINitrate;
const copperSulfateString = MolarityStrings.copperSulfate;
const drinkMixString = MolarityStrings.drinkMix;
const goldIIIChlorideString = MolarityStrings.goldIIIChloride;
const nickelIIChlorideString = MolarityStrings.nickelIIChloride;
const potassiumChromateString = MolarityStrings.potassiumChromate;
const potassiumDichromateString = MolarityStrings.potassiumDichromate;
const potassiumPermanganateString = MolarityStrings.potassiumPermanganate;

// color strings
const soluteColorsLowercaseRedString = MolarityStrings.a11y.soluteColors.lowercase.red;
const soluteColorsLowercasePinkString = MolarityStrings.a11y.soluteColors.lowercase.pink;
const soluteColorsLowercaseOrangeString = MolarityStrings.a11y.soluteColors.lowercase.orange;
const soluteColorsLowercaseGoldString = MolarityStrings.a11y.soluteColors.lowercase.gold;
const soluteColorsLowercaseYellowString = MolarityStrings.a11y.soluteColors.lowercase.yellow;
const soluteColorsLowercaseGreenString = MolarityStrings.a11y.soluteColors.lowercase.green;
const soluteColorsLowercaseBlueString = MolarityStrings.a11y.soluteColors.lowercase.blue;
const soluteColorsLowercasePurpleString = MolarityStrings.a11y.soluteColors.lowercase.purple;

// capitalized color strings
const soluteColorsCapitalizedRedString = MolarityStrings.a11y.soluteColors.capitalized.red;
const soluteColorsCapitalizedPinkString = MolarityStrings.a11y.soluteColors.capitalized.pink;
const soluteColorsCapitalizedOrangeString = MolarityStrings.a11y.soluteColors.capitalized.orange;
const soluteColorsCapitalizedGoldString = MolarityStrings.a11y.soluteColors.capitalized.gold;
const soluteColorsCapitalizedYellowString = MolarityStrings.a11y.soluteColors.capitalized.yellow;
const soluteColorsCapitalizedGreenString = MolarityStrings.a11y.soluteColors.capitalized.green;
const soluteColorsCapitalizedPurpleString = MolarityStrings.a11y.soluteColors.capitalized.purple;
const soluteColorsCapitalizedBlueString = MolarityStrings.a11y.soluteColors.capitalized.blue;

// Lowercase solute name strings
const cobaltChlorideLowercaseString = MolarityStrings.a11y.cobaltChlorideLowercase;
const cobaltIINitrateLowercaseString = MolarityStrings.a11y.cobaltIINitrateLowercase;
const copperSulfateLowercaseString = MolarityStrings.a11y.copperSulfateLowercase;
const drinkMixLowercaseString = MolarityStrings.a11y.drinkMixLowercase;
const goldIIIChlorideLowercaseString = MolarityStrings.a11y.goldIIIChlorideLowercase;
const nickelIIChlorideLowercaseString = MolarityStrings.a11y.nickelIIChlorideLowercase;
const potassiumChromateLowercaseString = MolarityStrings.a11y.potassiumChromateLowercase;
const potassiumDichromateLowercaseString = MolarityStrings.a11y.potassiumDichromateLowercase;
const potassiumPermanganateLowercaseString = MolarityStrings.a11y.potassiumPermanganateLowercase;

// constants
const blueStringPair = new StringCasingPair( soluteColorsLowercaseBlueString, soluteColorsCapitalizedBlueString );
const redStringPair = new StringCasingPair( soluteColorsLowercaseRedString, soluteColorsCapitalizedRedString );
const pinkStringPair = new StringCasingPair( soluteColorsLowercasePinkString, soluteColorsCapitalizedPinkString );
const orangeStringPair = new StringCasingPair( soluteColorsLowercaseOrangeString, soluteColorsCapitalizedOrangeString );
const goldStringPair = new StringCasingPair( soluteColorsLowercaseGoldString, soluteColorsCapitalizedGoldString );
const yellowStringPair = new StringCasingPair( soluteColorsLowercaseYellowString, soluteColorsCapitalizedYellowString );
const greenStringPair = new StringCasingPair( soluteColorsLowercaseGreenString, soluteColorsCapitalizedGreenString );
const purpleStringPair = new StringCasingPair( soluteColorsLowercasePurpleString, soluteColorsCapitalizedPurpleString );

class MolarityModel {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
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
    const minSaturateConcentration = _.minBy( this.solutes, solute => solute.saturatedConcentration ).saturatedConcentration;

    // @public
    this.maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityConstants.SOLUTION_VOLUME_RANGE.min,
      MolarityConstants.SOLUTE_AMOUNT_RANGE.max, minSaturateConcentration );
  }


  // @public Resets all model elements
  reset() {
    this.resetInProgressProperty.set( true );
    this.solution.reset();
    this.resetInProgressProperty.set( false );
  }
}

molarity.register( 'MolarityModel', MolarityModel );

export default MolarityModel;