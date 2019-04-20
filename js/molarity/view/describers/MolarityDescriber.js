// Copyright 2019, University of Colorado Boulder

/**
 * MolarityDescriber is responsible for generating all of the strings used for PDOM content and alerts in Molarity.
 * Because many alerts require information about all four Properties (concentration, solute amount, volume, and solute),
 * a more general describer is required to put that information together.
 *
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
  const notSaturatedString = MolarityA11yStrings.notSaturatedString.value;
  const saturatedString = MolarityA11yStrings.saturatedString.value;
  const soluteAmountSliderAriaValueTextPatternString = MolarityA11yStrings.soluteAmountSliderAriaValueTextPattern.value;
  const solutionConcentrationPatternString = MolarityA11yStrings.solutionConcentrationPattern.value;
  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;
  const stateOfSimNoSolutePatternString = MolarityA11yStrings.stateOfSimNoSolutePattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;
  const volumeSliderAriaValueTextPatternString = MolarityA11yStrings.volumeSliderAriaValueTextPattern.value;
  const volumeSliderValuesVisibleAriaValueTextPatternString = MolarityA11yStrings.volumeSliderValuesVisibleAriaValueTextPattern.value;
  const showValuesCheckedAlertString = MolarityA11yStrings.showValuesCheckedAlert.value;
  const showValuesUncheckedAlertString = MolarityA11yStrings.showValuesUncheckedAlert.value;

  class MolarityDescriber {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {BooleanProperty} valuesVisibleProperty - whether values are visible in the view.
     */
    constructor( solution, valuesVisibleProperty ) {

      // @private
      this.solution = solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.saturatedYet = false; // tracks whether the solution was saturated on the previous slider move
      this.initialSoluteAmountAlert = false; // tracks if it is the first alert after solute amount slider is focused
      this.initialVolumeAlert = false; // tracks if it is the first alert after volume slider is focused
      this.concentrationDescriber = new ConcentrationDescriber( solution, valuesVisibleProperty );

      // @public
      this.volumeDescriber = new VolumeDescriber(
        solution.volumeProperty,
        solution.soluteProperty,
        this.concentrationDescriber,
        valuesVisibleProperty
      );
      this.soluteAmountDescriber = new SoluteAmountDescriber(
        solution.soluteAmountProperty,
        solution.soluteProperty,
        this.concentrationDescriber,
        valuesVisibleProperty
      );
      this.soluteDescriber = new SoluteDescriber(
        solution.soluteProperty,
        valuesVisibleProperty
      );
    }

    /**
     * Sets the initial alert values to true when a slider is focused (a special alert is read out right after a slider
     * is focused).
     * @public
     */
    setInitialAlert() {
      this.initialSoluteAmountAlert = true;
      this.volumeDescriber.initialVolumeAlert = true; // TODO: initialVolumeAlert should be private to VolumeDescriber
    }

    /**
     *  @public
     * @returns {string} - the alert string when the "show values" checkbox is either newly checked or newly unchecked.
     */
    getValuesVisibleChangedAlertString() {
      return this.valuesVisibleProperty.value ? showValuesCheckedAlertString : showValuesUncheckedAlertString;
    }

    /**
     * Creates the third paragraph of the screen summary description in the PDOM.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {
      let saturatedConcentration = '';
      let concentrationPattern = '';

      // If there is no solute in the beaker, a special state description is returned.
      if ( this.solution.soluteAmountProperty.value === 0 ) {
        return StringUtils.fillIn( stateOfSimNoSolutePatternString, {
          volume: this.volumeDescriber.getCurrentVolume(),
          solute: this.soluteDescriber.getCurrentSolute()
        } );
      }

      // determines if solution is currently saturated
      const isCurrentlySaturated = this.solution.concentrationProperty.value >= this.soluteDescriber.getCurrentSaturatedConcentration();
      if ( isCurrentlySaturated ) {
        saturatedConcentration = saturatedString;
      }

      // Changes values to fill in if the "Show Values" checkbox is not checked.
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
     * Describes the properties of the solution in the beaker in the PDOM.
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
     * Checks to see if any descriptive regions have changed for any quantity, and updates to reflect new regions.
     * @private
     * @returns {boolean} - whether or not there was a region to update
     */
    updateRegions() {
      const isNewConcentrationRegion = this.concentrationDescriber.concentrationRegionChanged;
      const isNewSoluteAmountRegion = this.soluteAmountDescriber.updateSoluteAmountRegion();
      const isNewVolumeRegion = this.volumeDescriber.volumeRegionChanged;

      // checks to see if any region has changed
      return isNewConcentrationRegion || isNewSoluteAmountRegion || isNewVolumeRegion;
    }

    /**
     * Creates the string to be used as the solute amount slider's aria-valueText on focus.
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
     * Creates the string to be used as the volume slider's aria-valueText on focus.
     * TODO: rename to be about "on focus"?
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

  return molarity.register( 'MolarityDescriber', MolarityDescriber );
} );