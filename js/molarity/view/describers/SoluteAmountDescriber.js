// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about Solution.soluteAmountProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const beakerSoluteAmountPatternString = MolarityA11yStrings.beakerSoluteAmountPattern.value;
  const soluteAmountAndUnitPatternString = MolarityA11yStrings.soluteAmountAndUnitPattern.value;
  const soluteAmountChangedPatternString = MolarityA11yStrings.soluteAmountChangedPattern.value;
  const colorChangePatternString = MolarityA11yStrings.colorChangePattern.value;
  const qualitativeSoluteAmountStatePatternString = MolarityA11yStrings.qualitativeSoluteAmountStatePattern.value;

  // solute amount regions strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aBunchOfLowercaseString = MolarityA11yStrings.aBunchOfLowercase.value;
  const aLittleString = MolarityA11yStrings.aLittle.value;
  const aLittleLowercaseString = MolarityA11yStrings.aLittleLowercase.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;
  const aLotOfLowercaseString = MolarityA11yStrings.aLotOfLowercase.value;
  const aLowAmountOfString = MolarityA11yStrings.aLowAmountOf.value;
  const aLowAmountOfLowercaseString = MolarityA11yStrings.aLowAmountOfLowercase.value;
  const maxAmountOfString = MolarityA11yStrings.maxAmountOf.value;
  const maxAmountOfLowercaseString = MolarityA11yStrings.maxAmountOfLowercase.value;

  // solids regions strings
  const someString = MolarityA11yStrings.some.value;
  const someLowercaseString = MolarityA11yStrings.someLowercase.value;
  const noString = MolarityA11yStrings.no.value;
  const noLowercaseString = MolarityA11yStrings.noLowercase.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const lighterString = MolarityA11yStrings.lighter.value;
  const darkerString = MolarityA11yStrings.darker.value;

  // constants
  const SOLUTE_AMOUNT_STRINGS = [
    noString,
    aLittleString,
    aLowAmountOfString,
    someString,
    aBunchOfString,
    aLotOfString,
    maxAmountOfString
  ];
  const SOLUTE_AMOUNT_STRINGS_LOWERCASE = [
    noLowercaseString,
    aLittleLowercaseString,
    aLowAmountOfLowercaseString,
    someLowercaseString,
    aBunchOfLowercaseString,
    aLotOfLowercaseString,
    maxAmountOfLowercaseString
  ];

  class SoluteAmountDescriber {

    /**
     * @param {Solution} solution - from model.
     * @param {SoluteDescriber} soluteDescriber
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, soluteDescriber, concentrationDescriber, useQuantitativeDescriptionsProperty ) {

      // @private
      this.solution = solution;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteAmountProperty = solution.soluteAmountProperty;
      this.soluteDescriber = soluteDescriber;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the descriptive region from SOLUTE_AMOUNT_STRINGS array.
      this.currentRegion = soluteAmountToIndex( this.solution.soluteAmountProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive solute amount region has just changed.
      this.soluteAmountRegionChanged = false;

      // @private
      // {boolean|null} - tracks whether solute amount has just increased. null when simulation starts or resets.
      this.soluteAmountIncreased = null;

      this.soluteAmountProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === soluteAmountToIndex( oldValue ),
          'current solute amount region not tracking the previous region as expected' );
        const oldRegion = this.currentRegion;
        this.currentRegion = soluteAmountToIndex( newValue );
        this.soluteAmountRegionChanged = this.currentRegion !== oldRegion;
        this.soluteAmountIncreased = newValue > oldValue;
      } );
    }

    /**
     * Note: this getter name must be the same as its counterpart in VolumeDescriber
     * @public
     * @returns {boolean}
     */
    getRegionChanged() {
      return this.soluteAmountRegionChanged;
    }

    /**
     * Creates a string that qualitatively or quantitatively describes the solute amount in the beaker.
     * @public
     * @returns {string} - e.g. 'contains a lot of potassium permanganate" or "contains 3.400 moles of drink mix"
     */
    getBeakerSoluteAmountString() {
      return StringUtils.fillIn( beakerSoluteAmountPatternString, {
        soluteAmount: this.getCurrentSoluteAmount( false ),
        solute: this.soluteDescriber.getCurrentSolute()
      } );
    }

    /**
     * TODO: add some doc here, see https://github.com/phetsims/molarity/issues/171
     * @typedef ChangeStrings
     * @type {Object}
     * @property {string} colorChangeString
     * @property {string} quantityChangeString
     */
    /**
     * Creates the substrings to describe the change in volume and the resulting change in solution color.
     * This function must have the same name as its counterpart in VolumeDescriber.
     * @public
     * @returns {ChangeStrings} - contains two strings.
     */
    getChangeStrings() {
      return {
        quantityChangeString: StringUtils.fillIn( soluteAmountChangedPatternString, {
          moreLess: this.soluteAmountIncreased ? moreCapitalizedString : lessCapitalizedString
        } ),
        colorChangeString: StringUtils.fillIn( colorChangePatternString, {
          lighterDarker: this.soluteAmountIncreased ? darkerString : lighterString
        } )
      };
    }

    /**
     * Gets the current value of soluteAmount either quantitatively or quantitatively to plug into descriptions.
     * Examples: "3.400 Moles" for quantitative or "A lot of" for qualitative
     * @param isCapitalized {boolean} - ignored if using quantitative descriptions
     * @public
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getCurrentSoluteAmount( isCapitalized = true ) {
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( soluteAmountAndUnitPatternString, {
          soluteAmount: Util.toFixed( Util.clamp( this.soluteAmountProperty.value, 0, 5.0 ), MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES )
        } );
      }
      else {
        return isCapitalized ? SOLUTE_AMOUNT_STRINGS[ soluteAmountToIndex( this.soluteAmountProperty.value ) ] :
               SOLUTE_AMOUNT_STRINGS_LOWERCASE[ soluteAmountToIndex( this.soluteAmountProperty.value ) ];
      }
    }

    /**
     * Creates a substring qualitatively describing the soluteAmount state
     * @public
     * @returns {string} - something like "a lot of drink mix"
     */
    getSoluteAmountState() {
      assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'descriptions should be quantitative' );
      return StringUtils.fillIn( qualitativeSoluteAmountStatePatternString, {
        soluteAmount: this.getCurrentSoluteAmount( false ),
        solute: this.soluteDescriber.getCurrentSolute()
      } );
    }

    /**
     * Generates the aria-value text for the solute amount slider
     * @public
     * @returns {string}
     */
    getSoluteAmountValueText() {
      return this.useQuantitativeDescriptionsProperty.value ? this.getCurrentSoluteAmount() : this.getSoluteAmountState();
    }
  }


  /**
   * Calculates which item to use from the SOLUTE_AMOUNT_STRINGS array. Region cutoff numbers are based on keypress
   * balances, which are documented here: https://github.com/phetsims/molarity/issues/128
   * @param {number} soluteAmount
   * @returns {number} - index (integer) to pull from SOLUTE_AMOUNT_STRINGS array.
   */
  const soluteAmountToIndex = soluteAmount => {
    if ( soluteAmount < 0.001 ) {
      return 0;
    }
    else if ( soluteAmount <= .151 ) {
      return 1;
    }
    else if ( soluteAmount <= .351 ) {
      return 2;
    }
    else if ( soluteAmount <= .601 ) {
      return 3;
    }
    else if ( soluteAmount <= .801 ) {
      return 4;
    }
    else if ( soluteAmount <= .999 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'SoluteAmountDescriber', SoluteAmountDescriber );
} );