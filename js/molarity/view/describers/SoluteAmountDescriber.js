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
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // strings
  const noSoluteAlertString = MolarityA11yStrings.noSoluteAlert.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const soluteAmountChangedPatternString = MolarityA11yStrings.soluteAmountChangedPattern.value;
  const soluteAmountSliderValueTextPatternString = MolarityA11yStrings.soluteAmountSliderValueTextPattern.value;
  const qualitativeSoluteAmountStatePatternString = MolarityA11yStrings.qualitativeSoluteAmountStatePattern.value;

  // solute Amount regions strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aBunchOfLowercaseString = MolarityA11yStrings.aBunchOfLowercase.value;
  const aLittleString = MolarityA11yStrings.aLittle.value;
  const aLittleLowercaseString = MolarityA11yStrings.aLittleLowercase.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;
  const aLotOfLowercaseString = MolarityA11yStrings.aLotOfLowercase.value;
  const aLowAmountOfString = MolarityA11yStrings.aLowAmountOf.value;
  const aLowAmountOfLowercaseString = MolarityA11yStrings.aLowAmountOfLowercase.value;
  const theMaxAmountOfString = MolarityA11yStrings.theMaxAmountOf.value;
  const theMaxAmountOfLowercaseString = MolarityA11yStrings.theMaxAmountOfLowercase.value;

  // solids regions strings
  const someString = MolarityA11yStrings.some.value;
  const someLowercaseString = MolarityA11yStrings.someLowercase.value;
  const zeroString = MolarityA11yStrings.zero.value;
  const zeroLowercaseString = MolarityA11yStrings.zeroLowercase.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;

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
  const SOLUTE_AMOUNT_STRINGS_LOWERCASE = [
    zeroLowercaseString,
    aLittleLowercaseString,
    aLowAmountOfLowercaseString,
    someLowercaseString,
    aBunchOfLowercaseString,
    aLotOfLowercaseString,
    theMaxAmountOfLowercaseString
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

      // @private
      // {number} - the index of the descriptive region from SOLUTE_AMOUNT_STRINGS array.
      this.currentRegion = soluteAmountToIndex( this.solution.soluteAmountProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive solute amount region has just changed.
      this.soluteAmountRegionChanged = false;

      // @private
      // {boolean} - tracks whether the solute amount slider has just been focused.
      this.isInitialSoluteAmountAlert = true;

      // @private
      // {boolean|null} - tracks whether solute amount has just increased. null when simulation starts or resets.
      this.soluteAmountIncreased = null;

      this.soluteAmountProperty.link( ( newValue, oldValue ) => {
        assert && assert( newValue !== oldValue, 'unexpected: called with no change in solute amount' );
        assert && oldValue && assert( this.currentRegion === soluteAmountToIndex( oldValue ),
          'current solute amount region not tracking the previous region as expected' );
        const oldRegion = this.currentRegion;
        this.currentRegion = soluteAmountToIndex( newValue );
        this.soluteAmountRegionChanged = this.currentRegion !== oldRegion;
        this.soluteAmountIncreased = newValue > oldValue;
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
        moreLess: this.soluteAmountIncreased ? moreCapitalizedString : lessCapitalizedString
      } );
    }

    /**
     * Gets the current value of soluteAmount either quantitatively or quantitatively to plug into descriptions.
     * Examples: "3.400 Moles" for quantitative or "A lot of" for qualitative
     * @param lowercase {boolean}
     * @public
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getCurrentSoluteAmount( lowercase = false ) {
      if ( this.useQuantitativeDescriptions.value ) {
        return StringUtils.fillIn( soluteAmountAndUnitPatternString, {
          soluteAmount: Util.toFixed( this.soluteAmountProperty.value, MConstants.SOLUTE_AMOUNT_DECIMAL_PLACES )
        } );
      }
      else {
        return lowercase ? SOLUTE_AMOUNT_STRINGS_LOWERCASE[ soluteAmountToIndex( this.soluteAmountProperty.value ) ] :
               SOLUTE_AMOUNT_STRINGS[ soluteAmountToIndex( this.soluteAmountProperty.value ) ];
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
     * Creates the string to be used as the solute amount slider's aria-valueText on focus.
     * @public
     * @returns {string}
     */
    getOnFocusSoluteAmountValueText() {
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
               this.getQuantitativeSoluteAmountValueText() :
               this.getQualitativeSoluteAmountValueText();
      }
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is checked
     * @private
     * @returns {string}
     */
    getQuantitativeSoluteAmountValueText() {
      const valueText = this.concentrationDescriber.getQuantitativeValueText( this.isInitialSoluteAmountAlert,
        this.getCurrentSoluteAmount() );
      if ( this.isInitialSoluteAmountAlert ) {
        this.isInitialSoluteAmountAlert = false;
      }
      return valueText;
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is not checked for saturated and unsaturated states.
     * @private
     * @returns {string}
     */
    getQualitativeSoluteAmountValueText() {

      // aria-live alert (a special alert is read out when there is no solute in the beaker)
      if ( this.solution.soluteAmountProperty.value <= 0.001 ) {
        const noSoluteUtterance = new Utterance();
        noSoluteUtterance.alert = noSoluteAlertString;
        utteranceQueue.addToBack( noSoluteUtterance );
      }
      else {
        this.concentrationDescriber.getQualitativeAlert( this.getSoluteAmountChangeString(), this.soluteAmountRegionChanged );
      }

      // aria-valueText
      return this.getSoluteAmountState();
    }
  }

  /**
   * Calculates which item to use from the SOLUTE_AMOUNT_STRINGS array.
   * @param {number} soluteAmount
   * @returns {number} - index (integer) to pull from SOLUTE_AMOUNT_STRINGS array.
   */
  const soluteAmountToIndex = ( soluteAmount ) => {
    if ( soluteAmount <= 0.001 ) {
      return 0;
    }
    else if ( soluteAmount <= .150 ) {
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