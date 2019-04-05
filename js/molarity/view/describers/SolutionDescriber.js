// Copyright 2019, University of Colorado Boulder

/**
 * SolutionDescriber is responsible for generating all of the strings used for PDOM content and alerts in Molarity.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ConcentrationDescriber = require( 'MOLARITY/molarity/view/describers/ConcentrationDescriber' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const SoluteDescriber = require( 'MOLARITY/molarity/view/describers/SoluteDescriber' );
  const SoluteAmountDescriber = require( 'MOLARITY/molarity/view/describers/SoluteAmountDescriber' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const VolumeDescriber = require( 'MOLARITY/molarity/view/describers/VolumeDescriber' );

  // a11y strings
  const beakerDescriptionString = MolarityA11yStrings.beakerDescription.value;
  const solutionConcentrationPatternString = MolarityA11yStrings.solutionConcentrationPattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;

  const soluteAmountSliderAriaValueTextPatternString = MolarityA11yStrings.soluteAmountSliderAriaValueTextPattern.value;
  const volumeSliderAriaValueTextPatternString = MolarityA11yStrings.volumeSliderAriaValueTextPattern.value;
  const volumeSliderValuesVisibleAriaValueTextPatternString = MolarityA11yStrings.volumeSliderValuesVisibleAriaValueTextPattern.value;

  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;
  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;

  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlertString.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;

  const volumeSliderMovedAlertPatternString = MolarityA11yStrings.volumeSliderMovedAlertPattern.value;
  const volumeSliderMovedSolidsAlertPatternString = MolarityA11yStrings.volumeSliderMovedSolidsAlertPattern.value;
  const soluteAmountSliderMovedAlertPatternString = MolarityA11yStrings.soluteAmountSliderMovedAlertPattern.value;
  const soluteAmountSliderMovedSolidsAlertPatternString = MolarityA11yStrings.soluteAmountSliderMovedSolidsAlertPattern.value;
  const sliderAlertStateInfoValuesVisiblePatternString = MolarityA11yStrings.sliderAlertStateInfoValuesVisiblePattern.value;

  const saturatedString = MolarityA11yStrings.saturatedString.value;
  const notSaturatedString = MolarityA11yStrings.notSaturatedString.value;

  const moreString = MolarityA11yStrings.moreString.value;
  const lessString = MolarityA11yStrings.lessString.value;

  class SolutionDescriber {

    /**
     * @param {Solution} solution - from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( solution, valuesVisibleProperty ) {

      // @private
      this.solution = solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.volumeDescriber = new VolumeDescriber( solution.volumeProperty, solution.soluteProperty, valuesVisibleProperty );
      this.soluteDescriber = new SoluteDescriber( solution.soluteProperty, valuesVisibleProperty );
      this.soluteAmountDescriber = new SoluteAmountDescriber( solution.soluteAmountProperty, solution.soluteProperty, valuesVisibleProperty );
      this.concentrationDescriber = new ConcentrationDescriber( solution, valuesVisibleProperty );
      this.saturatedYet = false; // tracks whether the solution was saturated on the previous slider move
    }

    /**
     * Describes all relevant properties in the screen summary.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {
      let saturatedConcentration = '';
      let concentrationPattern = '';

      // determines if solution is currently saturated
      const isCurrentlySaturated = this.solution.concentrationProperty.value >= this.soluteDescriber.getCurrentSaturatedConcentration();
      if ( isCurrentlySaturated ) {
        saturatedConcentration = saturatedString;
      }

      // changes values to fill in if the "Show Values" checkbox is not checked
      if ( !this.valuesVisibleProperty.value ) {
        concentrationPattern = StringUtils.fillIn( solutionConcentrationPatternString, {
          concentration: this.concentrationDescriber.getCurrentConcentration(),
          saturatedConcentration: saturatedConcentration === '' ? notSaturatedString : saturatedConcentration
        } );
      }
      else {
        concentrationPattern = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }

      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: this.volumeDescriber.getCurrentVolume(),
        solute: this.soluteDescriber.getCurrentSolute(),
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount(),
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
        solute: this.soluteDescriber.getCurrentSolute(),
        concentration: this.concentrationDescriber.getCurrentConcentration(),
        maxConcentration: this.soluteDescriber.getCurrentSaturatedConcentration(),
        chemicalFormula: this.soluteDescriber.getCurrentChemicalFormula()
      } );
    }

    /**
     * Checks to see if any descriptive regions have changed for any quantity, and updates to reflect new regions
     * @private
     * @returns {boolean} - whether or not there was a region to update
     */
    updateRegions() {
      const isNewConcentrationRegion = this.concentrationDescriber.updateConcentrationRegion();
      const isNewSoluteAmountRegion = this.soluteAmountDescriber.updateSoluteAmountRegion();
      const isNewVolumeRegion = this.volumeDescriber.updateVolumeRegion();

      // checks to see if any region has changed
      return isNewConcentrationRegion || isNewSoluteAmountRegion || isNewVolumeRegion;
    }

    /**
     * Describes the volume or the solute amount in the beaker in the play area.
     * @param {boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getVolumeSliderAlertString( increasing ) {
      let stateInfo = '';
      let string = '';
      const isSaturated = this.solution.concentrationProperty.value >= this.soluteDescriber.getCurrentSaturatedConcentration();
      const moreLess = increasing ? moreString : lessString;
      const lessMore = increasing ? lessString : moreString;

      if ( isSaturated ) {
        string = volumeSliderMovedSolidsAlertPatternString;
        stateInfo = StringUtils.fillIn( stillSaturatedAlertPatternString, { withSolids: '' } );
      }
      else {
        string = volumeSliderMovedAlertPatternString;
      }
      // saturation status has changed (solution has either become saturated or lost saturation)
      if ( isSaturated && !this.saturatedYet ) {
        this.saturatedYet = true;
        return saturationReachedAlertString;
      }
      else if ( !isSaturated && this.saturatedYet ) {
        this.saturatedYet = false;
        return StringUtils.fillIn( saturationLostAlertPatternString, {
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      // is saturated and region for solids description has changed
      else if ( isSaturated && this.concentrationDescriber.updateSolidsRegion() ) {
        stateInfo = this.concentrationDescriber.getStateInfoSaturatedRegionChange();
      }
      // is not saturated and region has changed
      else if ( !isSaturated && this.updateRegions() ) {
        stateInfo = this.volumeDescriber.getVolumeStateInfoNotSaturated();
      }

      // returns different strings depending on whether the 'show values' checkbox is checked
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( sliderAlertStateInfoValuesVisiblePatternString, {
          quantity: this.volumeDescriber.getCurrentVolume(),
          moreLess: moreLess,
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      else {
        return StringUtils.fillIn( string, {
          moreLess: moreLess,
          lessMore: lessMore,
          stateInfo: stateInfo
        } );
      }
    }

    /**
     * Describes the volume or the solute amount in the beaker in the play area.
     * @param {boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getSoluteAmountSliderAlertString( increasing ) {
      let stateInfo = '';
      let string = '';
      const isSaturated = this.solution.concentrationProperty.value >= this.soluteDescriber.getCurrentSaturatedConcentration();
      const moreLess = increasing ? moreString : lessString;
      const lessMore = increasing ? lessString : moreString;

      if ( isSaturated ) {
        string = soluteAmountSliderMovedSolidsAlertPatternString;
        stateInfo = StringUtils.fillIn( stillSaturatedAlertPatternString, { withSolids: '' } );
      }
      else {
        string = soluteAmountSliderMovedAlertPatternString;
      }
      // saturation status has changed (solution has either become saturated or lost saturation)
      if ( isSaturated && !this.saturatedYet ) {
        this.saturatedYet = true;
        return saturationReachedAlertString;
      }
      else if ( !isSaturated && this.saturatedYet ) {
        this.saturatedYet = false;
        return StringUtils.fillIn( saturationLostAlertPatternString, {
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      // is saturated and region for solids description has changed
      else if ( isSaturated && this.concentrationDescriber.updateSolidsRegion() ) {
        stateInfo = this.concentrationDescriber.getStateInfoSaturatedRegionChange();
      }
      // is not saturated and region has changed
      else if ( !isSaturated && this.updateRegions() ) {
        stateInfo = this.soluteAmountDescriber.getSoluteAmountStateInfoNotSaturated();
      }

      // returns different strings depending on whether the 'show values' checkbox is checked
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( sliderAlertStateInfoValuesVisiblePatternString, {
          quantity: this.soluteAmountDescriber.getCurrentSoluteAmount(),
          moreLess: moreLess,
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      else {
        return StringUtils.fillIn( string, {
          moreLess: moreLess,
          lessMore: lessMore,
          stateInfo: stateInfo
        } );
      }
    }

    /**
     * Describes the new solute when a user changes the solute in the combo box
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.solution.soluteProperty.value.name,
        maxConcentration: this.soluteDescriber.getCurrentSaturatedConcentration()
      } );
    }

    /**
     * Creates the string to be used as the solute amount slider's aria-valueText on focus
     * @public
     * @returns {string}
     */
    getSoluteAmountAriaValueText() {
      return StringUtils.fillIn( soluteAmountSliderAriaValueTextPatternString, {
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount(),
        solute: this.soluteDescriber.getCurrentSolute()
      } );
    }

    /**
     * Creates the string to be used as the volume slider's aria-valueText on focus
     * @public
     * @returns {string}
     */
    getVolumeAriaValueText() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( volumeSliderValuesVisibleAriaValueTextPatternString, {
          volume: this.volumeDescriber.getCurrentVolume()
        } );
      }
      else {
        return StringUtils.fillIn( volumeSliderAriaValueTextPatternString, {
          volume: this.volumeDescriber.getCurrentVolume()
        } );
      }

    }
  }

  return molarity.register( 'SolutionDescriber', SolutionDescriber );
} );