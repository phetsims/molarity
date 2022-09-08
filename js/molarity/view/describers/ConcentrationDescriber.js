// Copyright 2019-2022, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for formulating  strings about Solution.concentrationProperty. This includes
 * descriptions set in the PDOM, as well as context responses set through UtteranceQueue.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import molarity from '../../../molarity.js';
import MolarityStrings from '../../../MolarityStrings.js';
import MolarityConstants from '../../MolarityConstants.js';

const quantityChangeColorChangePatternString = MolarityStrings.a11y.quantityChange.colorChangePattern;
const quantitativeConcentrationAndUnitString = MolarityStrings.a11y.quantitative.concentrationAndUnit;
const quantityChangeConcentrationChangePatternString = MolarityStrings.a11y.quantityChange.concentrationChangePattern;
const beakerConcentrationRangePatternString = MolarityStrings.a11y.beaker.concentrationRangePattern;
const qualitativeConcentrationStateClausePatternString = MolarityStrings.a11y.qualitative.concentrationStateClausePattern;
const quantitativeConcentrationStatePatternString = MolarityStrings.a11y.quantitative.concentrationStatePattern;

// Concentration region strings
const concentrationRegionsPassiveZeroConcentrationString = MolarityStrings.a11y.concentrationRegions.passive.zeroConcentration;
const concentrationRegionsPassiveLowConcentrationString = MolarityStrings.a11y.concentrationRegions.passive.lowConcentration;
const concentrationRegionsPassiveSlightlyConcentratedString = MolarityStrings.a11y.concentrationRegions.passive.slightlyConcentrated;
const concentrationRegionsPassiveNotVeryConcentratedString = MolarityStrings.a11y.concentrationRegions.passive.notVeryConcentrated;
const concentrationRegionsPassiveVeryConcentratedString = MolarityStrings.a11y.concentrationRegions.passive.veryConcentrated;
const concentrationRegionsPassiveHighlyConcentratedString = MolarityStrings.a11y.concentrationRegions.passive.highlyConcentrated;
const concentrationRegionsPassiveMaxConcentrationString = MolarityStrings.a11y.concentrationRegions.passive.maxConcentration;

// Concentration active region strings
const concentrationRegionsActiveHasZeroConcentrationString = MolarityStrings.a11y.concentrationRegions.active.hasZeroConcentration;
const concentrationRegionsActiveHasLowConcentrationString = MolarityStrings.a11y.concentrationRegions.active.hasLowConcentration;
const concentrationRegionsActiveIsSlightlyConcentratedString = MolarityStrings.a11y.concentrationRegions.active.isSlightlyConcentrated;
const concentrationRegionsActiveIsNotVeryConcentratedString = MolarityStrings.a11y.concentrationRegions.active.isNotVeryConcentrated;
const concentrationRegionsActiveIsVeryConcentratedString = MolarityStrings.a11y.concentrationRegions.active.isVeryConcentrated;
const concentrationRegionsActiveIsHighlyConcentratedString = MolarityStrings.a11y.concentrationRegions.active.isHighlyConcentrated;
const concentrationRegionsActiveHasMaxConcentrationString = MolarityStrings.a11y.concentrationRegions.active.hasMaxConcentration;

// Change strings
const lessCapitalizedString = MolarityStrings.a11y.less.capitalized;
const lessLowercaseString = MolarityStrings.a11y.less.lowercase;
const moreCapitalizedString = MolarityStrings.a11y.more.capitalized;
const moreLowercaseString = MolarityStrings.a11y.more.lowercase;
const quantityChangeLighterString = MolarityStrings.a11y.quantityChange.lighter;
const quantityChangeDarkerString = MolarityStrings.a11y.quantityChange.darker;

// constants
const ACTIVE_CONCENTRATION_STRINGS = [
  concentrationRegionsActiveHasZeroConcentrationString,
  concentrationRegionsActiveHasLowConcentrationString,
  concentrationRegionsActiveIsSlightlyConcentratedString,
  concentrationRegionsActiveIsNotVeryConcentratedString,
  concentrationRegionsActiveIsVeryConcentratedString,
  concentrationRegionsActiveIsHighlyConcentratedString,
  concentrationRegionsActiveHasMaxConcentrationString
];

const CONCENTRATION_STRINGS = [
  concentrationRegionsPassiveZeroConcentrationString,
  concentrationRegionsPassiveLowConcentrationString,
  concentrationRegionsPassiveSlightlyConcentratedString,
  concentrationRegionsPassiveNotVeryConcentratedString,
  concentrationRegionsPassiveVeryConcentratedString,
  concentrationRegionsPassiveHighlyConcentratedString,
  concentrationRegionsPassiveMaxConcentrationString
];

class ConcentrationDescriber {

  /**
   * @param {MacroSolution} solution - from MolarityModel
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
   */
  constructor( solution, useQuantitativeDescriptionsProperty ) {

    // @private
    this.solution = solution;
    this.soluteProperty = solution.soluteProperty;
    this.concentrationProperty = solution.concentrationProperty;
    const precipitateAmountProperty = solution.precipitateAmountProperty;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

    // @public {boolean|null} - tracks whether the solution has most recently gone from saturated to unsaturated or
    // vice-versa.
    this.saturationValueChanged = null;

    // @private {boolean} - tracks the most recent saturation state of the solution
    let lastSaturationValue = false;

    // @private {boolean|null} - should only be updated and accessed when the concentrationProperty changes, so
    // while it will be null on initialization, it will only be accessed when it holds boolean values (True if concentrationProperty
    // has increased, False if it has decreased)
    this.concentrationIncreased = null;

    // @public (read-only) {boolean|null} - tracks whether the descriptive regions for concentrationProperty has changed
    // (since region changes trigger the different descriptive text in the aria-live alerts).
    this.concentrationRegionChanged = null;

    // @private {Number} - tracks the last calculated concentration region index.
    let lastConcentrationIndex = this.getCurrentConcentrationIndex();

    // update fields (documented above) when concentrationProperty changes
    this.concentrationProperty.lazyLink( ( newValue, oldValue ) => {
      const newConcentrationIndex = concentrationToIndex( this.concentrationProperty.value,
        this.soluteProperty.value.saturatedConcentration );
      const newSaturationValue = this.solution.isSaturated();

      // newValue will never be equal to oldValue, since this is updated within a Property link.
      this.concentrationIncreased = newValue > oldValue;
      this.concentrationRegionChanged = newConcentrationIndex !== lastConcentrationIndex;
      lastConcentrationIndex = newConcentrationIndex;
      this.saturationValueChanged = newSaturationValue !== lastSaturationValue;
      lastSaturationValue = newSaturationValue;
    } );

    // update saturationValueChanged field when precipitateAmountProperty changes. This is necessary because
    // concentrationProperty stops changing once the solution is saturated, which makes the detection of a change in
    // saturation not possible without also listening to changes in precipitateAmountProperty.
    precipitateAmountProperty.lazyLink( () => {
      const newSaturationValue = this.solution.isSaturated();
      this.saturationValueChanged = newSaturationValue !== lastSaturationValue;
      lastSaturationValue = newSaturationValue;
    } );
  }

  /**
   * Calculates the index of the current concentration region using the saturated concentration of the solute and
   * the current concentration
   * @public
   * @returns {Number} - index of the current concentration region
   * */
  getCurrentConcentrationIndex() {
    return concentrationToIndex( this.concentrationProperty.value, this.soluteProperty.value.saturatedConcentration );
  }

  /**
   * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
   * Qualitative description can be in active or passive voice depending on isPassive parameter.
   * @param {boolean} [isPassive] - ignored if using quantitative descriptions
   * @public
   * @returns {string} - description of current concentration (e.g. "1.500 Molar" or "is very concentrated")
   */
  getCurrentConcentrationClause( isPassive = false ) {
    const concentration = this.concentrationProperty.value;
    if ( this.useQuantitativeDescriptionsProperty.value ) {
      return StringUtils.fillIn( quantitativeConcentrationAndUnitString, {
        concentration: Utils.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
      } );
    }
    else {
      const index = concentrationToIndex( this.concentrationProperty.value, this.soluteProperty.value.saturatedConcentration );
      return isPassive ? CONCENTRATION_STRINGS[ index ] : ACTIVE_CONCENTRATION_STRINGS[ index ];
    }
  }

  /**
   * Creates a string describing the concentration range of the current solute.
   * @public
   * @returns {string} - description of concentration range (e.g. "concentration readout range 0 to 0.5 molar")
   */
  getCurrentConcentrationRangeClause() {

    const concentrationMin = MolarityConstants.CONCENTRATION_RANGE.min;
    const concentrationMax = MolarityConstants.CONCENTRATION_RANGE.max;
    const clampedConcentration = Utils.clamp( this.getCurrentSaturatedConcentration(), concentrationMin, concentrationMax );

    // The described max concentration in this clause is the maximum of the displayed concentration range for solutes
    // with a max concentration larger than the displayed concentration range max, and is the solute's actual max
    // concentration if it is less than the displayed concentration range max.
    const displayedMaxConcentration = Utils.toFixed( clampedConcentration, MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES );

    return StringUtils.fillIn( beakerConcentrationRangePatternString, {
      maxConcentration: Utils.toFixed( displayedMaxConcentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
    } );
  }

  /**
   * Gets the saturated concentration level of the currently selected solute.
   * @public
   * @returns {number}
   */
  getCurrentSaturatedConcentration() {
    return this.soluteProperty.value.saturatedConcentration;
  }

  /**
   * Creates a string that describes the concentration of in the beaker
   * {Property.<boolean>} useQuantitativeDescriptionsProperty
   * @public
   * @returns {string} - e.g. "concentration 1.400 molar" or "is very concentrated"
   */
  getBeakerConcentrationString( useQuantitativeDescriptionsProperty ) {
    const quantitativeString = StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
      concentration: this.getCurrentConcentrationClause()
    } );
    return useQuantitativeDescriptionsProperty.value ? quantitativeString : this.getCurrentConcentrationClause();
  }

  /**
   * Creates a substring to describe how concentration has changed
   * @param [isCapitalized] {boolean}
   * @public
   * @returns {string} - example: "more concentrated"
   */
  getConcentrationChangeString( isCapitalized = true ) {
    assert && assert( !this.solution.isSaturated(), 'concentration cannot change when saturated' );

    let moreLessString = isCapitalized ? lessCapitalizedString : lessLowercaseString;
    if ( this.concentrationIncreased ) {
      moreLessString = isCapitalized ? moreCapitalizedString : moreLowercaseString;
    }
    return StringUtils.fillIn( quantityChangeConcentrationChangePatternString, {
      moreLess: moreLessString
    } );
  }

  /**
   * Creates a substring to describe how the color of the solution has changed
   * @public
   * @returns {string} - example: "Solution lighter"
   */
  getColorChangeString() {
    assert && assert( !this.solution.isSaturated(), 'color cannot change when saturated' );

    return StringUtils.fillIn( quantityChangeColorChangePatternString, {
      lighterDarker: this.concentrationIncreased ? quantityChangeDarkerString : quantityChangeLighterString
    } );
  }

  /**
   * Creates the qualitative substrings to describe the concentration "state" of the solution.
   * @public
   * @returns {string} - example: "Solution very concentrated".
   * */
  getQualitativeConcentrationDescription() {
    assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'qualitative descriptions expected' );
    return StringUtils.fillIn( qualitativeConcentrationStateClausePatternString, {
      concentration: this.getCurrentConcentrationClause( true )
    } );
  }
}

/**
 * Calculates the which item to use from the CONCENTRATION_STRINGS array.
 * @param {number} currentConcentration
 * @param {number} saturatedConcentrationForSolute - the saturation point for a specific solute.
 * @returns {number} index to access a region from CONCENTRATION_STRINGS
 */
const concentrationToIndex = ( currentConcentration, saturatedConcentrationForSolute ) => {
  assert && assert( currentConcentration <= saturatedConcentrationForSolute, 'concentration cannot be higher than saturatedConcentration' );

  // compare against un-rounded concentration since these two are single value regions
  // Handle single value region cases before iterating through evenly spaced regions.
  if ( currentConcentration === saturatedConcentrationForSolute ) {
    return CONCENTRATION_STRINGS.length - 1;
  }
  else if ( currentConcentration === MolarityConstants.CONCENTRATION_RANGE.min ) {
    return 0;
  }
  else {

    // Concentration regions are evenly spaced within the region from 0 to max concentration for a given solute except
    // for the lowest region (zero) and the highest region (max concentration) which are single value regions.
    const scaleIncrement = saturatedConcentrationForSolute / ( CONCENTRATION_STRINGS.length - 2 );
    const concentrationRounded = Utils.toFixedNumber( currentConcentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES );

    // don't count the first and last concentration string
    for ( let i = 1; i < CONCENTRATION_STRINGS.length - 2; i++ ) {
      if ( concentrationRounded <= ( i + 1 ) * scaleIncrement ) {
        return i;
      }
    }
  }
  assert && assert( false, 'unexpected concentration' );
  return -1;
};

molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
export default ConcentrationDescriber;