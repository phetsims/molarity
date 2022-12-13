// Copyright 2019-2022, University of Colorado Boulder

/**
 * PrecipitateAmountDescriber is responsible for formulating strings about Solution.precipitateAmountProperty. This
 * includes descriptions set in the PDOM, as well as context responses set through UtteranceQueue. Note that while
 * these descriptions relate to the precipitateAmountProperty from the model, the precipitates are referred to as
 * "solids" in the descriptions. Therefore, while most of the methods still refer to precipitate amount, the strings
 * and string names often refer to "solids" instead.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import molarity from '../../../molarity.js';
import MolarityStrings from '../../../MolarityStrings.js';
import Solution from '../../model/Solution.js';
import MolarityConstants from '../../MolarityConstants.js';

const atMaxConcentrationPatternString = MolarityStrings.a11y.atMaxConcentrationPattern;
const beakerSaturationPatternString = MolarityStrings.a11y.beaker.saturationPattern;
const saturationLostNoSoluteAlertString = MolarityStrings.a11y.saturationLostNoSoluteAlert;
const saturationLostQualitativeAlertPatternString = MolarityStrings.a11y.saturationLostQualitativeAlertPattern;
const saturationLostQuantitativeAlertPatternString = MolarityStrings.a11y.saturationLostQuantitativeAlertPattern;
const saturationReachedAlertPatternString = MolarityStrings.a11y.saturationReachedAlertPattern;
const stillSaturatedAlertPatternString = MolarityStrings.a11y.stillSaturatedAlertPattern;
const withSolidsAlertPatternString = MolarityStrings.a11y.withSolidsAlertPattern;
const solidsChangePatternString = MolarityStrings.a11y.solidsChangePattern;

// PrecipitateParticles Amount capitalized region strings
const precipitateAmountRegionsCapitalizedALotOfString = MolarityStrings.a11y.precipitateAmountRegions.capitalized.aLotOf;
const precipitateAmountRegionsCapitalizedABunchOfString = MolarityStrings.a11y.precipitateAmountRegions.capitalized.aBunchOf;
const precipitateAmountRegionsCapitalizedSomeString = MolarityStrings.a11y.precipitateAmountRegions.capitalized.some;
const precipitateAmountRegionsCapitalizedACoupleOfString = MolarityStrings.a11y.precipitateAmountRegions.capitalized.aCoupleOf;
const precipitateAmountRegionsCapitalizedAFewString = MolarityStrings.a11y.precipitateAmountRegions.capitalized.aFew;

// PrecipitateParticles Amount lowercase region strings
const precipitateAmountRegionsLowercaseALotOfString = MolarityStrings.a11y.precipitateAmountRegions.lowercase.aLotOf;
const precipitateAmountRegionsLowercaseABunchOfString = MolarityStrings.a11y.precipitateAmountRegions.lowercase.aBunchOf;
const precipitateAmountRegionsLowercaseSomeString = MolarityStrings.a11y.precipitateAmountRegions.lowercase.some;
const precipitateAmountRegionsLowercaseACoupleOfString = MolarityStrings.a11y.precipitateAmountRegions.lowercase.aCoupleOf;
const precipitateAmountRegionsLowercaseAFewString = MolarityStrings.a11y.precipitateAmountRegions.lowercase.aFew;

// Change strings
const lessCapitalizedString = MolarityStrings.a11y.less.capitalized;
const moreCapitalizedString = MolarityStrings.a11y.more.capitalized;
const lessLowercaseString = MolarityStrings.a11y.less.lowercase;
const moreLowercaseString = MolarityStrings.a11y.more.lowercase;

// constants
const PRECIPITATE_AMOUNT_STRINGS_CAPITALIZED = [
  precipitateAmountRegionsCapitalizedACoupleOfString,
  precipitateAmountRegionsCapitalizedAFewString,
  precipitateAmountRegionsCapitalizedSomeString,
  precipitateAmountRegionsCapitalizedABunchOfString,
  precipitateAmountRegionsCapitalizedALotOfString
];
const PRECIPITATE_AMOUNT_STRINGS_LOWERCASE = [
  precipitateAmountRegionsLowercaseACoupleOfString,
  precipitateAmountRegionsLowercaseAFewString,
  precipitateAmountRegionsLowercaseSomeString,
  precipitateAmountRegionsLowercaseABunchOfString,
  precipitateAmountRegionsLowercaseALotOfString
];

class PrecipitateAmountDescriber {

  /**
   * @param {Solution} solution - from MolarityModel
   * @param {ConcentrationDescriber} concentrationDescriber
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
   */
  constructor( solution, concentrationDescriber, useQuantitativeDescriptionsProperty ) {

    // @private
    this.solution = solution;
    this.concentrationDescriber = concentrationDescriber;
    this.precipitateAmountProperty = solution.precipitateAmountProperty;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

    // @private {number|null} - tracks the index of the last descriptive region for precipitateAmount from
    // PRECIPITATE_AMOUNT_STRINGS arrays
    let lastPrecipitateAmountIndex = this.getCurrentPrecipitateAmountIndex();

    // @private {boolean|null} - should only be updated and accessed when the precipitateAmountProperty changes, so
    // while it will be null at some points, it will only be accessed when it holds boolean values (True if precipitateAmount
    // has increased, False if it has decreased)
    this.precipitateAmountIncreased = null;

    // @private {boolean|null} - tracks whether the descriptive regions for the precipitateAmountProperty has changed
    // (since region changes trigger the different descriptive text in the aria-live alerts).
    this.precipiateAmountRegionChanged = null;

    // update fields (documented above) when precipitateAmountProperty changes
    this.precipitateAmountProperty.lazyLink( ( newValue, oldValue ) => {
      const newPrecipitateAmountIndex = this.getCurrentPrecipitateAmountIndex();
      this.precipitateAmountIncreased = newValue > oldValue;
      this.precipiateAmountRegionChanged = newPrecipitateAmountIndex !== lastPrecipitateAmountIndex;
      lastPrecipitateAmountIndex = newPrecipitateAmountIndex;
    } );
  }

  /**
   * Calculates the index of the current precipitateAmount region using the precipitateAmountProperty and the saturated
   * concentration level of the currently selected solute
   * @private
   * @returns {Number} - index of the current precipitateAmount description region
   * */
  getCurrentPrecipitateAmountIndex() {
    return precipitateAmountToIndex( this.precipitateAmountProperty.value, this.concentrationDescriber.getCurrentSaturatedConcentration() );
  }


  /**
   * Gets the qualitative description of the amount of precipitate in the beaker.
   * @public
   * @param [isCapitalized] {boolean}
   * @returns {string} - example: "a bunch"
   */
  getCurrentPrecipitateAmountDescription( isCapitalized = false ) {
    const precipitateAmountIndex = this.getCurrentPrecipitateAmountIndex();
    return isCapitalized ? PRECIPITATE_AMOUNT_STRINGS_CAPITALIZED[ precipitateAmountIndex ] :
           PRECIPITATE_AMOUNT_STRINGS_LOWERCASE[ precipitateAmountIndex ];
  }

  /**
   * Creates a string that describes the precipitate amount in the beaker
   * @public
   * @returns {string} - e.g. "is saturated with a bunch of solids"
   */
  getBeakerSaturationString() {
    return StringUtils.fillIn( beakerSaturationPatternString, {
      solids: this.getCurrentPrecipitateAmountDescription()
    } );
  }


  /**
   * Fills in information about the state of the solution (its saturation and the amount of precipitate) if region has changed
   * and the solution is saturated.
   * @public
   * @returns {string} - example: "still saturated with a bunch of solids"
   */
  getStillSaturatedClause() {
    const maxConcentrationString = StringUtils.fillIn( atMaxConcentrationPatternString, {
      concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
    } );
    let withSolidsString = '';

    // the amount of precipitate is only given if the region has changed.
    if ( this.precipiateAmountRegionChanged ) {
      withSolidsString = StringUtils.fillIn( withSolidsAlertPatternString, {
        solidAmount: this.getCurrentPrecipitateAmountDescription()
      } );
    }

    return StringUtils.fillIn( stillSaturatedAlertPatternString, {
      withSolids: withSolidsString,
      maxConcentration: maxConcentrationString
    } );
  }

  /**
   * Creates a substring to describe the change in the amount of precipitate
   * @param [isCapitalized] {boolean}
   * @public
   * @returns {string} - example: "more solids"
   */
  getPrecipitateAmountChangeString( isCapitalized = false ) {
    assert && assert( this.solution.isSaturated(), 'precipitateAmountProperty should be greater than 0' );
    let moreLessString = isCapitalized ? lessCapitalizedString : lessLowercaseString;
    if ( this.precipitateAmountIncreased ) {
      moreLessString = isCapitalized ? moreCapitalizedString : moreLowercaseString;
    }
    return StringUtils.fillIn( solidsChangePatternString, {
      moreLess: moreLessString
    } );
  }

  /**
   * Creates the string to be read out when the solution is either newly saturated or newly unsaturated.
   * @public
   * @returns {string}
   * */
  getSaturationChangedString() {
    assert && assert( this.concentrationDescriber.saturationValueChanged, 'saturation state has not changed' );
    const saturationLostAlertString = this.useQuantitativeDescriptionsProperty.value ?
                                      saturationLostQuantitativeAlertPatternString :
                                      saturationLostQualitativeAlertPatternString;

    // alerts are different based on whether the solution is newly saturated or newly unsaturated.
    if ( this.solution.isSaturated() ) {

      // newly saturated alert
      return StringUtils.fillIn( saturationReachedAlertPatternString, {
        solids: this.getCurrentPrecipitateAmountDescription(),
        concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
      } );
    }
    else {

      // newly unsaturated alerts -- there is a special case where the solution goes from saturated to zero solute, which
      // is handled with the condition !this.solution.hasSolute().
      if ( !this.solution.hasSolute() ) {

        // Because monitoring a concentrationDescriber.saturationValueChanged is updated by links to concentrationProperty
        // and precipitateAmountProperty,if there is no solute in the beaker, concentrationDescriber.saturationValueChanged
        // will not be updated, and must therefore be manually updated.
        this.concentrationDescriber.saturationValueChanged = false;
        return saturationLostNoSoluteAlertString;
      }
      else {
        return StringUtils.fillIn( saturationLostAlertString, {
          concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
        } );
      }
    }
  }
}

/**
 * Calculates which item to use from the precipitate amount regions string arrays.
 * @param {number} currentPrecipitateAmount - in moles, see Solution.js
 * @param {number} saturatedConcentrationForSolute -  the saturation point for a specific solute
 * @returns {number} - index to pull from precipitate amount regions string arrays
 */
const precipitateAmountToIndex = ( currentPrecipitateAmount, saturatedConcentrationForSolute ) => {

  // maximum precipitates possible for a given solute, which is the solute amount it takes to saturate at min volume.
  const maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityConstants.SOLUTION_VOLUME_RANGE.min,
    MolarityConstants.SOLUTE_AMOUNT_RANGE.max, saturatedConcentrationForSolute );

  const numberOfIncrements = PRECIPITATE_AMOUNT_STRINGS_CAPITALIZED.length;
  const scaleIncrement = maxPrecipitateAmount / numberOfIncrements;

  for ( let i = 0; i < numberOfIncrements - 1; i++ ) {
    if ( currentPrecipitateAmount <= ( i + 1 ) * scaleIncrement ) {
      return i;
    }
  }
  return PRECIPITATE_AMOUNT_STRINGS_CAPITALIZED.length - 1;
};

molarity.register( 'PrecipitateAmountDescriber', PrecipitateAmountDescriber );
export default PrecipitateAmountDescriber;