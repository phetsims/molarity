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
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utils = require( 'DOT/Utils' );

  // a11y strings
  const hasVolumePatternString = require( 'string!MOLARITY/a11y.hasVolumePattern' );
  const colorChangePatternString = require( 'string!MOLARITY/a11y.colorChangePattern' );
  const qualitativeVolumeStatePatternString = require( 'string!MOLARITY/a11y.qualitativeVolumeStatePattern' );
  const solutionVolumeAndUnitPatternString = require( 'string!MOLARITY/a11y.solutionVolumeAndUnitPattern' );
  const volumeChangePatternString = require( 'string!MOLARITY/a11y.volumeChangePattern' );

  // volume regions strings
  const volumeRegionsPassiveFullString = require( 'string!MOLARITY/a11y.volumeRegions.passive.full' );
  const volumeRegionsPassiveHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.passive.halfFull' );
  const volumeRegionsPassiveNearlyEmptyString = require( 'string!MOLARITY/a11y.volumeRegions.passive.nearlyEmpty' );
  const volumeRegionsPassiveNearlyFullString = require( 'string!MOLARITY/a11y.volumeRegions.passive.nearlyFull' );
  const volumeRegionsPassiveOverHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.passive.overHalfFull' );
  const volumeRegionsPassiveUnderHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.passive.underHalfFull' );
  const volumeRegionsPassiveAtLowestAmountString = require( 'string!MOLARITY/a11y.volumeRegions.passive.atLowestAmount' );

  // volume active regions strings
  const volumeRegionsActiveIsFullString = require( 'string!MOLARITY/a11y.volumeRegions.active.isFull' );
  const volumeRegionsActiveIsNearlyFullString = require( 'string!MOLARITY/a11y.volumeRegions.active.isNearlyFull' );
  const volumeRegionsActiveIsOverHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.active.isOverHalfFull' );
  const volumeRegionsActiveIsHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.active.isHalfFull' );
  const volumeRegionsActiveIsUnderHalfFullString = require( 'string!MOLARITY/a11y.volumeRegions.active.isUnderHalfFull' );
  const volumeRegionsActiveIsAtLowestAmountString = require( 'string!MOLARITY/a11y.volumeRegions.active.isAtLowestAmount' );
  const volumeRegionsActiveIsNearlyEmptyString = require( 'string!MOLARITY/a11y.volumeRegions.active.isNearlyEmpty' );

  // change strings
  const lessCapitalizedString = require( 'string!MOLARITY/a11y.less.capitalized' );
  const moreCapitalizedString = require( 'string!MOLARITY/a11y.more.capitalized' );
  const lighterString = require( 'string!MOLARITY/a11y.lighter' );
  const darkerString = require( 'string!MOLARITY/a11y.darker' );

  // constants
  const VOLUME_STRINGS = [
    volumeRegionsPassiveAtLowestAmountString,
    volumeRegionsPassiveNearlyEmptyString,
    volumeRegionsPassiveUnderHalfFullString,
    volumeRegionsPassiveHalfFullString,
    volumeRegionsPassiveOverHalfFullString,
    volumeRegionsPassiveNearlyFullString,
    volumeRegionsPassiveFullString
  ];

  const VOLUME_ACTIVE_STRINGS = [
    volumeRegionsActiveIsAtLowestAmountString,
    volumeRegionsActiveIsNearlyEmptyString,
    volumeRegionsActiveIsUnderHalfFullString,
    volumeRegionsActiveIsHalfFullString,
    volumeRegionsActiveIsOverHalfFullString,
    volumeRegionsActiveIsNearlyFullString,
    volumeRegionsActiveIsFullString
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
      let currentRegion = volumeToIndex( this.volumeProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive volume region has just changed.
      this.volumeRegionChanged = false;

      // @private
      // {boolean|null} - tracks whether volume has just increased or decreased. null when simulation starts or resets.
      this.volumeIncreased = null;

      this.volumeProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( currentRegion === volumeToIndex( oldValue ),
          'current volume region not tracking the previous region as expected' );
        const oldRegion = currentRegion;
        currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = currentRegion !== oldRegion;
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
          volume: Utils.toFixed( this.volumeProperty.value, MolarityConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
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