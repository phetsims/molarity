// Copyright 2019, University of Colorado Boulder

/**
 * MolarityDescriber is responsible for generating the strings used for PDOM content in Molarity. It also initializes all other describers.
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
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const notSaturatedString = MolarityA11yStrings.notSaturated.value;
  const qualitativeConcentrationPatternString = MolarityA11yStrings.qualitativeConcentrationPattern.value;
  const quantitativeConcentrationPatternString = MolarityA11yStrings.quantitativeConcentrationPattern.value;
  const saturatedString = MolarityA11yStrings.saturated.value;
  const stateOfSimNoSolutePatternString = MolarityA11yStrings.stateOfSimNoSolutePattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;

  class MolarityDescriber {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {BooleanDerivedProperty} useQuantitativeDescriptions
     */
    constructor( solution, useQuantitativeDescriptions ) {

      // @private
      this.solution = solution;
      this.useQuantitativeDescriptions = useQuantitativeDescriptions;
      this.concentrationDescriber = new ConcentrationDescriber(
        solution,
        useQuantitativeDescriptions
      );

      // @public
      this.soluteDescriber = new SoluteDescriber(
        solution.soluteProperty
      );
      this.volumeDescriber = new VolumeDescriber(
        solution,
        this.concentrationDescriber,
        useQuantitativeDescriptions
      );
      this.soluteAmountDescriber = new SoluteAmountDescriber(
        solution,
        this.soluteDescriber,
        this.concentrationDescriber,
        useQuantitativeDescriptions
      );
    }

    /**
     * Sets the initial alert values to true when a slider is focused (a special alert is read out right after a slider
     * is focused).
     * @public
     */
    setInitialAlert() {
      this.soluteAmountDescriber.setInitialSoluteAmountAlert();
      this.volumeDescriber.setInitialVolumeAlert();
    }

    /**
     * Creates the third paragraph of the screen summary description in the PDOM.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {
      const concentrationString = this.useQuantitativeDescriptions.value ?
                                  quantitativeConcentrationPatternString :
                                  qualitativeConcentrationPatternString;
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
        maxConcentration: StringUtils.fillIn( concentrationAndUnitString, {
          concentration: this.soluteDescriber.getCurrentSaturatedConcentration()
        } ),
        chemicalFormula: this.soluteDescriber.getCurrentChemicalFormula()
      } );
    }
  }

  return molarity.register( 'MolarityDescriber', MolarityDescriber );
} );