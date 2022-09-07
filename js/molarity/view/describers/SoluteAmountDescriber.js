// Copyright 2019-2022, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about Solution.soluteAmountProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import molarity from '../../../molarity.js';
import MolarityStrings from '../../../MolarityStrings.js';
import MolarityConstants from '../../MolarityConstants.js';
import SolutionQuantityDescriber from './SolutionQuantityDescriber.js';

const beakerSoluteAmountPatternString = MolarityStrings.a11y.beaker.soluteAmountPattern;
const quantitativeSoluteAmountAndUnitPatternString = MolarityStrings.a11y.quantitative.soluteAmountAndUnitPattern;
const quantityChangeSoluteAmountChangedPatternString = MolarityStrings.a11y.quantityChange.soluteAmountChangedPattern;
const quantityChangeColorChangePatternString = MolarityStrings.a11y.quantityChange.colorChangePattern;
const qualitativeSoluteAmountStatePatternString = MolarityStrings.a11y.qualitative.soluteAmountStatePattern;

// solute amount regions capitalized strings
const soluteAmountRegionsNoString = MolarityStrings.a11y.soluteAmountRegions.no;
const soluteAmountRegionsATinyBitOfString = MolarityStrings.a11y.soluteAmountRegions.aTinyBitOf;
const soluteAmountRegionsALittleString = MolarityStrings.a11y.soluteAmountRegions.aLittle;
const soluteAmountRegionsSomeString = MolarityStrings.a11y.soluteAmountRegions.some;
const soluteAmountRegionsALotOfString = MolarityStrings.a11y.soluteAmountRegions.aLotOf;
const soluteAmountRegionsABunchOfString = MolarityStrings.a11y.soluteAmountRegions.aBunchOf;
const soluteAmountRegionsMaxAmountOfString = MolarityStrings.a11y.soluteAmountRegions.maxAmountOf;

// change strings
const lessCapitalizedString = MolarityStrings.a11y.less.capitalized;
const moreCapitalizedString = MolarityStrings.a11y.more.capitalized;
const quantityChangeLighterString = MolarityStrings.a11y.quantityChange.lighter;
const quantityChangeDarkerString = MolarityStrings.a11y.quantityChange.darker;

// constants
const SOLUTE_AMOUNT_STRINGS = [
  soluteAmountRegionsNoString,
  soluteAmountRegionsATinyBitOfString,
  soluteAmountRegionsALittleString,
  soluteAmountRegionsSomeString,
  soluteAmountRegionsABunchOfString,
  soluteAmountRegionsALotOfString,
  soluteAmountRegionsMaxAmountOfString
];

class SoluteAmountDescriber extends SolutionQuantityDescriber {

  /**
   * @param {Property.<number>} soluteAmountProperty - from model.
   * @param {SoluteDescriber} soluteDescriber
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
   */
  constructor( soluteAmountProperty, soluteDescriber, useQuantitativeDescriptionsProperty ) {
    super();

    // @private
    this.soluteAmountProperty = soluteAmountProperty;
    this.soluteDescriber = soluteDescriber;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

    // @private
    // {number} - the index of the descriptive region from SOLUTE_AMOUNT_STRINGS arrays.
    let currentRegion = soluteAmountToIndex( this.soluteAmountProperty.value );

    // @private
    // {boolean} - tracks whether the descriptive solute amount region has just changed.
    this.soluteAmountRegionChanged = false;

    // @private
    // {boolean|null} - tracks whether solute amount has just increased. null when simulation starts or resets.
    this.soluteAmountIncreased = null;

    this.soluteAmountProperty.link( ( newValue, oldValue ) => {
      assert && oldValue && assert( currentRegion === soluteAmountToIndex( oldValue ),
        'current solute amount region not tracking the previous region as expected' );
      const oldRegion = currentRegion;
      currentRegion = soluteAmountToIndex( newValue );
      this.soluteAmountRegionChanged = currentRegion !== oldRegion;
      this.soluteAmountIncreased = newValue > oldValue;
    } );
  }

  /**
   * Note: this getter name must be the same as its counterpart in VolumeDescriber
   * @public
   * @returns {boolean}
   * @override
   */
  getRegionChanged() {
    return this.soluteAmountRegionChanged;
  }

  /**
   * Creates a string that qualitatively or quantitatively describes the solute amount in the beaker.
   * @public
   * @returns {string} - e.g. 'contains a lot of potassium permanganate" or "contains 3.400 moles of drink mix"
   */
  getBeakerSoluteAmountString() {
    return StringUtils.fillIn( beakerSoluteAmountPatternString, {
      soluteAmount: this.getCurrentSoluteAmount(),
      solute: this.soluteDescriber.getCurrentSoluteName()
    } );
  }


  /**
   * Creates the substrings to describe the change in solute amount and the resulting change in solution color.
   * This function must have the same name as its counterpart in VolumeDescriber. This function should only be called
   * as a result of the soluteAmountProperty changing (hence usage of `this.soluteAmountIncreased`.
   * @public
   * @returns {StringsFromSliderChange} - contains two strings.
   * @override
   */
  getStringsFromSliderChange() {
    return {

      // "quantity" meaning "solute amount" here
      quantityChangeString: StringUtils.fillIn( quantityChangeSoluteAmountChangedPatternString, {
        moreLess: this.soluteAmountIncreased ? moreCapitalizedString : lessCapitalizedString
      } ),
      colorChangeString: StringUtils.fillIn( quantityChangeColorChangePatternString, {
        lighterDarker: this.soluteAmountIncreased ? quantityChangeDarkerString : quantityChangeLighterString
      } )
    };
  }

  /**
   * Gets the current value of soluteAmount either quantitatively or quantitatively to plug into descriptions.
   * Examples: "0.800 Moles" for quantitative or "A lot of" for qualitative
   * @param [isCapitalized] {boolean} - ignored if using quantitative descriptions
   * @public
   * @returns {string} - quantitative or qualitative description of current soluteAmount.
   */
  getCurrentSoluteAmount() {
    if ( this.useQuantitativeDescriptionsProperty.value ) {
      const soluteAmountMin = MolarityConstants.SOLUTE_AMOUNT_RANGE.min;
      const soluteAmountMax = MolarityConstants.SOLUTE_AMOUNT_RANGE.max;
      const clampedSoluteAmount = Utils.clamp( this.soluteAmountProperty.value, soluteAmountMin, soluteAmountMax );

      return StringUtils.fillIn( quantitativeSoluteAmountAndUnitPatternString, {
        soluteAmount: Utils.toFixed( clampedSoluteAmount, MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES )
      } );
    }
    else {
      return SOLUTE_AMOUNT_STRINGS[ soluteAmountToIndex( this.soluteAmountProperty.value ) ];

    }
  }

  /**
   * Generates the aria-value text for the solute amount slider
   * @public
   * @returns {string}
   */
  getSoluteAmountValueText() {
    return this.useQuantitativeDescriptionsProperty.value ?
           this.getCurrentSoluteAmount() :
           StringUtils.fillIn( qualitativeSoluteAmountStatePatternString, {
             soluteAmount: this.getCurrentSoluteAmount(),
             solute: this.soluteDescriber.getCurrentSoluteName()
           } );
  }
}


/**
 * Calculates which item to use from the SOLUTE_AMOUNT_STRINGS arrays. Region cutoff numbers are based on keypress
 * balances, which are documented here: https://github.com/phetsims/molarity/issues/128
 * @param {number} soluteAmount
 * @returns {number} - index (integer) to pull from SOLUTE_AMOUNT_STRINGS arrays.
 */
const soluteAmountToIndex = soluteAmount => {

  // normalize in case the range changes in the future.
  const normalizedSoluteAmount = MolarityConstants.SOLUTE_AMOUNT_RANGE.getNormalizedValue( soluteAmount );
  if ( normalizedSoluteAmount < 0.001 ) {
    return 0;
  }
  else if ( normalizedSoluteAmount <= 0.151 ) {
    return 1;
  }
  else if ( normalizedSoluteAmount <= 0.351 ) {
    return 2;
  }
  else if ( normalizedSoluteAmount <= 0.601 ) {
    return 3;
  }
  else if ( normalizedSoluteAmount <= 0.801 ) {
    return 4;
  }
  else if ( normalizedSoluteAmount <= 0.999 ) {
    return 5;
  }
  else {
    assert && assert( soluteAmount <= MolarityConstants.SOLUTE_AMOUNT_RANGE.max, 'unexpected solute amount provided' );
    return 6;
  }
};

molarity.register( 'SoluteAmountDescriber', SoluteAmountDescriber );
export default SoluteAmountDescriber;