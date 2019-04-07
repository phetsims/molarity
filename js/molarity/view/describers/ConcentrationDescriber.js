// Copyright 2019, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for generating strings about ConcentrationProperty. Also includes alert text for alerts past saturation point
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;

  const notConcentratedString = MolarityA11yStrings.notConcentratedString.value;
  const barelyConcentratedString = MolarityA11yStrings.barelyConcentratedString.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentratedString.value;
  const concentratedString = MolarityA11yStrings.concentratedString.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentratedString.value;

  const someString = MolarityA11yStrings.someString.value;
  const aBunchString = MolarityA11yStrings.aBunchString.value;
  const aLotString = MolarityA11yStrings.aLotString.value;
  const aCoupleString = MolarityA11yStrings.aCoupleString.value;
  const aFewString = MolarityA11yStrings.aFewString.value;


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

  /** calculates the which item to use from the SOLIDS_STRINGS array
   * @param {number} precipitateAmount
   * @param {number} saturatedConcentration
   * @returns {number} index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {
    const fraction = ( 5 - saturatedConcentration ) / SOLIDS_STRINGS.length;
    if ( precipitateAmount <= fraction / 5 ) {
      return 0;
    }
    if ( precipitateAmount <= 2 * fraction / 5 ) {
      return 1;
    }
    if ( precipitateAmount <= 3 * fraction / 5 ) {
      return 2;
    }
    if ( precipitateAmount <= 4 * fraction / 5 ) {
      return 3;
    }
    if ( precipitateAmount <= 5 * fraction / 5 ) {
      return 4;
    }
  };

  /** calculates the which item to use from the CONCENTRATION_STRINGS array
   * @returns {number} index to pull from CONCENTRATION_STRINGS array
   */
  const concentrationToIndex = ( maxConcentration, concentration ) => {
    const fraction = maxConcentration / ( CONCENTRATION_STRINGS.length );
    if ( concentration <= fraction ) {
      return 0;
    }
    if ( concentration <= 2 * fraction ) {
      return 1;
    }
    if ( concentration <= 3 * fraction ) {
      return 2;
    }
    if ( concentration <= 4 * fraction ) {
      return 3;
    }
    if ( concentration <= 5 * fraction ) {
      return 4;
    }
    if ( concentration <= 6 * fraction ) {
      return 5;
    }
  };

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( solution, valuesVisibleProperty ) {

      // @private
      this.solution = solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.concentrationRegion = 0; // tracks the last descriptive region for concentration
      this.solidsRegion = 0; // tracks the last descriptive region for solids
    }

    /**
     * gets the current value of concentration either quantitatively or quantitatively to plug into descriptions
     * @public
     * @returns {number | string } quantitative or qualitative description of current concentration
     */
    getCurrentConcentration() {
      const concentration = this.solution.concentrationProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        return Util.toFixed( concentration, 3 );
      }
      else {
        const index = concentrationToIndex( this.solution.soluteProperty.value.saturatedConcentration, concentration );
        return CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * gets the saturated concentration amount of the currently selected solute.
     * @private
     * @returns { Number }
     */
    getCurrentSaturatedConcentration() {
      return this.solution.soluteProperty.value.saturatedConcentration;
    }

    /**
     * gets the saturated concentration amount of the currently selected solute.
     * @private
     * @returns { Number }
     */
    getCurrentPrecipitates() {
      return this.solution.precipitateAmountProperty.value;
    }

    /**
     * gets the saturated concentration amount of the currently selected solute.
     * @public
     * @returns { Number }
     */
    getCurrentSolidsAmount() {
      return SOLIDS_STRINGS[ solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() ) ];
    }

    /**
     * Checks to see if any descriptive regions have changed for any quantity, and updates to reflect new regions
     * @private
     * @returns {boolean} - whether or not there was a region to update
     */
    updateSolidsRegion() {
      const solidsIndex = solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() );
      const isNewSolidsRegion = this.solidsRegion !== solidsIndex;

      // checks to see if any region has changed
      if ( isNewSolidsRegion ) {
        this.solidsRegion = solidsIndex;
      }
      return isNewSolidsRegion;
    }


    /**
     * fills in the state info if region has changed and the solution is saturated
     * @private
     * @returns {string}
     */
    getStateInfoSaturatedRegionChange() {

      // updates the current region for the solids array
      this.updateSolidsRegion();

      // fills in the state info with a description of the amount of solids
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.getCurrentSolidsAmount()
        } )
      } );
    }

    /**
     * Checks to see if any descriptive regions have changed for any quantity, and updates to reflect new regions
     * @private
     * @returns {boolean} - whether or not there was a region to update
     */
    updateConcentrationRegion() {
      const concentration = this.solution.concentrationProperty.value;
      const saturatedConcentration = this.solution.soluteProperty.value.saturatedConcentration;
      const concentrationIndex = concentrationToIndex( saturatedConcentration, concentration );
      const isNewConcentrationRegion = this.concentrationRegion !== concentrationIndex;

      // update the region to the new one if a region has changed
      if ( isNewConcentrationRegion ) {
        this.concentrationRegion = concentrationIndex;
      }

      return isNewConcentrationRegion;
    }
  }

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );