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
  const fullString = MolarityA11yStrings.full.value;
  const halfFullString = MolarityA11yStrings.halfFull.value;
  const nearlyEmptyString = MolarityA11yStrings.nearlyEmpty.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFull.value;
  const overHalfFullString = MolarityA11yStrings.overHalfFull.value;
  const underHalfFullString = MolarityA11yStrings.underHalfFull.value;
  const atLowestAmountString = MolarityA11yStrings.atLowestAmount.value;

  // volume active regions strings
  const isFullString = MolarityA11yStrings.isFull.value;
  const isNearlyFullString = MolarityA11yStrings.isNearlyFull.value;
  const isOverHalfFullString = MolarityA11yStrings.isOverHalfFull.value;
  const isHalfFullString = MolarityA11yStrings.isHalfFull.value;
  const isUnderHalfFullString = MolarityA11yStrings.isUnderHalfFull.value;
  const isAtLowestAmountString = MolarityA11yStrings.isAtLowestAmount.value;
  const isNearlyEmptyString = MolarityA11yStrings.isNearlyEmpty.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;
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
     * @param {Solution} solution - from model
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, concentrationDescriber, useQuantitativeDescriptionsProperty ) {

      // @private
      this.solution = solution;
      this.volumeProperty = solution.volumeProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the descriptive region from VOLUME_STRINGS array.
      this.currentRegion = volumeToIndex( this.solution.volumeProperty.value );

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
     * TODO: fix the return typedef of this method just like in SoluteAmountDescriber.js
     * Creates the substrings to describe the change in volume and the resulting change in solution color
     * @public
     * @returns {Object} - contains two strings.
     */
    getVolumeChangeStrings() {
      return {
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
    if ( volume <= .201 ) {
      return 0;
    }
    else if ( volume <= .349 ) {
      return 1;
    }
    else if ( volume <= .499 ) {
      return 2;
    }
    else if ( volume <= .501 ) {
      return 3;
    }
    else if ( volume <= .799 ) {
      return 4;
    }
    else if ( volume <= .999 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} );