// Copyright 2019, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for generating strings about ConcentrationProperty. Also includes alert text
 * for alerts past saturation point, including descriptions about the amount of solids (precipitate) in the beaker.
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
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const beakerQualitativeConcentrationPatternString = MolarityA11yStrings.beakerQualitativeConcentrationPattern.value;
  const beakerSaturationPatternString = MolarityA11yStrings.beakerSaturationPattern.value;
  const concentrationString = MolarityA11yStrings.concentration.value;
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const concentrationRangePatternString = MolarityA11yStrings.concentrationRangePattern.value;
  const qualitativeConcentrationStatePatternString = MolarityA11yStrings.qualitativeConcentrationStatePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlert.value;
  const solutionString = MolarityA11yStrings.solution.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;

  // Concentration region strings
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;
  const someString = MolarityA11yStrings.some.value;
  const zeroConcentrationString = MolarityA11yStrings.zeroConcentration.value;
  const lowConcentrationString = MolarityA11yStrings.lowConcentration.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentrated.value;
  const notVeryConcentratedString = MolarityA11yStrings.notVeryConcentrated.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentrated.value;
  const highlyConcentratedString = MolarityA11yStrings.highlyConcentrated.value;
  const maxConcentrationString = MolarityA11yStrings.maxConcentration.value;

  // Concentration active region strings
  const hasZeroConcentrationString = MolarityA11yStrings.hasZeroConcentration.value;
  const hasLowConcentrationString = MolarityA11yStrings.hasLowConcentration.value;
  const isSlightlyConcentratedString = MolarityA11yStrings.isSlightlyConcentrated.value;
  const isNotVeryConcentratedString = MolarityA11yStrings.isNotVeryConcentrated.value;
  const isVeryConcentratedString = MolarityA11yStrings.isVeryConcentrated.value;
  const isHighlyConcentratedString = MolarityA11yStrings.isHighlyConcentrated.value;
  const hasMaxConcentrationString = MolarityA11yStrings.hasMaxConcentration.value;

  // Solids region strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aCoupleOfString = MolarityA11yStrings.aCoupleOf.value;
  const aFewString = MolarityA11yStrings.aFew.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;

  // Solids lowercase region strings
  const someLowercaseString = MolarityA11yStrings.someLowercase.value;
  const aBunchOfLowercaseString = MolarityA11yStrings.aBunchOfLowercase.value;
  const aLotOfLowercaseString = MolarityA11yStrings.aLotOfLowercase.value;

  // Change strings
  const lessString = MolarityA11yStrings.less.value;
  const moreString = MolarityA11yStrings.more.value;
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;

  // constants
  const ACTIVE_CONCENTRATION_STRINGS = [
    hasZeroConcentrationString,
    hasLowConcentrationString,
    isSlightlyConcentratedString,
    isNotVeryConcentratedString,
    isVeryConcentratedString,
    isHighlyConcentratedString,
    hasMaxConcentrationString
  ];

  const CONCENTRATION_STRINGS = [
    zeroConcentrationString,
    lowConcentrationString,
    slightlyConcentratedString,
    notVeryConcentratedString,
    veryConcentratedString,
    highlyConcentratedString,
    maxConcentrationString
  ];

  const SOLIDS_STRINGS = [
    aCoupleOfString,
    aFewString,
    someString,
    aBunchOfString,
    aLotOfString
  ];
  const SOLIDS_STRINGS_LOWERCASE = [
    aCoupleOfString,
    aFewString,
    someLowercaseString,
    aBunchOfLowercaseString,
    aLotOfLowercaseString
  ];

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {Property.<boolean>>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, useQuantitativeDescriptionsProperty ) {

      // @public (read-only) {boolean} - tracks whether the concentration descriptive region has changed
      this.concentrationRegionChanged = null;

      // @private
      this.solution = solution;
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private {number} - the index of the last concentration descriptive region
      this.concentrationIndex = concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
        this.concentrationProperty.value );

      // @private {boolean} - tracks whether the concentration descriptive region has just changed.
      this.concentrationRegionChanged = false;

      // @private {boolean|null} - tracks whether concentration has increased or decreased. null when simulation starts
      // or resets.
      this.concentrationIncreased = null;

      // @private {number} - tracks the index of the last descriptive region for solids from SOLIDS_STRINGS array
      this.solidsIndex = solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );

      // @private {boolean} - tracks whether the solids descriptive region has just changed
      this.solidsRegionChanged = false;

      // @private {boolean|null} - tracks whether solids amount has increased or decreased. null when simulation
      // starts or resets.
      this.solidsIncreased = null;

      // @private {boolean} - tracks whether the solution has just become saturated or unsaturated.
      this._saturationStateChanged = false;

      // update fields (documented above) when ConcentrationProperty changes
      this.concentrationProperty.lazyLink( ( newValue, oldValue ) => {
        const newConcentrationIndex = concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
          this.concentrationProperty.value );
        const previousSaturationState = oldValue > this.getCurrentSaturatedConcentration();
        const newSaturationState = this.solution.isSaturated();
        this.concentrationIncreased = newValue > oldValue;
        this.concentrationRegionChanged = newConcentrationIndex !== this.concentrationIndex;
        this.concentrationIndex = newConcentrationIndex;
        this._saturationStateChanged = newSaturationState !== previousSaturationState;
      } );

      // update fields (documented above) when precipitateAmountProperty changes
      this.precipitateAmountProperty.lazyLink( ( newValue, oldValue ) => {
        const newSolidsIndex = solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );
        const previousSaturationState = oldValue !== 0;
        const newSaturationState = newValue !== 0;
        this._saturationStateChanged = newSaturationState !== previousSaturationState;
        this.solidsIncreased = newValue > oldValue;
        this.solidsRegionChanged = newSolidsIndex !== this.solidsIndex;
        this.solidsIndex = newSolidsIndex;
      } );
    }

    /**
     * Getter for newSaturationState
     * @public
     * @returns {boolean} - whether or not the solution has been newly saturated or unsaturated
     * */
    get saturationStateChanged() { return this._saturationStateChanged; }

    /**
     * Determines if there is solute in the beaker.
     * @returns {boolean}
     * @public
     */
    hasSolute() {
      return Util.toFixed( this.solution.soluteAmountProperty.value, 3 ) > 0;
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * Qualitative description is in active voice.
     * @public
     * @returns {string} - description of current concentration (e.g. "1.500 Molar" or "is very concentrated")
     */
    getCurrentConcentrationClause() {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
        return ACTIVE_CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * Gets the current qualitative passive concentration description (e.g. "slightly concentrated").
     * @public
     * @returns {string}
     */
    getCurrentPassiveConcentrationClause() {
      const concentration = this.concentrationProperty.value;
      const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
      return CONCENTRATION_STRINGS[ index ];
    }

    /**
     * Creates a string describing the concentration range of the current solute.
     * @public
     * @returns {string} - description of concentration range (e.g. "concentration readout range 0 to 0.5 molar")
     */
    getCurrentConcentrationRangeClause() {
      const maxConcentration = this.getCurrentSaturatedConcentration() > 5.0 ? 5.0 : this.getCurrentSaturatedConcentration();
      return StringUtils.fillIn( concentrationRangePatternString, {
        maxConcentration: Util.toFixed( maxConcentration, 3 )
      } );
    }

    /**
     * Gets the saturated concentration level of the currently selected solute.
     * @private
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the qualitative description of the amount of solids in the beaker.
     * @private
     * @param {boolean} [isCapitalized]
     * @returns {string} - example: "a bunch"
     */
    getCurrentSolidsAmount( isCapitalized = true ) {
      let solidsIndex = this.solidsIndex;

      // for the descriptions, solidsIndex needs to be adjusted to ensure that the first solids region alert is still read out.
      // see https://github.com/phetsims/molarity/issues/148.
      solidsIndex !== 0 ? solidsIndex -= 1 : 0;
      return isCapitalized ?
             SOLIDS_STRINGS[ solidsIndex ] :
             SOLIDS_STRINGS_LOWERCASE[ solidsIndex ];
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
     * Creates a string that describes the concentration of in the beaker
     * {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @public
     * @returns {string} - e.g. "concentration 1.400 molar" or "is very concentrated"
     */
    getBeakerConcentrationString( useQuantitativeDescriptionsProperty ) {
      const concentrationString = useQuantitativeDescriptionsProperty.value ?
                                  quantitativeConcentrationStatePatternString :
                                  beakerQualitativeConcentrationPatternString;
      return StringUtils.fillIn( concentrationString, {
        concentration: this.getCurrentConcentrationClause()
      } );
    }

    /**
     * Fills in the state info if region has changed and the solution is saturated.
     * @public
     * @returns {string} - example: "still saturated with a bunch of solids"
     */
    getStillSaturatedClause() {
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {

        // the solids state information is only given if the region has changed, and if solids amount is not in the
        // lowest region (which is right after saturation point).
        withSolids: ( this.solidsRegionChanged && this.solidsIndex !== 0 ) ? StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.getCurrentSolidsAmount( false )
        } ) : ''
      } );
    }

    /**
     * Creates a substring to describe how concentration has changed
     * @param {boolean} [isCapitalized]
     * @public
     * @returns {string} - example: "more concentrated"
     */
    getConcentrationChangeString( isCapitalized = false ) {
      let moreLessString = isCapitalized ? lessCapitalizedString : lessString;
      if ( this.concentrationIncreased ) {
        moreLessString = isCapitalized ? moreCapitalizedString : moreString;
      }
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: moreLessString
      } );
    }

    /**
     * Creates a substring to describe the change in the amount of solids
     * @public
     * @returns {string} - example: "more solids"
     */
    getSolidsChangeString() {
      assert && assert( this.precipitateAmountProperty.value > 0, 'precipitateAmountProperty should be greater than 0' );
      return StringUtils.fillIn( solidsChangePatternString, {
        moreLess: this.solidsIncreased ? moreString : lessString
      } );
    }

    /**
     * Creates the string to be read out when the solution is either newly saturated or newly unsaturated.
     * @public
     * @returns {string}
     * */
    getSaturationChangedString( useQuantitativeDescriptionsProperty ) {
      assert && assert( this._saturationStateChanged, 'saturation state has not changed' );
      return this.solution.isSaturated() ?
             saturationReachedAlertString :
             StringUtils.fillIn( saturationLostAlertPatternString, {
               concentration: this.getCurrentConcentrationClause(),
               solutionOrConcentration: useQuantitativeDescriptionsProperty.value ? concentrationString : solutionString
             } );
    }

    /**
     * Creates the quantitative and qualitative substrings to describe the concentration state of the solution.
     * @public
     * @returns {string} - examples: "Concentration 0.600 Molar" or "Solution very concentrated".
     * */
    getConcentrationState() {
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
          concentration: this.getCurrentConcentrationClause()
        } );
      }
      else {
        return StringUtils.fillIn( qualitativeConcentrationStatePatternString, {
          concentration: this.getCurrentConcentrationClause()
        } );
      }
    }
  }

  /**
   * Calculates which item to use from the SOLIDS_STRINGS array.
   * @param {number} precipitateAmount
   * @param {number} saturatedConcentration
   * @returns {number} - index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {

    // maximum: solute amount max - solute amount it takes to saturate at min volume. Varies with the selected solute.
    const maxPrecipitateAmount = MolarityConstants.SOLUTE_AMOUNT_RANGE.max - saturatedConcentration * MolarityConstants.SOLUTION_VOLUME_RANGE.min;

    // there is an unnamed region right after saturation point that doesn't have a description, so 1 more region must be
    // added to the length of SOLIDS_STRINGS.
    const numberOfIncrements = SOLIDS_STRINGS.length + 1;
    const scaleIncrement = maxPrecipitateAmount / numberOfIncrements;

    if ( precipitateAmount < scaleIncrement ) {
      return 0;
    }
    else if ( precipitateAmount <= 2 * scaleIncrement ) {
      return 1;
    }
    else if ( precipitateAmount <= 3 * scaleIncrement ) {
      return 2;
    }
    else if ( precipitateAmount <= 4 * scaleIncrement ) {
      return 3;
    }
    else if ( precipitateAmount <= 5 * scaleIncrement ) {
      return 4;
    }
    else {
      assert && assert( precipitateAmount > 5 * scaleIncrement, 'invalid precipitateAmount value' );
      return 5;
    }
  };

  /**
   * Calculates the which item to use from the CONCENTRATION_STRINGS array.
   * @param {number} maxConcentration - the saturation point for the specific solute that is currently selected.
   * @param {number} concentration
   * @returns {number} index to pull from CONCENTRATION_STRINGS array
   */
  const concentrationToIndex = ( maxConcentration, concentration ) => {

    // Concentration regions are evenly spaced within the region from 0 to max concentration for a given solute except
    // for the lowest region (zero) and the highest region (max concentration) which are single value regions.
    const scaleIncrement = maxConcentration / ( CONCENTRATION_STRINGS.length - 2 );
    const concentrationRounded = Util.toFixed( concentration, 3 );
    if ( concentrationRounded < 0.001 ) {
      return 0;
    }
    else if ( concentrationRounded <= scaleIncrement ) {
      return 1;
    }
    else if ( concentrationRounded <= 2 * scaleIncrement ) {
      return 2;
    }
    else if ( concentrationRounded <= 3 * scaleIncrement ) {
      return 3;
    }
    else if ( concentrationRounded <= 4 * scaleIncrement ) {
      return 4;
    }
    else if ( concentrationRounded < 5 * scaleIncrement - .001 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );