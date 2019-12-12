// Copyright 2019, University of Colorado Boulder

/**
 * PrecipitateAmountDescriber is responsible for formulating  strings about Solution.precipitateAmountProperty. This includes
 * descriptions set in the PDOM, as well as context responses set through UtteranceQueue.
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
  const atMaxConcentrationString = MolarityA11yStrings.atMaxConcentration.value;
  const beakerSaturationPatternString = MolarityA11yStrings.beakerSaturationPattern.value;
  const saturationLostQualitativeAlertPatternString = MolarityA11yStrings.saturationLostQualitativeAlertPattern.value;
  const saturationLostQuantitativeAlertPatternString = MolarityA11yStrings.saturationLostQuantitativeAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlert.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;

  // Solids capitalized region strings
  const aLotOfSolidsString = MolarityA11yStrings.solidsRegions.capitalized.aLotOf.value;
  const aBunchOfSolidsString = MolarityA11yStrings.solidsRegions.capitalized.aBunchOf.value;
  const someSolidsString = MolarityA11yStrings.solidsRegions.capitalized.some.value;
  const aCoupleOfSolidsString = MolarityA11yStrings.solidsRegions.capitalized.aCoupleOf.value;
  const aFewSolidsString = MolarityA11yStrings.solidsRegions.capitalized.aFew.value;

  // Solids lowercase region strings
  const aLotOfSolidsLowercaseString = MolarityA11yStrings.solidsRegions.lowercase.aLotOf.value;
  const aBunchOfSolidsLowercaseString = MolarityA11yStrings.solidsRegions.lowercase.aBunchOf.value;
  const someSolidsLowercaseString = MolarityA11yStrings.solidsRegions.lowercase.some.value;
  const aCoupleOfSolidsLowercaseString = MolarityA11yStrings.solidsRegions.lowercase.aCoupleOf.value;
  const aFewSolidsLowercaseString = MolarityA11yStrings.solidsRegions.lowercase.aFew.value;

  // Change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const lessLowercaseString = MolarityA11yStrings.less.lowercase.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const moreLowercaseString = MolarityA11yStrings.more.lowercase.value;

  // constants
  const SOLIDS_STRINGS = [
    aCoupleOfSolidsString,
    aFewSolidsString,
    someSolidsString,
    aBunchOfSolidsString,
    aLotOfSolidsString
  ];
  const SOLIDS_STRINGS_LOWERCASE = [
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

      // @private {number|null} - tracks the index of the last descriptive region for solids from SOLIDS_STRINGS array
      this.lastSolidsIndex = this.getCurrentSolidsIndex();

      // @private {boolean|null} - should only be updated and accessed when the precipitateAmountProperty changes, so
      // while it will be null at some points, it will only be accessed when it holds boolean values (True if precipitateAmount
      // has increased, False if it has decreased)
      this.precipitateAmountIncreased = null;

      // @private {boolean|null} - tracks whether the descriptive regions for the precipitateAmountProperty has changed
      // (since region changes trigger the different descriptive text in the aria-live alerts).
      this.solidsRegionChanged = null;

      // update fields (documented above) when precipitateAmountProperty changes
      this.precipitateAmountProperty.lazyLink( ( newValue, oldValue ) => {
        const newSolidsIndex = this.getCurrentSolidsIndex();
        this.precipitateAmountIncreased = newValue > oldValue;
        this.solidsRegionChanged = newSolidsIndex !== this.lastSolidsIndex;
        this.lastSolidsIndex = newSolidsIndex;
      } );
    }

    /**
     * Calculates the index of the current solids region using the precipitateAmountProperty and the saturated concentration
     * level of the currently selected solute
     * @private
     * @returns {Number} - index of the current solids description region
     * */
    getCurrentSolidsIndex() {
      return solidsToIndex( this.precipitateAmountProperty.value, this.concentrationDescriber.getCurrentSaturatedConcentration() );
    }


    /**
     * Gets the qualitative description of the amount of solids in the beaker.
     * @public
     * @param [isCapitalized] {boolean}
     * @returns {string} - example: "a bunch"
     */
    getCurrentSolidsAmount( isCapitalized = true ) {
      const solidsIndex = this.getCurrentSolidsIndex();
      return isCapitalized ? SOLIDS_STRINGS[ solidsIndex ] : SOLIDS_STRINGS_LOWERCASE[ solidsIndex ];
    }

    /**
     * Creates a string that describes the solids in the beaker
     * @public
     * @returns {string} - e.g. "is saturated with a bunch of solids"
     */
    getBeakerSaturationString() {
      return StringUtils.fillIn( beakerSaturationPatternString, {
        solids: this.getCurrentSolidsAmount( false )
      } );
    }


    /**
     * Fills in the state info if region has changed and the solution is saturated.
     * @public
     * @returns {string} - example: "still saturated with a bunch of solids"
     */
    getStillSaturatedClause() {
      const maxConcentrationString = StringUtils.fillIn( atMaxConcentrationString, {
        concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
      } );
      let withSolidsString = '';

      // the amount of solids is only given if the region has changed.
      if ( this.solidsRegionChanged ) {
        withSolidsString = StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.getCurrentSolidsAmount( false )
        } );
      }

      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: withSolidsString,
        maxConcentration: maxConcentrationString
      } );
    }

    /**
     * Creates a substring to describe the change in the amount of solids
     * @param [isCapitalized] {boolean}
     * @public
     * @returns {string} - example: "more solids"
     */
    getSolidsChangeString( isCapitalized = false ) {
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
      const saturationLostAlertString = this.useQuantitativeDescriptionsProperty.value ?
                                        saturationLostQuantitativeAlertPatternString :
                                        saturationLostQualitativeAlertPatternString;
      return this.solution.isSaturated() ?
             StringUtils.fillIn( saturationReachedAlertString, {
               solids: this.getCurrentSolidsAmount( false ),
               concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
             } ) :
             StringUtils.fillIn( saturationLostAlertString, {
               concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
             } );
    }
  }

  /**
   * Calculates which item to use from the SOLIDS_STRINGS array.
   * @param {number} currentPrecipitateAmount - in moles, see Solution.js
   * @param {number} saturatedConcentrationForSolute -  the saturation point for a specific solute
   * @returns {number} - index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( currentPrecipitateAmount, saturatedConcentrationForSolute ) => {

    // maximum precipitates possible for a given solute, which is the solute amount it takes to saturate at min volume.
    const maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityConstants.SOLUTION_VOLUME_RANGE.min,
      MolarityConstants.SOLUTE_AMOUNT_RANGE.max, saturatedConcentrationForSolute );

    const numberOfIncrements = SOLIDS_STRINGS.length;
    const scaleIncrement = maxPrecipitateAmount / numberOfIncrements;

    for ( let i = 0; i < numberOfIncrements - 1; i++ ) {
      if ( currentPrecipitateAmount <= ( i + 1 ) * scaleIncrement ) {
        return i;
      }
    }
    return SOLIDS_STRINGS.length - 1;
  };

  return molarity.register( 'PrecipitateAmountDescriber', PrecipitateAmountDescriber );
} );