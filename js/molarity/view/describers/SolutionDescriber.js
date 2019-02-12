// Copyright 2019, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const currentSolutePatternString = MolarityA11yStrings.currentSolutePattern.value;
  const currentSoluteValuesVisiblePatternString = MolarityA11yStrings.currentSoluteValuesVisiblePattern.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const soluteAmountPatternString = MolarityA11yStrings.soluteAmountPattern.value;
  const solutionVolumePatternString = MolarityA11yStrings.solutionVolumePattern.value;
  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;
  const solutionConcentrationPatternString = MolarityA11yStrings.solutionConcentrationPattern.value;

  const fullString = MolarityA11yStrings.fullString.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFullString.value;
  const overHalfString = MolarityA11yStrings.overHalfString.value;
  const halfFullString = MolarityA11yStrings.halfFullString.value;
  const underHalfString = MolarityA11yStrings.underHalfString.value;
  const lowString = MolarityA11yStrings.lowString.value;
  const leastAmountString = MolarityA11yStrings.leastAmountString.value;

  const notConcentratedString = MolarityA11yStrings.notConcentratedString.value;
  const barelyConcentratedString = MolarityA11yStrings.barelyConcentratedString.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentratedString.value;
  const concentratedString = MolarityA11yStrings.concentratedString.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentratedString.value;

  const noneString = MolarityA11yStrings.noneString.value;
  const minimumString = MolarityA11yStrings.minimumString.value;
  const belowHalfString = MolarityA11yStrings.belowHalfString.value;
  const halfSoluteString = MolarityA11yStrings.halfSoluteString.value;
  const aboveHalfString = MolarityA11yStrings.aboveHalfString.value;
  const nearlyMaximumString = MolarityA11yStrings.nearlyMaximumString.value;
  const maximumString = MolarityA11yStrings.maximumString.value;


  const VOLUME_STRINGS = [
    leastAmountString,
    lowString,
    underHalfString,
    halfFullString,
    overHalfString,
    nearlyFullString,
    fullString
  ];
  const volumeToIndex = new LinearFunction( 0.2, 1, 0.5, 6.5, true );

  const CONCENTRATION_STRINGS = [
    notConcentratedString,
    barelyConcentratedString,
    slightlyConcentratedString,
    concentratedString,
    veryConcentratedString
  ];
  const concentrationToIndex = new LinearFunction( 0, 5, 0, 4, true );

  const SOLUTE_AMOUNT_STRINGS = [
    noneString,
    minimumString,
    belowHalfString,
    halfSoluteString,
    aboveHalfString,
    nearlyMaximumString,
    maximumString
  ];
  const soluteAmountToIndex = new LinearFunction( 0, 1, 0, 6, true );


  // the singleton instance of this describer, used for the entire instance of the sim.
  let describer = null;

  /**
   * Responsible for alerting when the temperature increases
   * @param {Object} [options]
   * @constructor
   */
  class SolutionDescriber {

    constructor( model, valuesVisibleProperty ) {
      this.solution = model.solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
    }

    /**
     * Current Solute
     */
    getCurrentSoluteDescription() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( currentSoluteValuesVisiblePatternString, {
          solute: this.solution.soluteProperty.value.name
        } );
      }
      else {
        return StringUtils.fillIn( currentSolutePatternString, {
          solute: this.solution.soluteProperty.value.name,
          solutionVolume: VOLUME_STRINGS[ Util.roundSymmetric( volumeToIndex( this.solution.volumeProperty.value ) ) ]
        } );
      }
    }

    /**
     * Solute amount
     */
    getSoluteAmountDescription() {
      let valueToFill = null;
      const soluteAmount = this.solution.soluteAmountProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        valueToFill = StringUtils.fillIn( soluteAmountAndUnitPatternString, { soluteAmount: soluteAmount.toFixed( 3 ) } );
      }
      else {
        valueToFill = SOLUTE_AMOUNT_STRINGS[ Util.roundSymmetric( soluteAmountToIndex( soluteAmount ) ) ];
      }
      return StringUtils.fillIn( soluteAmountPatternString, {
        soluteAmount: valueToFill
      } );
    }

    /**
     * Solution Volume
     */
    getSolutionVolumeDescription() {
      let valueToFill = null;
      const volume = this.solution.volumeProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        valueToFill = `${volume} Liters`;
      }
      else {
        valueToFill = VOLUME_STRINGS[ Util.roundSymmetric( volumeToIndex( volume ) ) - 1 ];
      }
      return StringUtils.fillIn( solutionVolumePatternString, {
        solutionVolume: valueToFill
      } );
    }

    /**
     * Solution Concentration
     */
    getSolutionConcentrationDescription() {
      const concentration = this.solution.concentrationProperty.value;
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
          solutionConcentration: `${concentration} M`
        } );
      }
      else {
        return StringUtils.fillIn( solutionConcentrationPatternString, {
          solutionConcentration: CONCENTRATION_STRINGS[ Util.roundSymmetric( concentrationToIndex( concentration ) ) ]
        } );

      }
    }


    /**
     * Uses the singleton pattern to keep one instance of this describer for the entire lifetime of the sim.
     * @returns {SolutionDescriber}
     */
    static getDescriber() {
      assert && assert( describer, 'describer has not yet been initialized' );
      return describer;
    }


    /**
     * Initialize the describer singleton
     * @param {MolarityModel} model
     * @param {BooleanProperty} valuesVisibleProperty
     * @returns {SolutionDescriber}
     */
    static initialize( model, valuesVisibleProperty ) {
      describer = new SolutionDescriber( model, valuesVisibleProperty );
      return describer;
    }
  }

  return molarity.register( 'SolutionDescriber', SolutionDescriber );
} );