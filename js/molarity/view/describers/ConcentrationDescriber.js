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
  const aBunchString = MolarityA11yStrings.aBunchString.value; // TODO: include "of" in name
  const aCoupleString = MolarityA11yStrings.aCoupleString.value;
  const aFewString = MolarityA11yStrings.aFewString.value;
  const aLotString = MolarityA11yStrings.aLotString.value;
  const barelyConcentratedString = MolarityA11yStrings.barelyConcentratedString.value;
  const concentratedString = MolarityA11yStrings.concentratedString.value;
  const notConcentratedString = MolarityA11yStrings.notConcentratedString.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentratedString.value;
  const someString = MolarityA11yStrings.someString.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentratedString.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;
  const lessString = MolarityA11yStrings.lessString.value;
  const moreString = MolarityA11yStrings.moreString.value;
  const qualitativeConcentrationStatePatternString = MolarityA11yStrings.qualitativeConcentrationStatePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlertString.value;

  // constants
  const CONCENTRATION_STRINGS = [
    notConcentratedString,
    barelyConcentratedString,
    slightlyConcentratedString,
    concentratedString,
    veryConcentratedString
  ];

  const SOLIDS_STRINGS = [
    aCoupleString,
    aFewString,
    someString,
    aBunchString,
    aLotString
  ];

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {BooleanProperty} valuesVisibleProperty - whether values are visible in the view.
     */
    constructor( solution, valuesVisibleProperty ) {

      // @private
      this.solution = solution;
      this.saturatedConcentration = this.solution.soluteProperty.value.saturatedConcentration;
      this.isSaturated = null;
      this.newSaturationState = false;
      this.valuesVisibleProperty = valuesVisibleProperty;

      // concentration state properties
      this.concentrationRegion = 0; // tracks the last descriptive region for concentration
      this.concentrationChangeString = lessString; // tracks whether concentration has increased or decreased
      this.concentrationRegionChanged = null; // tracks whether the concentration descriptive region has changed

      // solids state properties
      this.solidsRegion = null; // tracks the last descriptive region for solids, filled in below
      this.solidsRegionChanged = false; // TODO: doc
      this.solidsChangeString = false; // TODO: doc

      this.solution.concentrationProperty.link( ( newValue, oldValue ) => {
        const previousConcentrationRegion = this.concentrationRegion;
        const newConcentrationRegion = concentrationToIndex( this.saturatedConcentration, this.solution.concentrationProperty.value );
        const previousSaturationState = oldValue > this.solution.soluteProperty.value.saturatedConcentration;
        const newSaturationState = newValue > this.solution.soluteProperty.value.saturatedConcentration;
        this.newSaturationState = newSaturationState !== previousSaturationState;
        this.isSaturated = newSaturationState;
        this.concentrationChangeString = newValue > oldValue ? moreString : lessString;
        this.concentrationRegionChanged = newConcentrationRegion !== previousConcentrationRegion;
      } );

      this.solution.precipitateAmountProperty.link( ( newValue, oldValue ) => {
        const previousSolidsRegion = this.solidsRegion;
        const previousSaturationState = oldValue > 0;
        const newSaturationState = newValue > 0;
        this.newSaturationState = newSaturationState !== previousSaturationState;
        this.isSaturated = newSaturationState;
        this.solidsRegion = this.getCurrentSolidsAmount();
        this.solidsRegionChanged = this.solidsRegion !== previousSolidsRegion;
        this.solidsChangeString = newValue > oldValue ? moreString : lessString;
      } );
    }

    /**
     * TODO: support capitalized and lowercase more/less, perhaps with parameter?
     * @returns {string} - like "more concentrated"
     */
    getConcentrationChangeString() {
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: this.concentrationChangeString
      } );
    }

    /*
    * Creates the description strings that are read out when the solution is either newly saturated or newly unsaturated.
    * @public
    * @returns {string | boolean} - returns a string if the saturation state has changed, otherwise returns false.
    * */
    getSaturationChangedString() {
      if ( this.newSaturationState ) {
        return this.isSaturated ? saturationReachedAlertString : StringUtils.fillIn( saturationLostAlertPatternString, {
          concentration: this.getCurrentConcentration()
        } );
      }
      else {
        return false;
      }
    }

    /*
    * Creates the quantitative and qualitative substrings to describe the concentration state of the solution.
    * @public
    * @returns {string} - like "Concentration 0.600 Molar" or "Solution very concentrated".
    * */
    getConcentrationState() {
      const concentration = this.solution.concentrationProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
          concentration: Util.toFixed( concentration, MConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const index = concentrationToIndex( this.solution.soluteProperty.value.saturatedConcentration, concentration );
        return StringUtils.fillIn( qualitativeConcentrationStatePatternString, {
          concentration: CONCENTRATION_STRINGS[ index ]
        } );
      }
    }

    /**
     * TODO: support capitalized and lowercase more/less, perhaps with parameter?
     * @returns {string} - like "more concentrated"
     */
    getSolidsChangeString() {
      // TODO: assert that there is some precipitate
      return StringUtils.fillIn( solidsChangePatternString, {
        moreLess: this.solidsChangeString
      } );
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * @public
     * @returns {number|string} - quantitative or qualitative description of current concentration (e.g. 1.500 or "very concentrated")
     */
    getCurrentConcentration() {
      const concentration = this.solution.concentrationProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        return Util.toFixed( concentration, MConstants.CONCENTRATION_DECIMAL_PLACES );
      }
      else {
        const index = concentrationToIndex( this.solution.soluteProperty.value.saturatedConcentration, concentration );
        return CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * Gets the saturated concentration amount of the currently selected solute.
     * @private
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.solution.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the current amount of precipitates in the beaker.
     * @private
     * @returns {number}
     */
    getCurrentPrecipitates() {
      return this.solution.precipitateAmountProperty.value;
    }

    /**
     * Gets the qualitative description of the amount of solids in the beaker.
     * @public
     * @returns {string}
     */
    getCurrentSolidsAmount() {
      return SOLIDS_STRINGS[ solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() ) ];
    }

    /**
     * Fills in the state info if region has changed and the solution is saturated.
     * @public
     * @returns {string}
     */
    getStillSaturatedClause() {

      // Fills in the state info with a description of the amount of solids.
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