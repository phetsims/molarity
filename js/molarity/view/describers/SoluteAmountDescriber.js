// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about SoluteAmountProperty
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
  const soluteAmountStateInfoPatternString = MolarityA11yStrings.soluteAmountStateInfoPattern.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;

  const zeroString = MolarityA11yStrings.zeroString.value;
  const aLittleString = MolarityA11yStrings.aLittleString.value;
  const aLowString = MolarityA11yStrings.aLowString.value;
  const someString = MolarityA11yStrings.someString.value;
  const aBunchString = MolarityA11yStrings.aBunchString.value;
  const aLotString = MolarityA11yStrings.aLotString.value;
  const fullAmountString = MolarityA11yStrings.fullAmountString.value;


  // constants
  const SOLUTE_AMOUNT_STRINGS = [
    zeroString,
    aLittleString,
    aLowString,
    someString,
    aBunchString,
    aLotString,
    fullAmountString
  ];

  class SoluteAmountDescriber {

    /**
     * @param {SoluteAmoutProperty} soluteAmountProperty- from MolarityModel
     * @param {SoluteProperty} soluteProperty- from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( soluteAmountProperty, soluteProperty, valuesVisibleProperty ) {

      // @private
      this.soluteAmountProperty = soluteAmountProperty;
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.soluteAmountRegion = 0; // tracks the last descriptive region for solute amount

    }

    /** calculates the which item to use from the SOLUTE_AMOUNT_STRINGS array
     * @returns {number} index (integer) to pull from SOLUTE_AMOUNT_STRINGS array
     */
    soluteAmountToIndex() {
      const soluteAmount = this.soluteAmountProperty.value;
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
     * gets the current value of solute amount either quantitatively or quantitatively to plug into descriptions
     * @private
     * @returns {number | string } quantitative or qualitative description of current solute amount
     */
    getCurrentSoluteAmount() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( soluteAmountAndUnitPatternString, {
          soluteAmount: Util.toFixed( this.soluteAmountProperty.value, 3 )
        } );
      }
      else {
        const index = Util.roundSymmetric( this.soluteAmountToIndex() );
        return SOLUTE_AMOUNT_STRINGS[ index ];
      }
    }

    /**
     * Checks to see if the solute amount descriptive region has changed, and updates to reflect new regions
     * @public
     * @returns {boolean} - whether or not there was a region to update
     */
    updateSoluteAmountRegion() {
      const soluteAmountIndex = this.soluteAmountToIndex();
      const isNewSoluteAmountRegion = this.soluteAmountRegion !== soluteAmountIndex;

      // update the region to the new one if a region has changed
      if ( isNewSoluteAmountRegion ) {
        this.soluteAmountRegion = soluteAmountIndex;
      }

      return isNewSoluteAmountRegion;
    }


    /**
     * fills in the state info if region has changed and the solution is not saturated
     * @private
     * @returns {string}
     */
    getSoluteAmountStateInfoNotSaturated() {
      return StringUtils.fillIn( soluteAmountStateInfoPatternString, {
        solute: this.soluteProperty.value.name,
        soluteAmount: this.getCurrentSoluteAmount()
      } );
    }
  }

  return molarity.register( 'SoluteAmountDescriber', SoluteAmountDescriber );
} );