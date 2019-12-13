// Copyright 2019, University of Colorado Boulder

/**
 * PrecipitateAmountDescriber is responsible for formulating strings about Solution.precipitateAmountProperty. This includes
 * descriptions set in the PDOM, as well as context responses set through UtteranceQueue. Note that while these descriptions
 * relate to the precipitateAmountProperty from the model, the precipitates are referred to as "solids" in the descriptions.
 * Therefore, while most of the methods still refer to precipitate amount, the strings and string names often refer to "solids" instead.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Solution = require( 'MOLARITY/molarity/model/Solution' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const atMaxConcentrationPatternString = MolarityA11yStrings.atMaxConcentrationPattern.value;
  const beakerSaturationPatternString = MolarityA11yStrings.beakerSaturationPattern.value;
  const saturationLostQualitativeAlertPatternString = MolarityA11yStrings.saturationLostQualitativeAlertPattern.value;
  const saturationLostQuantitativeAlertPatternString = MolarityA11yStrings.saturationLostQuantitativeAlertPattern.value;
  const saturationReachedAlertPatternString = MolarityA11yStrings.saturationReachedAlertPattern.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;

  // Precipitate Amount capitalized region strings
  const aLotOfSolidsCapitalizedString = MolarityA11yStrings.precipitateAmountRegions.capitalized.aLotOf.value;
  const aBunchOfSolidsCapitalizedString = MolarityA11yStrings.precipitateAmountRegions.capitalized.aBunchOf.value;
  const someSolidsCapitalizedString = MolarityA11yStrings.precipitateAmountRegions.capitalized.some.value;
  const aCoupleOfSolidsCapitalizedString = MolarityA11yStrings.precipitateAmountRegions.capitalized.aCoupleOf.value;
  const aFewSolidsCapitalizedString = MolarityA11yStrings.precipitateAmountRegions.capitalized.aFew.value;

  // Precipitate Amount lowercase region strings
  const aLotOfSolidsLowercaseString = MolarityA11yStrings.precipitateAmountRegions.lowercase.aLotOf.value;
  const aBunchOfSolidsLowercaseString = MolarityA11yStrings.precipitateAmountRegions.lowercase.aBunchOf.value;
  const someSolidsLowercaseString = MolarityA11yStrings.precipitateAmountRegions.lowercase.some.value;
  const aCoupleOfSolidsLowercaseString = MolarityA11yStrings.precipitateAmountRegions.lowercase.aCoupleOf.value;
  const aFewSolidsLowercaseString = MolarityA11yStrings.precipitateAmountRegions.lowercase.aFew.value;

  // Change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const lessLowercaseString = MolarityA11yStrings.less.lowercase.value;
  const moreLowercaseString = MolarityA11yStrings.more.lowercase.value;

  // constants
  const PRECIPITATE_AMOUNT_STRINGS_CAPITALIZED = [
    aCoupleOfSolidsCapitalizedString,
    aFewSolidsCapitalizedString,
    someSolidsCapitalizedString,
    aBunchOfSolidsCapitalizedString,
    aLotOfSolidsCapitalizedString
  ];
  const PRECIPITATE_AMOUNT_STRINGS_LOWERCASE = [
    aCoupleOfSolidsLowercaseString,
    aFewSolidsLowercaseString,
    someSolidsLowercaseString,
    aBunchOfSolidsLowercaseString,
    aLotOfSolidsLowercaseString
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
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private {number|null} - tracks the index of the last descriptive region for precipitateAmount from
      // PRECIPITATE_AMOUNT_STRINGS arrays
      this.lastPrecipitateAmountIndex = this.getCurrentPrecipitateAmountIndex();

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
        this.precipiateAmountRegionChanged = newPrecipitateAmountIndex !== this.lastPrecipitateAmountIndex;
        this.lastPrecipitateAmountIndex = newPrecipitateAmountIndex;
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
      return this.solution.isSaturated() ?
             StringUtils.fillIn( saturationReachedAlertPatternString, {
               solids: this.getCurrentPrecipitateAmountDescription(),
               concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
             } ) :
             StringUtils.fillIn( saturationLostAlertString, {
               concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
             } );
    }
  }

  /**
   * Calculates which item to use from the PRECIPITATE_AMOUNT_STRINGS arrays.
   * @param {number} currentPrecipitateAmount - in moles, see Solution.js
   * @param {number} saturatedConcentrationForSolute -  the saturation point for a specific solute
   * @returns {number} - index to pull from PRECIPITATE_AMOUNT_STRINGS arrays
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

  return molarity.register( 'PrecipitateAmountDescriber', PrecipitateAmountDescriber );
} );