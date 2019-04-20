// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about SoluteAmountProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const aBunchString = MolarityA11yStrings.aBunchString.value;
  const aLittleString = MolarityA11yStrings.aLittleString.value;
  const aLotString = MolarityA11yStrings.aLotString.value;
  const aLowString = MolarityA11yStrings.aLowString.value;
  const maxAmountString = MolarityA11yStrings.maxAmountString.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const someString = MolarityA11yStrings.someString.value;
  const zeroString = MolarityA11yStrings.zeroString.value;
  const quantitativeInitialValueTextPatternString = MolarityA11yStrings.quantitativeInitialValueTextPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
  const qualitativeSoluteAmountValueTextPatternString = MolarityA11yStrings.qualitativeSoluteAmountValueTextPattern.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeSoluteAmountStatePatternString = MolarityA11yStrings.qualitativeSoluteAmountStatePattern.value;
  const qualitativeStateInfoPatternString = MolarityA11yStrings.qualitativeStateInfoPattern.value;
  const soluteAmountChangedPatternString = MolarityA11yStrings.soluteAmountChangedPattern.value;

  const lessString = MolarityA11yStrings.lessString.value;
  const moreString = MolarityA11yStrings.moreString.value;

  // constants
  const SOLUTE_AMOUNT_STRINGS = [
    zeroString,
    aLittleString,
    aLowString,
    someString,
    aBunchString,
    aLotString,
    maxAmountString
  ];

  class SoluteAmountDescriber {

    /**
     * @param {NumberProperty} soluteAmountProperty - from Solution model element.
     * @param {Property.<Solute>} soluteProperty - from Solution model element.
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {BooleanProperty} valuesVisibleProperty - whether values are visible in the view.
     */
    constructor( soluteAmountProperty, soluteProperty, concentrationDescriber, valuesVisibleProperty ) {
      // @private
      this.concentrationDescriber = concentrationDescriber;
      this.soluteAmountProperty = soluteAmountProperty;
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;

      // @public -- TODO: doc
      this.initialSoluteAmountAlert = true;
      this.currentRegion = null; // filled in below, TODO: doc
      this.soluteAmountRegionChanged = null; // filled in below, TODO: doc
      this.soluteAmountChangeValue = null;

      soluteAmountProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === soluteAmountToIndex( oldValue ) );
        const oldRegion = this.currentRegion;
        this.currentRegion = soluteAmountToIndex( newValue );
        this.soluteAmountRegionChanged = this.currentRegion !== oldRegion;
        this.soluteAmountChangeValue = newValue > oldValue ? moreString : lessString;
      } );
    }

    /**
     * Returns a string describing the change in soluteAmount (e.g. "more solution")
     * @private
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getSoluteAmountChangeString() {
      return StringUtils.fillIn( soluteAmountChangedPatternString, {
        moreLess: this.soluteAmountChangeValue
      } );
    }

    /**
     * Gets the current value of soluteAmount either quantitatively or quantitatively to plug into descriptions.
     * Examples: "3.400 Moles" for quantitative or "A lot of" for qualitative
     * @private
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getCurrentSoluteAmount() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( soluteAmountAndUnitPatternString, {
          soluteAmount: Util.toFixed( this.soluteAmountProperty.value, MConstants.SOLUTE_AMOUNT_DECIMAL_PLACES )
        } );
      }
      else {
        return SOLUTE_AMOUNT_STRINGS[ soluteAmountToIndex( this.soluteAmountProperty.value ) ];
      }
    }

    /**
     * Creates a substring describing the soluteAmount state
     * @private
     * @returns {string} - something like "a lot of drink mix"
     */
    getSoluteAmountState() {
      return StringUtils.fillIn( qualitativeSoluteAmountStatePatternString, {
        soluteAmount: this.getCurrentSoluteAmount(),
        solute: this.soluteProperty.value.name
      } );
    }

    /**
     * Creates a substring of state info of the sim if the soluteAmount or concentration regions have changed.
     * @private
     * @returns {string} - something like "a lot of drink mix. solution very concentrated."
     */
    getSoluteAmountStateInfo() {
      if ( this.soluteAmountRegionChanged || this.concentrationDescriber.concentrationRegionChanged ) {
        return StringUtils.fillIn( qualitativeStateInfoPatternString, {
          quantityState: this.getSoluteAmountState(),
          concentrationState: this.concentrationDescriber.getConcentrationState()
        } );
      }
      else {
        return '';
      }
    }


    /**
     * @public
     * @returns {string} - main value text for when soluteAmount changes
     */
    getSoluteAmountChangedValueText() {
      if ( this.concentrationDescriber.getSaturationChangedString() ) {
        return this.concentrationDescriber.getSaturationChangedString();
      }
      else {
        return this.valuesVisibleProperty.value ? this.getQuantitativeAriaValueText() : this.getQualitativeAriaValueText();
      }
    }

    /**
     * TODO:
     * @returns {*|string}
     */
    getQuantitativeAriaValueText() {
      let string = quantitativeValueTextPatternString;

      if ( this.initialSoluteAmountAlert ) {
        string = quantitativeInitialValueTextPatternString;
        this.initialSoluteAmountAlert = false;
      }

      return StringUtils.fillIn( string, {
        concentrationChange: this.concentrationDescriber.getConcentrationChangeString(), // TODO: handle capital more/less on initial text
        quantity: this.getCurrentSoluteAmount(),
        concentration: this.concentrationDescriber.getCurrentConcentration()
      } );
    }

    /**
     * TODO: doc
     * @returns {*|string}
     */
    getQualitativeAriaValueText() {
      if ( this.concentrationDescriber.isSaturated ) {
        return StringUtils.fillIn( qualitativeSaturatedValueTextPatternString, {
          propertyAmountChange: this.getSoluteAmountChangeString(),
          solidsChange: this.concentrationDescriber.getSolidsChangeString(),
          stillSaturatedClause: this.concentrationDescriber.getStillSaturatedClause()
        } );
      }
      else {
        return StringUtils.fillIn( qualitativeSoluteAmountValueTextPatternString, {
          soluteAmountChange: this.getSoluteAmountChangeString(),
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString(),
          stateInfo: this.getSoluteAmountStateInfo()
        } );
      }
    }
  }

  /**
   * Calculates which item to use from the SOLUTE_AMOUNT_STRINGS array.
   * @param {number} soluteAmount
   * @returns {number} - index (integer) to pull from SOLUTE_AMOUNT_STRINGS array.
   */
  const soluteAmountToIndex = ( soluteAmount ) => {
    if ( soluteAmount <= 0.050 ) {
      return 0;
    }
    else if ( soluteAmount <= .200 ) {
      return 1;
    }
    else if ( soluteAmount <= .450 ) {
      return 2;
    }
    else if ( soluteAmount <= .650 ) {
      return 3;
    }
    else if ( soluteAmount <= .850 ) {
      return 4;
    }
    else if ( soluteAmount <= .950 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'SoluteAmountDescriber', SoluteAmountDescriber );
} );