// Copyright 2013-2019, University of Colorado Boulder

/**
 * Model container for the 'Molarity' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import StringCasingPair from '../../../../scenery-phet/js/accessibility/StringCasingPair.js';
import Color from '../../../../scenery/js/util/Color.js';
import molarityStrings from '../../molarity-strings.js';
import molarity from '../../molarity.js';
import MolarityConstants from '../MolarityConstants.js';
import MolaritySymbols from '../MolaritySymbols.js';
import Solute from './Solute.js';
import Solution from './Solution.js';
import Water from './Water.js';

const cobaltChlorideString = molarityStrings.cobaltChloride;
const cobaltIINitrateString = molarityStrings.cobaltIINitrate;
const copperSulfateString = molarityStrings.copperSulfate;
const drinkMixString = molarityStrings.drinkMix;
const goldIIIChlorideString = molarityStrings.goldIIIChloride;
const nickelIIChlorideString = molarityStrings.nickelIIChloride;
const potassiumChromateString = molarityStrings.potassiumChromate;
const potassiumDichromateString = molarityStrings.potassiumDichromate;
const potassiumPermanganateString = molarityStrings.potassiumPermanganate;

// a11y strings
// color strings
const soluteColorsLowercaseRedString = molarityStrings.a11y.soluteColors.lowercase.red;
const soluteColorsLowercasePinkString = molarityStrings.a11y.soluteColors.lowercase.pink;
const soluteColorsLowercaseOrangeString = molarityStrings.a11y.soluteColors.lowercase.orange;
const soluteColorsLowercaseGoldString = molarityStrings.a11y.soluteColors.lowercase.gold;
const soluteColorsLowercaseYellowString = molarityStrings.a11y.soluteColors.lowercase.yellow;
const soluteColorsLowercaseGreenString = molarityStrings.a11y.soluteColors.lowercase.green;
const soluteColorsLowercaseBlueString = molarityStrings.a11y.soluteColors.lowercase.blue;
const soluteColorsLowercasePurpleString = molarityStrings.a11y.soluteColors.lowercase.purple;

// capitalized color strings
const soluteColorsCapitalizedRedString = molarityStrings.a11y.soluteColors.capitalized.red;
const soluteColorsCapitalizedPinkString = molarityStrings.a11y.soluteColors.capitalized.pink;
const soluteColorsCapitalizedOrangeString = molarityStrings.a11y.soluteColors.capitalized.orange;
const soluteColorsCapitalizedGoldString = molarityStrings.a11y.soluteColors.capitalized.gold;
const soluteColorsCapitalizedYellowString = molarityStrings.a11y.soluteColors.capitalized.yellow;
const soluteColorsCapitalizedGreenString = molarityStrings.a11y.soluteColors.capitalized.green;
const soluteColorsCapitalizedPurpleString = molarityStrings.a11y.soluteColors.capitalized.purple;
const soluteColorsCapitalizedBlueString = molarityStrings.a11y.soluteColors.capitalized.blue;

// Lowercase solute name strings
const cobaltChlorideLowercaseString = molarityStrings.a11y.cobaltChlorideLowercase;
const cobaltIINitrateLowercaseString = molarityStrings.a11y.cobaltIINitrateLowercase;
const copperSulfateLowercaseString = molarityStrings.a11y.copperSulfateLowercase;
const drinkMixLowercaseString = molarityStrings.a11y.drinkMixLowercase;
const goldIIIChlorideLowercaseString = molarityStrings.a11y.goldIIIChlorideLowercase;
const nickelIIChlorideLowercaseString = molarityStrings.a11y.nickelIIChlorideLowercase;
const potassiumChromateLowercaseString = molarityStrings.a11y.potassiumChromateLowercase;
const potassiumDichromateLowercaseString = molarityStrings.a11y.potassiumDichromateLowercase;
const potassiumPermanganateLowercaseString = molarityStrings.a11y.potassiumPermanganateLowercase;

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

export default MolarityModel;