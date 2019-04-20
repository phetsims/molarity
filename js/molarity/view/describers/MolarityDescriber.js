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
  const concentrationPatternString = MolarityA11yStrings.concentrationPattern.value;
  const concentrationValuesVisiblePatternString = MolarityA11yStrings.concentrationValuesVisiblePattern.value;
  const stateOfSimNoSolutePatternString = MolarityA11yStrings.stateOfSimNoSolutePattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;
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
      this.concentrationDescriber = new ConcentrationDescriber(
        solution,
        valuesVisibleProperty
      );

      // @public
      this.soluteDescriber = new SoluteDescriber(
        solution.soluteProperty,
        valuesVisibleProperty
      );
      this.volumeDescriber = new VolumeDescriber(
        solution.volumeProperty,
        this.concentrationDescriber,
        valuesVisibleProperty
      );
      this.soluteAmountDescriber = new SoluteAmountDescriber(
        solution.soluteAmountProperty,
        this.soluteDescriber,
        this.concentrationDescriber,
        valuesVisibleProperty
      );
    }

    /**
     * Sets the initial alert values to true when a slider is focused (a special alert is read out right after a slider
     * is focused).
     * @public
     */
    setInitialAlert() {
      this.soluteAmountDescriber.initialSoluteAmountAlert = true;
      this.volumeDescriber.initialVolumeAlert = true; // TODO: initialVolumeAlert should be private to VolumeDescriber
    }

    /**
     * Creates the alert strings that are read out when the "show values" checkbox is newly checked or unchecked
     *  @public
     * @returns {string}
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
      const concentrationString = this.valuesVisibleProperty.value ? concentrationValuesVisiblePatternString : concentrationPatternString;
      const concentrationPattern = StringUtils.fillIn( concentrationString, {
        concentration: this.concentrationDescriber.getCurrentConcentration(),
        saturatedConcentration: this.concentrationDescriber.isSaturated ? saturatedString : notSaturatedString
      } );

      // If there is no solute in the beaker, a special state description is returned.
      if ( this.solution.soluteAmountProperty.value === 0 ) {
        return StringUtils.fillIn( stateOfSimNoSolutePatternString, {
          volume: this.volumeDescriber.getCurrentVolume(),
          solute: this.soluteDescriber.getCurrentSolute()
        } );
      }

      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: this.volumeDescriber.getCurrentVolume(),
        solute: this.soluteDescriber.getCurrentSolute(),
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount(),
        concentrationClause: concentrationPattern,
        saturatedConcentration: this.concentrationDescriber.isSaturated ? saturatedString : ''
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
  }

  return molarity.register( 'MolarityDescriber', MolarityDescriber );
} );