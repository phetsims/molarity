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

  const saturatedString = MolarityA11yStrings.saturatedString.value;
  const notSaturatedString = MolarityA11yStrings.notSaturatedString.value;

  const moreString = MolarityA11yStrings.moreString.value;
  const lessString = MolarityA11yStrings.lessString.value;

  const solidsString = MolarityA11yStrings.solidsString.value;
  const solutionString = MolarityA11yStrings.solutionString.value;
  const soluteString = MolarityA11yStrings.soluteString.value;

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
      this.concentrationIndex = 0;
      this.volumeIndex = 0;
      this.soluteAmountIndex = 0;
      this.saturated = false;
    }

    /**
     * @private
     * @param {number} soluteAmount
     * @returns {number} index (integer) to pull from SOLUTE_AMOUNT_STRINGS array
     */
    soluteAmountToIndex( soluteAmount ) {
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
    }

    /**
     * @private
     * @param {number} volume
     * @returns {number} index to pull from VOLUME_STRINGS array
     */
    volumeToIndex( volume ) {
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
    }

    /**
     * @private
     * @param {number} concentration
     * @returns {number} index to pull from CONCENTRATION_STRINGS array
     */
    concentrationToIndex( concentration ) {
      const maxConcentration = this.solution.soluteProperty.value.saturatedConcentration;
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
    }

    /**
     * @private
     * @returns {object} object with values from model
     */
    getQuantities() {
      // values if the 'show values' checkbox is checked (quantitative)
      if ( this.valuesVisibleProperty.value ) {
        return {
          concentration: Util.toFixed( this.solution.concentrationProperty.value, 3 ),
          soluteAmount: Util.toFixed( this.solution.soluteAmountProperty.value, 3 ),
          volume: Util.toFixed( this.solution.volumeProperty.value, 3 ),
          solute: this.solution.soluteProperty.value.name,
          maxConcentration: this.solution.soluteProperty.value.saturatedConcentration
        };
      }
      // values if the 'show values checkbox isn't checked (qualitative)
      else {
        return {
          concentration: CONCENTRATION_STRINGS[ this.concentrationToIndex( this.solution.concentrationProperty.value ) ],
          soluteAmount: SOLUTE_AMOUNT_STRINGS[ Util.roundSymmetric( this.soluteAmountToIndex( this.solution.soluteAmountProperty.value ) ) ],
          volume: VOLUME_STRINGS[ this.volumeToIndex( this.solution.volumeProperty.value ) ],
          solute: this.solution.soluteProperty.value.name,
          maxConcentration: this.solution.soluteProperty.value.saturatedConcentration
        };
      }
    }

    /**
     * Describes all relevant properties in the screen summary.
     * @public
     * @returns {string}
     */
    getStateOfSimDescription() {

      // sets values to fill in initially -- "Show Values" checkbox is checked
      let saturatedConcentration = '';
      let concentrationPattern = '';

      // checks if the solution is saturated yet, and sets saturatedConcentration to saturatedString if so.
      if ( this.solution.concentrationProperty.value >= this.getQuantities().maxConcentration ) {
        saturatedConcentration = saturatedString;
      }

      // changes values to fill in if the "Show Values" checkbox is not checked
      if ( !this.valuesVisibleProperty.value ) {
        concentrationPattern = StringUtils.fillIn( solutionConcentrationPatternString, {
          concentration: this.getQuantities().concentration,
          saturatedConcentration: saturatedConcentration === '' ? notSaturatedString : saturatedConcentration
        } );
      }
      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: this.getQuantities().volume,
        solute: this.getQuantities().solute,
        soluteAmount: this.getQuantities().soluteAmount,
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
        solute: this.getQuantities().solute,
        concentration: this.getQuantities().concentration,
        maxConcentration: this.getQuantities().maxConcentration,
        chemicalFormula: this.solution.soluteProperty.value.formula
      } );
    }

    /**
     * Describes the volume or the solute amount in the beaker in the play area.
     * @param {boolean} increasing - indicates whether the slider has moved up or down. true if up, false if down
     * @param {string} slider - indicates which slider has moved
     * @public
     * @returns {string}
     */
    getSliderAlertString( increasing, slider ) {
      const moreLess = increasing ? moreString : lessString;
      const lessMore = ( increasing && slider === 'volume' ) || ( !increasing && slider !== 'volume' ) ? lessString : moreString;
      let stateInfo = '';
      const sliderType = ( slider === 'volume' ) ? solutionString : soluteString;
      const volumeStateInfo = ( slider === 'volume' ) ? StringUtils.fillIn( volumeStateInfoPatternString, { volume: this.getQuantities().volume } ) : '';
      const soluteAmountStateInfo = ( slider === 'volume' ) ? '' : StringUtils.fillIn( soluteAmountStateInfoPatternString, { solute: this.getQuantities().solute, soluteAmount: this.getQuantities().soluteAmount } );

      // checks if the solution is saturated and description region has changed for solute amount or volume
      if ( this.solution.concentrationProperty.value >= this.getQuantities().maxConcentration && !this.saturated ) {
        this.saturated = true;
        return saturationReachedAlertString;
      }
      else if ( this.solution.concentrationProperty.value < this.getQuantities().maxConcentration && this.saturated ) {
        this.saturated = false;
        return StringUtils.fillIn( saturationLostAlertPatternString, { concentration: this.getQuantities().concentration } );
      }
      // checks if solution is saturated and alert has already been read out
      else if ( this.solution.concentrationProperty.value >= this.getQuantities().maxConcentration ) {
        const withSolids = StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.concentrationToIndex( this.solution.precipitateAmountProperty.value )
        } );
        if ( this.concentrationIndex !== this.concentrationToIndex( this.solution.concentrationProperty.value ) ) {
          stateInfo = StringUtils.fillIn( stillSaturatedAlertPatternString, {
            withSolids: withSolids
          } );
          this.concentrationIndex = this.concentrationToIndex( this.solution.concentrationProperty.value );
        }
      }
      // checks if description region has changes for solute amount or volume
      else if ( this.concentrationIndex !== this.concentrationToIndex( this.solution.concentrationProperty.value ) || this.soluteAmountIndex !== this.soluteAmountToIndex( this.solution.soluteAmountProperty.value || this.volumeIndex !== this.volumeToIndex( this.solution.volumeProperty.value ) ) ) {
        stateInfo = StringUtils.fillIn( stateInfoPatternString, {
          concentration: this.getQuantities().concentration,
          volumeClause: volumeStateInfo,
          soluteAmountClause: soluteAmountStateInfo
        } );
        this.concentrationIndex = this.concentrationToIndex( this.solution.concentrationProperty.value );
        this.soluteAmountIndex = this.soluteAmountToIndex( this.solution.soluteAmountProperty.value );
        this.volumeIndex = this.volumeToIndex( this.solution.volumeProperty.value );
      }

      return StringUtils.fillIn( sliderMovedAlertPatternString, {
        moreLess: moreLess,
        lessMore: lessMore,
        stateInfo: stateInfo,
        concentratedOrSolids: concentratedString,
        sliderType: sliderType,
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
        maxConcentration: this.getQuantities().maxConcentration
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
} )
;