// Copyright 2019, University of Colorado Boulder

/**
 * SolutionDescriber is responsible for generating all of the strings used for PDOM content and alerts in Molarity.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const beakerDescriptionString = MolarityA11yStrings.beakerDescription.value;
  const solutionConcentrationPatternString = MolarityA11yStrings.solutionConcentrationPattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;

  const fullString = MolarityA11yStrings.fullString.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFullString.value;
  const overHalfString = MolarityA11yStrings.overHalfString.value;
  const halfFullString = MolarityA11yStrings.halfFullString.value;
  const underHalfString = MolarityA11yStrings.underHalfString.value;
  const lowString = MolarityA11yStrings.lowString.value;
  const leastAmountString = MolarityA11yStrings.leastAmountString.value;

  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;
  const sliderMovedAlertPatternString = MolarityA11yStrings.sliderMovedAlertPattern.value;
  const stateInfoPatternString = MolarityA11yStrings.stateInfoPattern.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlertString.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;
  const volumeStateInfoPatternString = MolarityA11yStrings.volumeStateInfoPattern.value;
  const soluteAmountStateInfoPatternString = MolarityA11yStrings.soluteAmountStateInfoPattern.value;


  const notConcentratedString = MolarityA11yStrings.notConcentratedString.value;
  const barelyConcentratedString = MolarityA11yStrings.barelyConcentratedString.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentratedString.value;
  const concentratedString = MolarityA11yStrings.concentratedString.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentratedString.value;

  const zeroString = MolarityA11yStrings.zeroString.value;
  const aLittleString = MolarityA11yStrings.aLittleString.value;
  const aLowString = MolarityA11yStrings.aLowString.value;
  const someString = MolarityA11yStrings.someString.value;
  const aBunchString = MolarityA11yStrings.aBunchString.value;
  const aLotString = MolarityA11yStrings.aLotString.value;
  const fullAmountString = MolarityA11yStrings.fullAmountString.value;
  const aCoupleString = MolarityA11yStrings.aCoupleString.value;
  const aFewString = MolarityA11yStrings.aFewString.value;

  const saturatedString = MolarityA11yStrings.saturatedString.value;
  const notSaturatedString = MolarityA11yStrings.notSaturatedString.value;

  const moreString = MolarityA11yStrings.moreString.value;
  const lessString = MolarityA11yStrings.lessString.value;

  const solutionString = MolarityA11yStrings.solutionString.value;
  const soluteString = MolarityA11yStrings.soluteString.value;
  const solidsString = MolarityA11yStrings.solidsString.value;

  // constants
  const VOLUME_STRINGS = [
    leastAmountString,
    lowString,
    underHalfString,
    halfFullString,
    overHalfString,
    nearlyFullString,
    fullString
  ];

  const CONCENTRATION_STRINGS = [
    notConcentratedString,
    barelyConcentratedString,
    slightlyConcentratedString,
    concentratedString,
    veryConcentratedString
  ];

  const SOLUTE_AMOUNT_STRINGS = [
    zeroString,
    aLittleString,
    aLowString,
    someString,
    aBunchString,
    aLotString,
    fullAmountString
  ];

  const SOLIDS_STRINGS = [
    aCoupleString,
    aFewString,
    someString,
    aBunchString,
    aLotString
  ];

  /** calculates the which item to use from the SOLUTE_AMOUNT_STRINGS array
   * @param {number} soluteAmount
   * @returns {number} index (integer) to pull from SOLUTE_AMOUNT_STRINGS array
   */
  const soluteAmountToIndex = ( soluteAmount ) => {
    if ( soluteAmount <= 0.050 ) {
      return 0;
    }
    if ( soluteAmount <= .200 ) {
      return 1;
    }
    if ( soluteAmount <= .450 ) {
      return 2;
    }
    if ( soluteAmount <= .650 ) {
      return 3;
    }
    if ( soluteAmount <= .850 ) {
      return 4;
    }
    if ( soluteAmount <= .950 ) {
      return 5;
    }
    if ( soluteAmount <= 1.000 ) {
      return 6;
    }
  };

  /** calculates the which item to use from the VOLUME_STRINGS array
   * @param {number} volume
   * @returns {number} index to pull from VOLUME_STRINGS array
   */
  const volumeToIndex = ( volume ) => {
    if ( volume <= .220 ) {
      return 0;
    }
    if ( volume <= .330 ) {
      return 1;
    }
    if ( volume <= .410 ) {
      return 2;
    }
    if ( volume <= .530 ) {
      return 3;
    }
    if ( volume <= .780 ) {
      return 4;
    }
    if ( volume <= .960 ) {
      return 5;
    }
    if ( volume <= 1.000 ) {
      return 6;
    }
  };

  /** calculates the which item to use from the CONCENTRATION_STRINGS array
   * @param {number} concentration
   * @returns {number} index to pull from CONCENTRATION_STRINGS array
   */
  const concentrationToIndex = ( concentration, saturatedConcentration ) => {
    const maxConcentration = saturatedConcentration;
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

  /** calculates the which item to use from the SOLIDS_STRINGS array
   * @param {number} precipitateAmount
   * @returns {number} index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {
    const fraction = ( 5 - saturatedConcentration ) / SOLIDS_STRINGS.length;
    if ( precipitateAmount <= fraction ) {
      return 0;
    }
    if ( precipitateAmount <= 2 * fraction ) {
      return 1;
    }
    if ( precipitateAmount <= 3 * fraction ) {
      return 2;
    }
    if ( precipitateAmount <= 4 * fraction ) {
      return 3;
    }
    if ( precipitateAmount <= 5 * fraction ) {
      return 4;
    }
    if ( precipitateAmount <= 6 * fraction ) {
      return 5;
    }
  };

  class SolutionDescriber {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( solution, valuesVisibleProperty ) {

      // @private
      this.solution = solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.concentrationRegion = 0; // tracks the last descriptive region for concentration
      this.volumeRegion = 0; // tracks the last descriptive region for volume
      this.soluteAmountRegion = 0; // tracks the last descriptive region for solute amount
      this.solidsRegion = 0; // tracks the last descriptive region for amount of solids
      this.saturatedYet = false; // tracks whether the solution was saturated on the previous slider move
    }

    /**
     * gets the current value of volume either quantitatively or quantitatively to plug into descriptions
     * @private
     * @returns {string} - quantitative or qualitative description of current volume
     */
    getCurrentVolume() {
      if ( this.valuesVisibleProperty.value ) {
        return Util.toFixed( this.solution.volumeProperty.value, 3 );
      }
      else {
        return VOLUME_STRINGS[ volumeToIndex( this.solution.volumeProperty.value ) ];
      }
    }

    /**
     * gets the current value of concentration either quantitatively or quantitatively to plug into descriptions
     * @private
     * @returns {number | string } quantitative or qualitative description of current concentration
     */
    getCurrentConcentration() {
      if ( this.valuesVisibleProperty.value ) {
        return Util.toFixed( this.solution.concentrationProperty.value, 3 );
      }
      else {
        const saturatedConcentration = this.solution.soluteProperty.value.saturatedConcentration;
        const concentration = this.solution.concentrationProperty.value;
        return CONCENTRATION_STRINGS[ concentrationToIndex( concentration, saturatedConcentration ) ];
      }
    }

    /**
     * gets the current value of solute amount either quantitatively or quantitatively to plug into descriptions
     * @private
     * @returns {number | string } quantitative or qualitative description of current solute amount
     */
    getCurrentSoluteAmount() {
      if ( this.valuesVisibleProperty.value ) {
        return Util.toFixed( this.solution.soluteAmountProperty.value, 3 );
      }
      else {
        const index = Util.roundSymmetric( soluteAmountToIndex( this.solution.soluteAmountProperty.value ) );
        return SOLUTE_AMOUNT_STRINGS[ index ];
      }
    }

    /**
     * gets the name of the current solute selected
     * @private
     * @returns { string } name of current solute
     */
    getCurrentSolute() {
      return this.solution.soluteProperty.value.name;
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
     * Describes all relevant properties in the screen summary.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {
      let saturatedConcentration = '';
      let concentrationPattern = '';

      // boolean -- determines if solution is currently saturated
      const isCurrentlySaturated = this.solution.concentrationProperty.value >= this.getCurrentSaturatedConcentration();
      if ( isCurrentlySaturated ) {
        saturatedConcentration = saturatedString;
      }

      // changes values to fill in if the "Show Values" checkbox is not checked
      if ( !this.valuesVisibleProperty.value ) {
        concentrationPattern = StringUtils.fillIn( solutionConcentrationPatternString, {
          concentration: this.getCurrentConcentration(),
          saturatedConcentration: saturatedConcentration === '' ? notSaturatedString : saturatedConcentration
        } );
      }

      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: this.getCurrentVolume(),
        solute: this.getCurrentSolute(),
        soluteAmount: this.getCurrentSoluteAmount(),
        concentrationClause: concentrationPattern,
        saturatedConcentration: saturatedConcentration
      } );
    }

    /**
     * Describes the concentration level in the beaker in the play area.
     * @public
     * @returns {string}
     */
    getBeakerDescription() {
      return StringUtils.fillIn( beakerDescriptionString, {
        solute: this.getCurrentSolute(),
        concentration: this.getCurrentConcentration(),
        maxConcentration: this.getCurrentSaturatedConcentration(),
        chemicalFormula: this.solution.soluteProperty.value.formula
      } );
    }

    /**
     * Fills in the final slider alert once stateInfo and concentratedOrSolids has been determined
     * @param {boolean} increasing
     * @param {boolean} isVolume
     * @param {string} stateInfo
     * @param {string} concentratedOrSolids
     * @private
     * @returns {string}
     */
    fillInSliderAlertString( increasing, isVolume, stateInfo, concentratedOrSolids ) {
      const moreLess = increasing ? moreString : lessString;
      const lessMore = ( increasing && isVolume ) || ( !increasing && !isVolume ) ? lessString : moreString;
      const sliderType = ( isVolume ) ? solutionString : soluteString;
      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        moreLess: moreLess,
        lessMore: lessMore,
        stateInfo: stateInfo,
        concentratedOrSolids: concentratedOrSolids,
        sliderType: sliderType
      } );
    }


    /**
     * Checks to see if any descriptive regions have changed for any quantity, and updates to reflect new regions
     * @private
     * @returns {boolean} - whether or not there was a region to update
     */
    updateRegions() {
      const saturatedConcentration = this.solution.soluteProperty.value.saturatedConcentration;
      const concentration = this.solution.concentrationProperty.value;
      const concentrationIndex = concentrationToIndex( concentration, saturatedConcentration );
      const soluteAmountIndex = soluteAmountToIndex( this.solution.soluteAmountProperty.value );
      const volumeIndex = volumeToIndex( this.solution.volumeProperty.value );
      const solidsIndex = solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() );

      const isNewConcentrationRegion = this.concentrationRegion !== concentrationIndex;
      const isNewSoluteAmountRegion = this.soluteAmountRegion !== soluteAmountIndex;
      const isNewVolumeRegion = this.volumeRegion !== volumeIndex;
      const isNewSolidsRegion = this.solidsRegion !== solidsIndex;

      // checks to see if any region has changed
      const isNewRegion = isNewConcentrationRegion || isNewSoluteAmountRegion || isNewVolumeRegion || isNewSolidsRegion;

      // update the region to the new one if a region has changed
      if ( isNewRegion ) {
        this.concentrationRegion = concentrationIndex;
        this.soluteAmountRegion = soluteAmountIndex;
        this.volumeRegion = volumeIndex;
        this.solidsRegion = solidsIndex;
      }

      return isNewRegion;
    }

    /**
     * fills in the state info if region has changed and the solution is saturated
     * @private
     * @returns {string}
     */
    getStateInfoSaturatedRegionChange() {

      // updates the current region for the solids array
      this.solidsRegion = solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() );

      // fills in the state info with a description of the amount of solids
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: SOLIDS_STRINGS[ solidsToIndex( this.getCurrentPrecipitates(), this.getCurrentSaturatedConcentration() )]
        } )
      } );
    }


    /**
     * fills in the state info if region has changed and the solution is not saturated
     * @param {boolean} isVolume
     * @private
     * @returns {string}
     */
    getStateInfoNotSaturated( isVolume ) {
      const volumeStateInfo = ( isVolume ) ? StringUtils.fillIn( volumeStateInfoPatternString, {
        volume: this.getCurrentVolume()
      } ) : '';
      const soluteAmountStateInfo = ( isVolume ) ? '' : StringUtils.fillIn( soluteAmountStateInfoPatternString, {
        solute: this.getCurrentSolute(),
        soluteAmount: this.getCurrentSoluteAmount()
      } );
      return StringUtils.fillIn( stateInfoPatternString, {
        concentration: this.getCurrentConcentration(),
        volumeClause: volumeStateInfo,
        soluteAmountClause: soluteAmountStateInfo
      } );
    }

    /**
     * Describes the volume or the solute amount in the beaker in the play area.
     * @param {boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @param {boolean} isVolume - indicates whether the slider moved is the volume slider
     * @public
     * @returns {string}
     */
    getSliderAlertString( increasing, isVolume ) {
      let stateInfo = '';
      let concentratedOrSolids = concentratedString;
      const isCurrentlySaturated = this.solution.concentrationProperty.value >= this.getCurrentSaturatedConcentration();

      // saturation status has changed (solution has either become saturated or lost saturation)
      if ( isCurrentlySaturated && !this.saturatedYet ) {
        this.saturatedYet = true;
        return saturationReachedAlertString;
      }
      else if ( !isCurrentlySaturated && this.saturatedYet ) {
        this.saturatedYet = false;
        return StringUtils.fillIn( saturationLostAlertPatternString, {
          concentration: this.getCurrentConcentration()
        } );
      }
      // is saturated and region for solids description has changed
      else if ( isCurrentlySaturated && this.updateRegions() ) {
        concentratedOrSolids = solidsString;
        stateInfo = this.getStateInfoSaturatedRegionChange();
      }
      // is saturated and region has not changed
      else if ( isCurrentlySaturated ) {
        concentratedOrSolids = solidsString;
        stateInfo = StringUtils.fillIn( stillSaturatedAlertPatternString, { withSolids: '' } );
      }
      // is not saturated and region has changed
      else if ( !isCurrentlySaturated && this.updateRegions() ) {
        stateInfo = this.getStateInfoNotSaturated( isVolume );
      }
      return this.fillInSliderAlertString( increasing, isVolume, stateInfo, concentratedOrSolids );
    }

    /**
     * Describes the new solute when a user changes the solute in the combo box
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.solution.soluteProperty.value.name,
        maxConcentration: this.getCurrentSaturatedConcentration()
      } );
    }
  }

  return molarity.register( 'SolutionDescriber', SolutionDescriber );
} )
;