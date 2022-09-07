// Copyright 2019-2022, University of Colorado Boulder

/**
 * VolumeDescriber is responsible for generating strings about Solution.volumeProperty.
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

const quantitativeHasVolumePatternString = MolarityStrings.a11y.quantitative.hasVolumePattern;
const quantityChangeColorChangePatternString = MolarityStrings.a11y.quantityChange.colorChangePattern;
const qualitativeVolumeStatePatternString = MolarityStrings.a11y.qualitative.volumeStatePattern;
const quantitativeSolutionVolumeAndUnitPatternString = MolarityStrings.a11y.quantitative.solutionVolumeAndUnitPattern;
const quantityChangeVolumeChangePatternString = MolarityStrings.a11y.quantityChange.volumeChangePattern;

// volume regions strings
const volumeRegionsPassiveFullString = MolarityStrings.a11y.volumeRegions.passive.full;
const volumeRegionsPassiveHalfFullString = MolarityStrings.a11y.volumeRegions.passive.halfFull;
const volumeRegionsPassiveNearlyEmptyString = MolarityStrings.a11y.volumeRegions.passive.nearlyEmpty;
const volumeRegionsPassiveNearlyFullString = MolarityStrings.a11y.volumeRegions.passive.nearlyFull;
const volumeRegionsPassiveOverHalfFullString = MolarityStrings.a11y.volumeRegions.passive.overHalfFull;
const volumeRegionsPassiveUnderHalfFullString = MolarityStrings.a11y.volumeRegions.passive.underHalfFull;
const volumeRegionsPassiveAtLowestAmountString = MolarityStrings.a11y.volumeRegions.passive.atLowestAmount;

// volume active regions strings
const volumeRegionsActiveIsFullString = MolarityStrings.a11y.volumeRegions.active.isFull;
const volumeRegionsActiveIsNearlyFullString = MolarityStrings.a11y.volumeRegions.active.isNearlyFull;
const volumeRegionsActiveIsOverHalfFullString = MolarityStrings.a11y.volumeRegions.active.isOverHalfFull;
const volumeRegionsActiveIsHalfFullString = MolarityStrings.a11y.volumeRegions.active.isHalfFull;
const volumeRegionsActiveIsUnderHalfFullString = MolarityStrings.a11y.volumeRegions.active.isUnderHalfFull;
const volumeRegionsActiveIsAtLowestAmountString = MolarityStrings.a11y.volumeRegions.active.isAtLowestAmount;
const volumeRegionsActiveIsNearlyEmptyString = MolarityStrings.a11y.volumeRegions.active.isNearlyEmpty;

// change strings
const lessCapitalizedString = MolarityStrings.a11y.less.capitalized;
const moreCapitalizedString = MolarityStrings.a11y.more.capitalized;
const quantityChangeLighterString = MolarityStrings.a11y.quantityChange.lighter;
const quantityChangeDarkerString = MolarityStrings.a11y.quantityChange.darker;

// constants
const VOLUME_STRINGS = [
  volumeRegionsPassiveAtLowestAmountString,
  volumeRegionsPassiveNearlyEmptyString,
  volumeRegionsPassiveUnderHalfFullString,
  volumeRegionsPassiveHalfFullString,
  volumeRegionsPassiveOverHalfFullString,
  volumeRegionsPassiveNearlyFullString,
  volumeRegionsPassiveFullString
];

const VOLUME_ACTIVE_STRINGS = [
  volumeRegionsActiveIsAtLowestAmountString,
  volumeRegionsActiveIsNearlyEmptyString,
  volumeRegionsActiveIsUnderHalfFullString,
  volumeRegionsActiveIsHalfFullString,
  volumeRegionsActiveIsOverHalfFullString,
  volumeRegionsActiveIsNearlyFullString,
  volumeRegionsActiveIsFullString
];

class VolumeDescriber extends SolutionQuantityDescriber {

  /**
   * @param {Property.<number>} volumeProperty - the volume of the solution
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
   */
  constructor( volumeProperty, useQuantitativeDescriptionsProperty ) {
    super();

    // @private
    this.volumeProperty = volumeProperty;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

    // @private
    // {number} - the index of the descriptive region from VOLUME_STRINGS array.
    let currentRegion = volumeToIndex( this.volumeProperty.value );

    // @private
    // {boolean} - tracks whether the descriptive volume region has just changed.
    this.volumeRegionChanged = false;

    // @private
    // {boolean|null} - tracks whether volume has just increased or decreased. null when simulation starts or resets.
    this.volumeIncreased = null;

    this.volumeProperty.link( ( newValue, oldValue ) => {
      assert && oldValue && assert( currentRegion === volumeToIndex( oldValue ),
        'current volume region not tracking the previous region as expected' );
      const oldRegion = currentRegion;
      currentRegion = volumeToIndex( newValue );
      this.volumeRegionChanged = currentRegion !== oldRegion;
      this.volumeIncreased = newValue > oldValue;
    } );
  }

  /**
   * Note: this getter name must be the same as its counterpart in SoluteAmountDescriber
   * @public
   * @returns {boolean}
   * @override
   */
  getRegionChanged() {
    return this.volumeRegionChanged;
  }

  /**
   * Gets the current value of volume either quantitatively or quantitatively to put into descriptions.
   * @param {boolean} [isActive]
   * @public
   * @returns {string} - examples: "1.500 Liters" for quantitative or "half full" for qualitative.
   */
  getCurrentVolume( isActive = false ) {
    const volumeIndex = volumeToIndex( this.volumeProperty.value );
    if ( this.useQuantitativeDescriptionsProperty.value ) {
      const quantitativeString = isActive ? quantitativeHasVolumePatternString : quantitativeSolutionVolumeAndUnitPatternString;
      return StringUtils.fillIn( quantitativeString, {
        volume: Utils.toFixed( this.volumeProperty.value, MolarityConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
      } );
    }
    else if ( isActive ) {
      return VOLUME_ACTIVE_STRINGS[ volumeIndex ];
    }
    else {
      return VOLUME_STRINGS[ volumeIndex ];
    }
  }

  /**
   * Creates the substrings to describe the change in volume and the resulting change in solution color.
   * This function must have the same name as its counterpart in VolumeDescriber. This function should only be called
   * as a result of the volumeProperty changing (hence usage of `this.volumeIncreased`.
   * @public
   * @returns {StringsFromSliderChange} - contains two strings.
   * @override
   */
  getStringsFromSliderChange() {
    return {

      // "quantity" meaning "volume" here
      quantityChangeString: StringUtils.fillIn( quantityChangeVolumeChangePatternString, {
        moreLess: this.volumeIncreased ? moreCapitalizedString : lessCapitalizedString
      } ),
      colorChangeString: StringUtils.fillIn( quantityChangeColorChangePatternString, {
        lighterDarker: this.volumeIncreased ? quantityChangeLighterString : quantityChangeDarkerString
      } )
    };
  }

  /**
   * Generates the aria-valuetext for the volume slider.
   * @public
   * @returns {string}
   */
  getVolumeAriaValueText() {
    return this.useQuantitativeDescriptionsProperty.value ?
           this.getCurrentVolume() :
           StringUtils.fillIn( qualitativeVolumeStatePatternString, {
             volume: this.getCurrentVolume()
           } );
  }
}

/**
 * Calculates which item to use from the VOLUME_STRINGS array. Region cutoff numbers are based on keypress balances,
 * which are documented here: https://github.com/phetsims/molarity/issues/128
 * @param {number} volume
 * @returns {number} - index to pull from VOLUME_STRINGS array.
 */
const volumeToIndex = volume => {

  // normalize in case the range changes in the future.
  const normalizedVolume = MolarityConstants.SOLUTION_VOLUME_RANGE.getNormalizedValue( volume );
  if ( normalizedVolume <= 0.00125 ) {
    return 0;
  }
  else if ( normalizedVolume <= 0.18625 ) {
    return 1;
  }
  else if ( normalizedVolume <= 0.37375 ) {
    return 2;
  }
  else if ( normalizedVolume <= 0.37625 ) {
    return 3;
  }
  else if ( normalizedVolume <= 0.74875 ) {
    return 4;
  }
  else if ( normalizedVolume <= 0.99875 ) {
    return 5;
  }
  else {
    assert && assert( volume <= MolarityConstants.SOLUTION_VOLUME_RANGE.max, 'unexpected volume provided' );
    return 6;
  }
};

molarity.register( 'VolumeDescriber', VolumeDescriber );
export default VolumeDescriber;