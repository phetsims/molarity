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
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const barelyConcentratedString = MolarityA11yStrings.barelyConcentrated.value;
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const qualitativeConcentrationStatePatternString = MolarityA11yStrings.qualitativeConcentrationStatePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlert.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;

  // Concentration region strings
  const veryConcentratedString = MolarityA11yStrings.veryConcentrated.value;
  const concentratedString = MolarityA11yStrings.concentrated.value;
  const notConcentratedString = MolarityA11yStrings.notConcentrated.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentrated.value;
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;
  const someString = MolarityA11yStrings.some.value;

  // Solids region strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aCoupleOfString = MolarityA11yStrings.aCoupleOf.value;
  const aFewString = MolarityA11yStrings.aFew.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;

  // Change strings
  const lessString = MolarityA11yStrings.less.value;
  const moreString = MolarityA11yStrings.more.value;

  // constants
  const CONCENTRATION_STRINGS = [
    notConcentratedString,
    barelyConcentratedString,
    slightlyConcentratedString,
    concentratedString,
    veryConcentratedString
  ];

  const SOLIDS_STRINGS = [
    aCoupleOfString,
    aFewString,
    someString,
    aBunchOfString,
    aLotOfString
  ];

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {BooleanProperty} useQuantitativeDescriptions
     */
    constructor( solution, useQuantitativeDescriptions ) {

      // @public
      this.concentrationRegionChanged = null; // boolean - tracks whether the concentration descriptive region has changed

      // @private
      this.solution = solution;
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptions = useQuantitativeDescriptions;
      this.newSaturationState = false; // boolean -- tracks whether saturation has just changed
      this.concentrationRegion = null; // number - tracks the index of the last descriptive region for concentration
      this.concentrationChangeString = null; // string - tracks whether concentration has increased or decreased
      this.solidsRegion = null; // number - tracks the index of the last descriptive region for solids
      this.solidsRegionChanged = false; // boolean - tracks whether the solids descriptive region has changed
      this.solidsChangeString = null; // string - tracks whether there are more or less solids in the beaker

      this.concentrationProperty.link( ( newValue, oldValue ) => {
        const previousConcentrationRegion = this.concentrationRegion;
        const saturatedConcentration = this.soluteProperty.value.saturatedConcentration;
        const newConcentrationRegion = concentrationToIndex( saturatedConcentration, this.concentrationProperty.value );
        const previousSaturationState = oldValue >= this.soluteProperty.value.saturatedConcentration;
        const newSaturationState = this.solution.isSaturated();
        this.newSaturationState = newSaturationState !== previousSaturationState;
        this.concentrationChangeString = newValue > oldValue ? moreString : lessString;
        this.concentrationRegionChanged = newConcentrationRegion !== previousConcentrationRegion;
      } );

      //TODO: factor out into solids describer?
      this.precipitateAmountProperty.link( ( newValue, oldValue ) => {
        const previousSolidsRegion = this.solidsRegion;
        const previousSaturationState = oldValue > 0;
        const newSaturationState = newValue > 0;
        this.newSaturationState = newSaturationState !== previousSaturationState;
        this.solidsRegion = this.getCurrentSolidsAmount();
        this.solidsRegionChanged = this.solidsRegion !== previousSolidsRegion;
        this.solidsChangeString = newValue > oldValue ? moreString : lessString;
      } );
    }

    /**
     * TODO: support capitalized and lowercase more/less, perhaps with parameter?
     * Creates a substring to describe how concentration has changed
     * @public
     * @returns {string} - example: "more concentrated"
     */
    getConcentrationChangeString() {
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: this.concentrationChangeString
      } );
    }

    /**
     * Getter for newSaturationState
     * @public
     * @returns {boolean} - whether or not the solution has been newly saturated or unsaturated
     * */
    isNewSaturationState() {
      return this.newSaturationState;
    }

    /**
     * Creates the description strings that are read out when the solution is either newly saturated or newly unsaturated.
     * @public
     * @returns {string} - returns a string if the saturation state has changed
     * */
    getSaturationChangedString() {
      assert && assert( this.newSaturationState );
      return this.solution.isSaturated() ? saturationReachedAlertString : StringUtils.fillIn( saturationLostAlertPatternString, {
        concentration: this.getCurrentConcentration()
      } );
    }

    /**
     * Creates the quantitative and qualitative substrings to describe the concentration state of the solution.
     * @public
     * @returns {string} - examples: "Concentration 0.600 Molar" or "Solution very concentrated".
     * */
    getConcentrationState() {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptions.value ) {
        return StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
          concentration: this.getCurrentConcentration()
        } );
      }
      else {
        const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
        return StringUtils.fillIn( qualitativeConcentrationStatePatternString, {
          concentration: CONCENTRATION_STRINGS[ index ]
        } );
      }
    }

    /**
     * TODO: support capitalized and lowercase more/less, perhaps with parameter?
     * Creates a substring to describe the change in the amount of solids
     * @public
     * @returns {string} - example: "more solids"
     */
    getSolidsChangeString() {
      assert && assert( this.precipitateAmountProperty.value > 0 );
      return StringUtils.fillIn( solidsChangePatternString, {
        moreLess: this.solidsChangeString
      } );
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * @public
     * @returns {string} - quantitative or qualitative description of current concentration (e.g. "1.500 Molar" or "very concentrated")
     */
    getCurrentConcentration() {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptions.value ) {
        return StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( concentration, MConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
        return CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * Gets the saturated concentration amount of the currently selected solute.
     * @private
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the current amount of precipitates in the beaker.
     * @private
     * @returns {number}
     */
    getCurrentPrecipitates() {
      return this.precipitateAmountProperty.value;
    }

    /**
     * Gets the qualitative description of the amount of solids in the beaker.
     * @private
     * @returns {string} - example: "a bunch"
     */
    getCurrentSolidsAmount() {
      return SOLIDS_STRINGS[ solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() ) ];
    }

    /**
     * Fills in the state info if region has changed and the solution is saturated.
     * @public
     * @returns {string} - example: "still saturated with a bunch of solids"
     */
    getStillSaturatedClause() {
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: this.solidsRegionChanged ? StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.getCurrentSolidsAmount()
        } ) : ''
      } );
    }
  }

  /**
   * Calculates which item to use from the SOLIDS_STRINGS array.
   * @param {number} precipitateAmount
   * @param {number} saturatedConcentration
   * @returns {number} - index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {
    const fraction = ( 5 - saturatedConcentration ) / SOLIDS_STRINGS.length;
    if ( precipitateAmount <= fraction / 5 ) {
      return 0;
    }
    else if ( precipitateAmount <= 2 * fraction / 5 ) {
      return 1;
    }
    else if ( precipitateAmount <= 3 * fraction / 5 ) {
      return 2;
    }
    else if ( precipitateAmount <= 4 * fraction / 5 ) {
      return 3;
    }
    else {
      return 4;
    }
  };

  /**
   * Calculates the which item to use from the CONCENTRATION_STRINGS array.
   * @param {number} maxConcentration
   * @param {number} concentration
   * @returns {number} index to pull from CONCENTRATION_STRINGS array
   */
  const concentrationToIndex = ( maxConcentration, concentration ) => {
    const fraction = maxConcentration / ( CONCENTRATION_STRINGS.length );
    if ( concentration <= fraction ) {
      return 0;
    }
    else if ( concentration <= 2 * fraction ) {
      return 1;
    }
    else if ( concentration <= 3 * fraction ) {
      return 2;
    }
    else if ( concentration <= 4 * fraction ) {
      return 3;
    }
    else if ( concentration <= 5 * fraction ) {
      return 4;
    }
    else {
      return 5;
    }
  };

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );