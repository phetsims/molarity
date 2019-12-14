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

  // solute amount regions capitalized strings
  const soluteAmountRegionsCapitalizedNoString = MolarityA11yStrings.soluteAmountRegions.capitalized.no.value;
  const soluteAmountRegionsCapitalizedALowAmountOfString = MolarityA11yStrings.soluteAmountRegions.capitalized.aLowAmountOf.value;
  const soluteAmountRegionsCapitalizedALittleString = MolarityA11yStrings.soluteAmountRegions.capitalized.aLittle.value;
  const soluteAmountRegionsCapitalizedSomeString = MolarityA11yStrings.soluteAmountRegions.capitalized.some.value;
  const soluteAmountRegionsCapitalizedALotOfString = MolarityA11yStrings.soluteAmountRegions.capitalized.aLotOf.value;
  const soluteAmountRegionsCapitalizedABunchOfString = MolarityA11yStrings.soluteAmountRegions.capitalized.aBunchOf.value;
  const soluteAmountRegionsCapitalizedMaxAmountOfString = MolarityA11yStrings.soluteAmountRegions.capitalized.maxAmountOf.value;

  // solute amount regions capitalized strings
  const soluteAmountRegionsLowercaseNoString = MolarityA11yStrings.soluteAmountRegions.lowercase.no.value;
  const soluteAmountRegionsLowercaseALowAmountOfString = MolarityA11yStrings.soluteAmountRegions.lowercase.aLowAmountOf.value;
  const soluteAmountRegionsLowercaseALittleString = MolarityA11yStrings.soluteAmountRegions.lowercase.aLittle.value;
  const soluteAmountRegionsLowercaseSomeString = MolarityA11yStrings.soluteAmountRegions.lowercase.some.value;
  const soluteAmountRegionsLowercaseALotOfString = MolarityA11yStrings.soluteAmountRegions.lowercase.aLotOf.value;
  const soluteAmountRegionsLowercaseABunchOfString = MolarityA11yStrings.soluteAmountRegions.lowercase.aBunchOf.value;
  const soluteAmountRegionsLowercaseNaxAmountOfString = MolarityA11yStrings.soluteAmountRegions.lowercase.maxAmountOf.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const lighterString = MolarityA11yStrings.lighter.value;
  const darkerString = MolarityA11yStrings.darker.value;

  // constants
  const SOLUTE_AMOUNT_STRINGS_CAPITALIZED = [
    soluteAmountRegionsCapitalizedNoString,
    soluteAmountRegionsCapitalizedALittleString,
    soluteAmountRegionsCapitalizedALowAmountOfString,
    soluteAmountRegionsCapitalizedSomeString,
    soluteAmountRegionsCapitalizedABunchOfString,
    soluteAmountRegionsCapitalizedALotOfString,
    soluteAmountRegionsCapitalizedMaxAmountOfString
  ];
  const SOLUTE_AMOUNT_STRINGS_LOWERCASE = [
    soluteAmountRegionsLowercaseNoString,
    soluteAmountRegionsLowercaseALittleString,
    soluteAmountRegionsLowercaseALowAmountOfString,
    soluteAmountRegionsLowercaseSomeString,
    soluteAmountRegionsLowercaseABunchOfString,
    soluteAmountRegionsLowercaseALotOfString,
    soluteAmountRegionsLowercaseNaxAmountOfString
  ];

  class SoluteAmountDescriber {

    /**
     * @param {Property.<number>} soluteAmountProperty - from model.
     * @param {SoluteDescriber} soluteDescriber
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( soluteAmountProperty, soluteDescriber, useQuantitativeDescriptionsProperty ) {

      // @private
      this.soluteAmountProperty = soluteAmountProperty;
      this.soluteDescriber = soluteDescriber;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the descriptive region from SOLUTE_AMOUNT_STRINGS arrays.
      this.currentRegion = soluteAmountToIndex( this.soluteAmountProperty.value );

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
        solute: this.soluteDescriber.getCurrentSoluteName()
      } );
    }


    /**
     * Creates the substrings to describe the change in solute amount and the resulting change in solution color.
     * This function must have the same name as its counterpart in VolumeDescriber. This function should only be called
     * as a result of the soluteAmountProperty changing (hence usage of `this.soluteAmountIncreased`.
     * @public
     * @returns {StringsFromSliderChange} - contains two strings.
     */
    getStringsFromSliderChange() {
      return {

        // "quantity" meaning "solute amount" here
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
     * Examples: "0.800 Moles" for quantitative or "A lot of" for qualitative
     * @param [isCapitalized] {boolean} - ignored if using quantitative descriptions
     * @public
     * @returns {string} - quantitative or qualitative description of current soluteAmount.
     */
    getCurrentSoluteAmount( isCapitalized = true ) {
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        const soluteAmountMin = MolarityConstants.SOLUTE_AMOUNT_RANGE.min;
        const soluteAmountMax = MolarityConstants.SOLUTE_AMOUNT_RANGE.max;
        const clampedSoluteAmount = Util.clamp( this.soluteAmountProperty.value, soluteAmountMin, soluteAmountMax );

        return StringUtils.fillIn( soluteAmountAndUnitPatternString, {
          soluteAmount: Util.toFixed( clampedSoluteAmount, MolarityConstants.SOLUTE_AMOUNT_DECIMAL_PLACES )
        } );
      }
      else {
        return isCapitalized ? SOLUTE_AMOUNT_STRINGS_CAPITALIZED[ soluteAmountToIndex( this.soluteAmountProperty.value ) ] :
               SOLUTE_AMOUNT_STRINGS_LOWERCASE[ soluteAmountToIndex( this.soluteAmountProperty.value ) ];
      }
    }

    /**
     * Generates the aria-value text for the solute amount slider
     * @public
     * @returns {string}
     */
    getSoluteAmountValueText() {
      return this.useQuantitativeDescriptionsProperty.value ?
             this.getCurrentSoluteAmount() :
             StringUtils.fillIn( qualitativeSoluteAmountStatePatternString, {
               soluteAmount: this.getCurrentSoluteAmount( false ),
               solute: this.soluteDescriber.getCurrentSoluteName()
             } );
    }
  }


  /**
   * Calculates which item to use from the SOLUTE_AMOUNT_STRINGS arrays. Region cutoff numbers are based on keypress
   * balances, which are documented here: https://github.com/phetsims/molarity/issues/128
   * @param {number} soluteAmount
   * @returns {number} - index (integer) to pull from SOLUTE_AMOUNT_STRINGS arrays.
   */
  const soluteAmountToIndex = soluteAmount => {

    // normalize in case the range changes in the future.
    const normalizedSoluteAmount = MolarityConstants.SOLUTE_AMOUNT_RANGE.getNormalizedValue( soluteAmount );
    if ( normalizedSoluteAmount < 0.001 ) {
      return 0;
    }
    else if ( normalizedSoluteAmount <= .151 ) {
      return 1;
    }
    else if ( normalizedSoluteAmount <= .351 ) {
      return 2;
    }
    else if ( normalizedSoluteAmount <= .601 ) {
      return 3;
    }
    else if ( normalizedSoluteAmount <= .801 ) {
      return 4;
    }
    else if ( normalizedSoluteAmount <= .999 ) {
      return 5;
    }
    else {
      assert && assert( soluteAmount <= MolarityConstants.SOLUTE_AMOUNT_RANGE.max, 'unexpected solute amount provided' );
      return 6;
    }
  };

  return molarity.register( 'SoluteAmountDescriber', SoluteAmountDescriber );
} );