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

  // strings
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const soluteAmountChangedPatternString = MolarityA11yStrings.soluteAmountChangedPattern.value;
  const soluteAmountSliderValueTextPatternString = MolarityA11yStrings.soluteAmountSliderValueTextPattern.value;
  const quantitativeInitialValueTextPatternString = MolarityA11yStrings.quantitativeInitialValueTextPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
  const qualitativeSoluteAmountValueTextPatternString = MolarityA11yStrings.qualitativeSoluteAmountValueTextPattern.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeSoluteAmountStatePatternString = MolarityA11yStrings.qualitativeSoluteAmountStatePattern.value;
  const qualitativeStateInfoPatternString = MolarityA11yStrings.qualitativeStateInfoPattern.value;

  // solute Amount regions strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aLittleString = MolarityA11yStrings.aLittle.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;
  const aLowAmountOfString = MolarityA11yStrings.aLowAmountOf.value;
  const theMaxAmountOfString = MolarityA11yStrings.theMaxAmountOf.value;

  // solids regions strings
  const someString = MolarityA11yStrings.some.value;
  const zeroString = MolarityA11yStrings.zero.value;

  // change strings
  const lessString = MolarityA11yStrings.less.value;
  const moreString = MolarityA11yStrings.more.value;

  // constants
  const SOLUTE_AMOUNT_STRINGS = [
    zeroString,
    aLittleString,
    aLowAmountOfString,
    someString,
    aBunchOfString,
    aLotOfString,
    theMaxAmountOfString
  ];

  class SoluteAmountDescriber {

    /**
     * @param {Solution} solution - from model.
     * @param {SoluteDescriber} soluteDescriber
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {BooleanProperty} useQuantitativeDescriptions
     */
    constructor( solution, soluteDescriber, concentrationDescriber, useQuantitativeDescriptions ) {

      // @private
      this.solution = solution;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteAmountProperty = solution.soluteAmountProperty;
      this.soluteDescriber = soluteDescriber;
      this.useQuantitativeDescriptions = useQuantitativeDescriptions;
      this.currentRegion = null; // number -- the index of the descriptive region from SOLUTE_AMOUNT_STRINGS array.
      this.soluteAmountRegionChanged = null; // boolean -- tracks whether the descriptive volume region has just changed.
      this.soluteAmountChangeValue = null; // string -- describes whether volume has just increased or decreased
      this.isInitialSoluteAmountAlert = true; // tracks whether the solute amount slider has just been focused

      this.soluteAmountProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === soluteAmountToIndex( oldValue ) );
        const oldRegion = this.currentRegion;
        this.currentRegion = soluteAmountToIndex( newValue );
        this.soluteAmountRegionChanged = this.currentRegion !== oldRegion;
        this.soluteAmountChangeValue = newValue > oldValue ? moreString : lessString;
      } );
    }

    /**
     * Sets the initial solute amount alert value to true when a slider is focused to trigger a special alert right after focus.
     * @public
     */
    setInitialSoluteAmountAlert() {
      this.isInitialSoluteAmountAlert = true;
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
     * @public
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getCurrentSoluteAmount() {
      if ( this.useQuantitativeDescriptions.value ) {
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
        solute: this.soluteDescriber.getCurrentSolute()
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
     * Creates the string to be used as the solute amount slider's aria-valueText on focus.
     * @public
     * @returns {string}
     */
    getOnFocusSoluteAmountAriaValueText() {
      return StringUtils.fillIn( soluteAmountSliderValueTextPatternString, {
        soluteAmount: this.getCurrentSoluteAmount(),
        solute: this.soluteDescriber.getCurrentSolute()
      } );
    }

    /**
     * Main method for generating aria-valueText when the soluteAmountProperty changes.
     * @public
     * @returns {string}
     */
    getSoluteAmountChangedValueText() {
      if ( this.concentrationDescriber.isNewSaturationState() ) {
        return this.concentrationDescriber.getSaturationChangedString();
      }
      else {
        return this.useQuantitativeDescriptions.value ?
               this.getQuantitativeAriaValueText() :
               this.getQualitativeAriaValueText();
      }
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is checked
     * @private
     * @returns {string}
     */
    getQuantitativeAriaValueText() {
      let string = quantitativeValueTextPatternString;

      // sets string to fill in right after slider is focused
      if ( this.isInitialSoluteAmountAlert ) {
        string = quantitativeInitialValueTextPatternString;
        this.isInitialSoluteAmountAlert = false;
      }

      return StringUtils.fillIn( string, {
        concentrationChange: this.concentrationDescriber.getConcentrationChangeString(), // TODO: handle capital more/less on initial text
        quantity: this.getCurrentSoluteAmount(),
        concentration: this.concentrationDescriber.getCurrentConcentration()
      } );
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is not checked for saturated and unsaturated states.
     * @private
     * @returns {string}
     */
    getQualitativeAriaValueText() {
      if ( this.solution.isSaturated() ) {
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