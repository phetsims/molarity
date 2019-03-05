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
  const Util = require( 'DOT/Util' );

  // a11y strings
  const beakerDescriptionString = MolarityA11yStrings.beakerDescription.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const solutionVolumeAccessibleNameString = MolarityA11yStrings.solutionVolumeAccessibleName.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const solutionConcentrationValuesVisiblePatternString = MolarityA11yStrings.solutionConcentrationValuesVisiblePattern.value;
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
  const soluteAmountAccessibleNameString = MolarityA11yStrings.soluteAmountAccessibleName.value;

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

  const saturatedString = MolarityA11yStrings.saturatedString.value;
  const notSaturatedString = MolarityA11yStrings.notSaturatedString.value;

  const raisesString = MolarityA11yStrings.raisesString.value;
  const lowersString = MolarityA11yStrings.lowersString.value;

  const increasesString = MolarityA11yStrings.increasesString.value;
  const decreasesString = MolarityA11yStrings.decreasesString.value;

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
    noneString,
    minimumString,
    belowHalfString,
    halfSoluteString,
    aboveHalfString,
    nearlyMaximumString,
    maximumString
  ];

  // the singleton instance of this describer, used for the entire lifetime of the sim
  let describer = null;

  class SolutionDescriber {

    /**
     * @param {MolarityModel} model
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( model, valuesVisibleProperty ) {

      // @private
      this.model = model;
      this.solution = model.solution;
      this.valuesVisibleProperty = valuesVisibleProperty;
    }

    /**
     * @private
     * @param {number} soluteAmount
     * @returns {number} index (integer) to pull from SOLUTE_AMOUNT_STRINGS array
     */
    soluteAmountToIndex( soluteAmount ) {
      assert && assert( soluteAmount >= 0, 'concentration should always be positive.' );
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
      assert && assert( false, 'Invalid solute amount value' );
    }

    /**
     * @private
     * @param {number} volume
     * @returns {number} index to pull from VOLUME_STRINGS array
     */
    volumeToIndex( volume ) {
      assert && assert( volume >= 0, 'volume should always be positive.' );
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
      assert && assert( false, 'Invalid volume value' );
    }

    /**
     * Describes all relevant properties in the screen summary.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {
      const soluteProperty = this.solution.soluteProperty.value.name;

      // sets values to fill in initially -- "Show Values" checkbox is checked
      let saturatedConcentration = '';
      let volumeProperty = StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
        volume: Util.toFixed( this.solution.volumeProperty.value, 3 )
      } );
      let soluteAmountProperty = StringUtils.fillIn( soluteAmountAndUnitPatternString, {
        soluteAmount: Util.toFixed( this.solution.soluteAmountProperty.value, 3 )
      } );
      let concentrationPattern = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
        concentration: Util.toFixed( this.solution.concentrationProperty.value, 3 )
      } );

      // checks if the solution is saturated yet, and sets saturatedConcentration to saturatedString if so.
      if ( this.solution.concentrationProperty.value >= this.solution.soluteProperty.value.saturatedConcentration ) {
        saturatedConcentration = saturatedString;
      }

      // changes values to fill in if the "Show Values" checkbox is not checked
      if ( !this.valuesVisibleProperty.value ) {
        volumeProperty = VOLUME_STRINGS[ this.volumeToIndex( this.solution.volumeProperty.value ) ];
        soluteAmountProperty = SOLUTE_AMOUNT_STRINGS[ Util.roundSymmetric( this.soluteAmountToIndex( this.solution.soluteAmountProperty.value ) ) ];
        concentrationPattern = StringUtils.fillIn( solutionConcentrationPatternString, {
          concentration: CONCENTRATION_STRINGS[ Util.roundSymmetric( this.solution.concentrationProperty.value ) ],
          saturatedConcentration: saturatedConcentration === '' ? notSaturatedString : saturatedConcentration
        } );
      }
      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: volumeProperty,
        solute: soluteProperty,
        soluteAmount: soluteAmountProperty,
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
        solute: this.solution.soluteProperty.value.name,
        concentration: CONCENTRATION_STRINGS[ Util.roundSymmetric( this.solution.concentrationProperty.value ) ],
        maxConcentration: this.solution.soluteProperty.value.saturatedConcentration
      } );
    }

    /**
     * Describes the volume in the beaker in the play area.
     * @param {boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getVolumeAlertString( increasing ) {
      const raiseLower = increasing ? lowersString : raisesString;
      const increaseDecrease = increasing ? increasesString : decreasesString;
      const concentrationClause = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
        concentration: Util.toFixed( this.solution.concentrationProperty.value, 3 )
      } );
      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        sliderName: solutionVolumeAccessibleNameString,
        increases: increaseDecrease,
        raises: raiseLower,
        concentrationClause: concentrationClause
      } );
    }

    /**
     * Describes the solute amount in the beaker in the play area.
     * param {Boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @public
     * @returns {string}
     */
    getSoluteAmountAlertString( increasing ) {
      const raiseLower = increasing ? raisesString : lowersString;
      const increaseDecrease = increasing ? increasesString : decreasesString;
      const concentrationClause = StringUtils.fillIn( solutionConcentrationValuesVisiblePatternString, {
        concentration: Util.toFixed( this.solution.concentrationProperty.value, 3 )
      } );
      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        sliderName: soluteAmountAccessibleNameString,
        increases: increaseDecrease,
        raises: raiseLower,
        concentrationClause: concentrationClause
      } );
    }

    /**
     * Describes the new solute when a user changes the solute in the combo box
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.solution.soluteProperty.value.name,
        maxConcentration: this.solution.soluteProperty.value.saturatedConcentration
      } );
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