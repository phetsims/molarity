// Copyright 2019, University of Colorado Boulder

/**
 * VolumeDescriber is responsible for generating strings about Solution.volumeProperty.
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
  const hasVolumePatternString = MolarityA11yStrings.hasVolumePattern.value;
  const colorChangePatternString = MolarityA11yStrings.colorChangePattern.value;
  const qualitativeVolumeStatePatternString = MolarityA11yStrings.qualitativeVolumeStatePattern.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const volumeChangePatternString = MolarityA11yStrings.volumeChangePattern.value;

  // volume regions strings
  const fullString = MolarityA11yStrings.volumeRegions.passive.full.value;
  const halfFullString = MolarityA11yStrings.volumeRegions.passive.halfFull.value;
  const nearlyEmptyString = MolarityA11yStrings.volumeRegions.passive.nearlyEmpty.value;
  const nearlyFullString = MolarityA11yStrings.volumeRegions.passive.nearlyFull.value;
  const overHalfFullString = MolarityA11yStrings.volumeRegions.passive.overHalfFull.value;
  const underHalfFullString = MolarityA11yStrings.volumeRegions.passive.underHalfFull.value;
  const atLowestAmountString = MolarityA11yStrings.volumeRegions.passive.atLowestAmount.value;

  // volume active regions strings
  const isFullString = MolarityA11yStrings.volumeRegions.active.isFull.value;
  const isNearlyFullString = MolarityA11yStrings.volumeRegions.active.isNearlyFull.value;
  const isOverHalfFullString = MolarityA11yStrings.volumeRegions.active.isOverHalfFull.value;
  const isHalfFullString = MolarityA11yStrings.volumeRegions.active.isHalfFull.value;
  const isUnderHalfFullString = MolarityA11yStrings.volumeRegions.active.isUnderHalfFull.value;
  const isAtLowestAmountString = MolarityA11yStrings.volumeRegions.active.isAtLowestAmount.value;
  const isNearlyEmptyString = MolarityA11yStrings.volumeRegions.active.isNearlyEmpty.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.less.capitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.more.capitalized.value;
  const lighterString = MolarityA11yStrings.lighter.value;
  const darkerString = MolarityA11yStrings.darker.value;

  // constants
  const VOLUME_STRINGS = [
    atLowestAmountString,
    nearlyEmptyString,
    underHalfFullString,
    halfFullString,
    overHalfFullString,
    nearlyFullString,
    fullString
  ];

  const VOLUME_ACTIVE_STRINGS = [
    isAtLowestAmountString,
    isNearlyEmptyString,
    isUnderHalfFullString,
    isHalfFullString,
    isOverHalfFullString,
    isNearlyFullString,
    isFullString
  ];

  class VolumeDescriber {

    /**
     * @param {Property.<number>} volumeProperty - the volume of the solution
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( volumeProperty, useQuantitativeDescriptionsProperty ) {

      // @private
      this.volumeProperty = volumeProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the descriptive region from VOLUME_STRINGS array.
      this.currentRegion = volumeToIndex( this.volumeProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive volume region has just changed.
      this.volumeRegionChanged = false;

      // @private
      // {boolean|null} - tracks whether volume has just increased or decreased. null when simulation starts or resets.
      this.volumeIncreased = null;

      this.volumeProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ),
          'current volume region not tracking the previous region as expected' );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = this.currentRegion !== oldRegion;
        this.volumeIncreased = newValue > oldValue;
      } );
    }

    /**
     * Note: this getter name must be the same as its counterpart in SoluteAmountDescriber
     * @public
     * @returns {boolean}
     */
    getRegionChanged() {
      return this.volumeRegionChanged;
    }

    /**
     * Gets the current value of volume either quantitatively or quantitatively to put into descriptions.
     * @param {boolean} [isActive]
     * @public
     * @returns {string} - examples: "1.500 Liters" for quantitative or "half full" for qualitative.
     */
    getCurrentVolume( isActive = false ) {
      const volumeIndex = volumeToIndex( this.volumeProperty.value );
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        const quantitativeString = isActive ? hasVolumePatternString : solutionVolumeAndUnitPatternString;
        return StringUtils.fillIn( quantitativeString, {
          volume: Util.toFixed( this.volumeProperty.value, MolarityConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else if ( isActive ) {
        return VOLUME_ACTIVE_STRINGS [ volumeIndex ];
      }
      else {
        return VOLUME_STRINGS[ volumeIndex ];
      }
    }

    /**
     * Creates the substrings to describe the change in volume and the resulting change in solution color.
     * This function must have the same name as its counterpart in VolumeDescriber. This function should only be called
     * as a result of the volumeProperty changing (hence usage of `this.volumeIncreased`.
     * @public
     * @returns {StringsFromSliderChange} - contains two strings.
     */
    getStringsFromSliderChange() {
      return {

        // "quantity" meaning "volume" here
        quantityChangeString: StringUtils.fillIn( volumeChangePatternString, {
          moreLess: this.volumeIncreased ? moreCapitalizedString : lessCapitalizedString
        } ),
        colorChangeString: StringUtils.fillIn( colorChangePatternString, {
          lighterDarker: this.volumeIncreased ? lighterString : darkerString
        } )
      };
    }

    /**
     * Generates the aria-valuetext for the volume slider.
     * @public
     * @returns {string}
     */
    getVolumeAriaValueText() {
      return this.useQuantitativeDescriptionsProperty.value ?
             this.getCurrentVolume() :
             StringUtils.fillIn( qualitativeVolumeStatePatternString, {
               volume: this.getCurrentVolume()
             } );
    }
  }

  /**
   * Calculates which item to use from the VOLUME_STRINGS array. Region cutoff numbers are based on keypress balances,
   * which are documented here: https://github.com/phetsims/molarity/issues/128
   * @param {number} volume
   * @returns {number} - index to pull from VOLUME_STRINGS array.
   */
  const volumeToIndex = volume => {

    // normalize in case the range changes in the future.
    const normalizedVolume = MolarityConstants.SOLUTION_VOLUME_RANGE.getNormalizedValue( volume );
    if ( normalizedVolume <= 0.00125 ) {
      return 0;
    }
    else if ( normalizedVolume <= 0.18625 ) {
      return 1;
    }
    else if ( normalizedVolume <= 0.37375 ) {
      return 2;
    }
    else if ( normalizedVolume <= 0.37625 ) {
      return 3;
    }
    else if ( normalizedVolume <= 0.74875 ) {
      return 4;
    }
    else if ( normalizedVolume <= 0.99875 ) {
      return 5;
    }
    else {
      assert && assert( volume <= MolarityConstants.SOLUTION_VOLUME_RANGE.max, 'unexpected volume provided' );
      return 6;
    }
  };

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} );