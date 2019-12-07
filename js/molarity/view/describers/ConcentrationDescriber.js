// Copyright 2019, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for formulating  strings about Solution.concentrationProperty. This includes
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
  const Util = require( 'DOT/Util' );
  const Solution = require( 'MOLARITY/molarity/model/Solution' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const atMaxConcentrationString = MolarityA11yStrings.atMaxConcentration.value;
  const beakerQualitativeConcentrationPatternString = MolarityA11yStrings.beakerQualitativeConcentrationPattern.value;
  const beakerSaturationPatternString = MolarityA11yStrings.beakerSaturationPattern.value;
  const colorChangePatternString = MolarityA11yStrings.colorChangePattern.value;
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const concentrationRangePatternString = MolarityA11yStrings.concentrationRangePattern.value;
  const qualitativeConcentrationStatePatternString = MolarityA11yStrings.qualitativeConcentrationStatePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const saturationLostQualitativeAlertPatternString = MolarityA11yStrings.saturationLostQualitativeAlertPattern.value;
  const saturationLostQuantitativeAlertPatternString = MolarityA11yStrings.saturationLostQuantitativeAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlert.value;
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
  const lighterString = MolarityA11yStrings.lighter.value;
  const darkerString = MolarityA11yStrings.darker.value;

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
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, useQuantitativeDescriptionsProperty ) {

      // @private
      this.solution = solution;
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private {number|null} - tracks the index of the last descriptive region for solids from SOLIDS_STRINGS array
      this.lastSolidsIndex = null;

      // @private {number} - tracks whether solids amount has increased or decreased. null when simulation
      // starts or resets.
      this.lastSolidsAmount = this.precipitateAmountProperty.value;

      // @private {number} - tracks the last value of concentrationProperty
      this.lastConcentrationValue = this.concentrationProperty.value;

      // @private {boolean} - tracks the last saturation state
      this.lastSaturationState = false;

      // @private {Number} - tracks the last calculated concentration region index.
      this.lastConcentrationIndex = this.getCurrentConcentrationIndex();
    }

    /**
     * Calculates the index of the current concentration region using the saturated concentration of the solute and
     * the current concentration
     * @public
     * @returns {Number} - index of the current concentration region
     * */
    getCurrentConcentrationIndex() {
      return concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
        this.concentrationProperty.value );
    }

    /**
     * Calculates the index of the current solids region using the precipitateAmountProperty and the saturated concentration
     * level of the currently selected solute
     * @public
     * @returns {Number} - index of the current solids description region
     * */
    getCurrentSolidsIndex() {
      return solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );
    }

    //TODO: doc
    solidsRegionChanged() {
      const oldSolidsIndex = this.lastSolidsIndex;
      const newSolidsIndex = this.getCurrentSolidsIndex();
      this.lastSolidsIndex = newSolidsIndex;
      return newSolidsIndex !== oldSolidsIndex;
    }

    solidsIncreased() {
      const oldSolidsAmount = this.lastSolidsAmount;
      const newSolidsAmount = this.precipitateAmountProperty.value;
      this.lastSolidsAmount = newSolidsAmount;
      return newSolidsAmount > oldSolidsAmount;
    }

    /**
     * Determines whether the concentration has increased or decreased.
     * @private
     * @returns {boolean} - whether the concentration has increased (True) or decreased (False)
     * */
    concentrationIncreased() {
      const oldConcentration = this.lastConcentrationValue;
      const newConcentration = this.concentrationProperty.value;
      this.lastConcentrationValue = newConcentration;
      return newConcentration > oldConcentration;
    }

    /**
     * Determines if the descriptive region has changed by comparing the old and new concentration indices. Also sets the
     * lastConcentrationIndex property to the new index if there is a change.
     * @public
     * @returns {boolean} - whether or not the concentration region has changed.
     * */
    concentrationRegionChanged() {
      const oldIndex = this.lastConcentrationIndex;
      const newIndex = this.getCurrentConcentrationIndex();
      if ( oldIndex !== newIndex ) {
        this.lastConcentrationIndex = newIndex;
      }
      return oldIndex !== newIndex;
    }

    /**
     * Determines if the saturation state has changed (by the solution going from unsaturated to saturated, or vice versa).
     * Also sets the lastSaturationState property to the new saturation state if it has changed.
     * @public
     * @returns {boolean} - whether or not the saturation state has changed.
     * */
    saturationStateChanged() {
      const oldSaturationState = this.lastSaturationState;

      // for descriptive purposes, the solution will not be described as "not saturated" unless the concentration level
      // is below saturation point. Therefore, the point at which the solution is saturated with no solids will be considered
      // "saturated" for description purposes.
      const newSaturationState = this.solution.isSaturated() && this.isExactlySaturated();
      if ( oldSaturationState !== newSaturationState ) {
        this.lastSaturationState = newSaturationState;
      }
      return oldSaturationState !== newSaturationState;
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * Qualitative description can be in active or passive voice depending on isPassive parameter.
     * @param {boolean} [isPassive]
     * @public
     * @returns {string} - description of current concentration (e.g. "1.500 Molar" or "is very concentrated")
     */
    getCurrentConcentrationClause( isPassive = false ) {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const concentration = this.concentrationProperty.value;
        const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
        return isPassive ? CONCENTRATION_STRINGS[ index ] : ACTIVE_CONCENTRATION_STRINGS[ index ];
      }
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
      let solidsIndex = this.getCurrentSolidsIndex();

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

      // the amount of solids is only given if the region has changed.
      const withSolidsString = ( this.solidsRegionChanged() && this.solidsIndex !== 0 ) ?
                               StringUtils.fillIn( withSolidsAlertPatternString, {
                                 solidAmount: this.getCurrentSolidsAmount( false )
                               } ) :
                               '';

      // if quantitative descriptions are being used, the quantitative max concentration is added into the description string.
      const quantitativeConcentrationString = this.useQuantitativeDescriptionsProperty ?
                                              StringUtils.fillIn( atMaxConcentrationString, {
                                                concentration: this.getCurrentConcentrationClause( true )
                                              } ) : '';
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: withSolidsString,
        quantitativeConcentration: quantitativeConcentrationString
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
      if ( this.concentrationIncreased() ) {
        moreLessString = isCapitalized ? moreCapitalizedString : moreString;
      }
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: moreLessString
      } );
    }

    /**
     * Creates a substring to describe how the color of the solution has changed
     * @public
     * @returns {string} - example: "Solution lighter"
     */
    getColorChangeString() {
      return StringUtils.fillIn( colorChangePatternString, {
        lighterDarker: this.concentrationIncreased() ? darkerString : lighterString
      } );
    }

    /**
     * Creates a substring to describe the change in the amount of solids
     * @param {boolean} [isCapitalized]
     * @public
     * @returns {string} - example: "more solids"
     */
    getSolidsChangeString( isCapitalized = false ) {
      assert && assert( this.precipitateAmountProperty.value > 0, 'precipitateAmountProperty should be greater than 0' );
      let moreLessString = isCapitalized ? lessCapitalizedString : lessString;
      if ( this.solidsIncreased() ) {
        moreLessString = isCapitalized ? moreCapitalizedString : moreString;
      }
      return StringUtils.fillIn( solidsChangePatternString, {
        moreLess: moreLessString
      } );
    }

    /**
     * determines if the solution is saturated but does not yet have any solids
     * @public
     * @returns {boolean}
     */
    isExactlySaturated() {
      return ( this.concentrationProperty.value === this.soluteProperty.value.saturatedConcentration &&
               this.solution.precipitateAmountProperty.value === 0 );
    }

    /**
     * Creates the string to be read out when the solution is either newly saturated or newly unsaturated.
     * @public
     * @returns {string}
     * */
    getSaturationChangedString() {
      assert && assert( this.saturationStateChanged(), 'saturation state has not changed' );
      const saturationLostAlertString = this.useQuantitativeDescriptionsProperty.value ?
                                        saturationLostQuantitativeAlertPatternString :
                                        saturationLostQualitativeAlertPatternString;
      return this.solution.isSaturated() ?
             StringUtils.fillIn( saturationReachedAlertString, {
               solidAmount: this.getCurrentSolidsAmount(),
               concentration: this.getCurrentConcentrationClause( true )
             } ) :
             StringUtils.fillIn( saturationLostAlertString, {
               concentration: this.getCurrentConcentrationClause( true )
             } );
    }

    /**
     * Creates the qualitative substrings to describe the concentration "state" of the solution.
     * @public
     * @returns {string} - examples: "Concentration 0.600 Molar" or "Solution very concentrated".
     * */
    getQualitativeConcentrationState() {
      assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'qualitative descriptions expected' );
      return StringUtils.fillIn( qualitativeConcentrationStatePatternString, {
        concentration: this.getCurrentConcentrationClause( true )
      } );
    }
  }

  /**
   * Calculates which item to use from the SOLIDS_STRINGS array.
   * @param {number} precipitateAmount - in moles, see Solution.js
   * @param {number} saturatedConcentration
   * @returns {number} - index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {

    // maximum precipitates possible for a given solute, which is the solute amount it takes to saturate at min volume.
    const maxPrecipitateAmount = Solution.computePrecipitateAmount( MolarityConstants.SOLUTION_VOLUME_RANGE.min,
      MolarityConstants.SOLUTE_AMOUNT_RANGE.max, saturatedConcentration );

    // the first region ("a couple of") is double the size of the others, so 1 more region must be
    // added to the length of SOLIDS_STRINGS. See https://github.com/phetsims/molarity/issues/148.
    const numberOfIncrements = SOLIDS_STRINGS.length + 1;
    const scaleIncrement = maxPrecipitateAmount / numberOfIncrements;

    for ( let i = 1; i < numberOfIncrements; i++ ) {
      if ( precipitateAmount < i * scaleIncrement - .001 ) {
        return i - 1;
      }
    }
    return SOLIDS_STRINGS.length - 1;
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
    const concentrationRounded = Util.toFixed( concentration, MolarityConstants.CONCENTRATION_DECIMAL_PLACES );

    if ( concentrationRounded > maxConcentration - .001 ) {
      return CONCENTRATION_STRINGS.length - 1;
    }
    else {
      for ( let i = 0; i < CONCENTRATION_STRINGS.length - 1; i++ ) {
        if ( concentrationRounded <= scaleIncrement * i - .001 ) {
          return i;
        }
      }
    }
  };

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );