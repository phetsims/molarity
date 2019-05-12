// Copyright 2019, University of Colorado Boulder

/**
 * VolumeDescriber is responsible for generating strings about VolumeProperty.
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
  const qualitativeStateInfoPatternString = MolarityA11yStrings.qualitativeStateInfoPattern.value;
  const qualitativeVolumeSliderValueTextPatternString = MolarityA11yStrings.qualitativeVolumeSliderValueTextPattern.value;
  const qualitativeVolumeStatePatternString = MolarityA11yStrings.qualitativeVolumeStatePattern.value;
  const quantitativeVolumeSliderValueTextPatternString = MolarityA11yStrings.quantitativeVolumeSliderValueTextPattern.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const volumeChangePatternString = MolarityA11yStrings.volumeChangePattern.value;

  // volume regions strings
  const fullString = MolarityA11yStrings.full.value;
  const halfFullString = MolarityA11yStrings.halfFull.value;
  const lowString = MolarityA11yStrings.low.value;
  const nearlyEmptyString = MolarityA11yStrings.nearlyEmpty.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFull.value;
  const overHalfFullString = MolarityA11yStrings.overHalfFull.value;
  const underHalfFullString = MolarityA11yStrings.underHalfFull.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;

  // constants
  const VOLUME_STRINGS = [
    nearlyEmptyString,
    lowString,
    underHalfFullString,
    halfFullString,
    overHalfFullString,
    nearlyFullString,
    fullString
  ];

  class VolumeDescriber {

    /**
     * @param {Solution} solution - from model
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {BooleanProperty} useQuantitativeDescriptions
     */
    constructor( solution, concentrationDescriber, useQuantitativeDescriptions ) {

      // @private
      this.solution = solution;
      this.volumeProperty = solution.volumeProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.useQuantitativeDescriptions = useQuantitativeDescriptions;

      // @private
      // {number} - the index of the descriptive region from VOLUME_STRINGS array.
      this.currentRegion = volumeToIndex( this.solution.volumeProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive volume region has just changed.
      this.volumeRegionChanged = false;

      // @private
      // {boolean} - tracks whether the volume slider has just been focused.
      this.isInitialVolumeAlert = true;

      // @private
      // {boolean|null} - tracks whether volume has just increased or decreased. null when simulation starts or resets.
      this.volumeIncreased = null;

      this.volumeProperty.link( ( newValue, oldValue ) => {
        assert && assert( newValue !== oldValue, 'unexpected: called with no change in volume' );
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ),
          'current volume region not tracking the previous region as expected' );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = this.currentRegion !== oldRegion;
        this.volumeIncreased = newValue > oldValue;
      } );
    }

    /**
     * Sets the initial volume alert value to true when a slider is focused to trigger a special alert right after focus.
     * @public
     */
    setInitialVolumeAlert() {
      this.isInitialVolumeAlert = true;
    }

    /**
     * Gets the current value of volume either quantitatively or quantitatively to plug into descriptions.
     * @public
     * @returns {string} - examples: "1.500 Liters" for quantitative or "half full" for qualitative.
     */
    getCurrentVolume() {
      if ( this.useQuantitativeDescriptions.value ) {
        return StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
          volume: Util.toFixed( this.volumeProperty.value, MConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else {
        return VOLUME_STRINGS[ volumeToIndex( this.volumeProperty.value ) ];
      }
    }

    /**
     * Creates a substring describing the change in volume
     * @private
     * @returns {string} - example "More solution"
     */
    getVolumeChangeString() {
      return StringUtils.fillIn( volumeChangePatternString, {
        moreLess: this.volumeIncreased ? moreCapitalizedString : lessCapitalizedString
      } );
    }

    /**
     * Creates a substring describing the volume state
     * @private
     * @returns {string} - something like "Beaker half full"
     */
    getVolumeState() {
      return StringUtils.fillIn( qualitativeVolumeStatePatternString, { volume: this.getCurrentVolume() } );
    }

    /**
     * Creates a string describing the volume and concentration current state when the volume or concentration
     * descriptive regions have changed.
     * @private
     * @returns {string} - example: "Beaker half full. Solution very concentrated."
     */
    getVolumeStateInfo() {
      if ( this.volumeRegionChanged || this.concentrationDescriber.concentrationRegionChanged ) {
        return StringUtils.fillIn( qualitativeStateInfoPatternString, {
          quantityState: this.getVolumeState(),
          concentrationState: this.concentrationDescriber.getConcentrationState()
        } );
      }
      else {
        return '';
      }
    }

    /**
     * Creates the string to be used as the volume slider's aria-valueText on focus.
     * @public
     * @returns {string}
     */
    getOnFocusVolumeValueText() {
      const string = this.useQuantitativeDescriptions.value ? quantitativeVolumeSliderValueTextPatternString :
                     qualitativeVolumeSliderValueTextPatternString;
      return StringUtils.fillIn( string, {
        volume: this.getCurrentVolume()
      } );
    }

    /**
     * Main method for generating aria-valueText when the volumeProperty changes.
     * @public
     * @returns {string}
     */
    getVolumeChangedValueText() {
      if ( this.concentrationDescriber.isNewSaturationState() ) {

        // special strings are generated if the solution is either newly saturated or newly unsaturated
        return this.concentrationDescriber.getSaturationChangedString();
      }
      else {
        return this.useQuantitativeDescriptions.value ?
               this.getQuantitativeVolumeValueText() :
               this.getQualitativeVolumeValueText();
      }
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is checked
     * @private
     * @returns {string}
     */
    getQuantitativeVolumeValueText() {
      const valueText = this.concentrationDescriber.getQuantitativeValueText( this.isInitialVolumeAlert,
        this.getCurrentVolume() );
      if ( this.isInitialVolumeAlert ) {
        this.isInitialVolumeAlert = false;
      }
      return valueText;
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is not checked for saturated and unsaturated states.
     * @private
     * @returns {string}
     */
    getQualitativeVolumeValueText() {

      // aria-live alert
      this.concentrationDescriber.getQualitativeAlert( this.getVolumeChangeString(), this.getVolumeStateInfo(),
        this.volumeRegionChanged );

      // aria-valueText
      return this.getVolumeState();
    }
  }

  /**
   * Calculates which item to use from the VOLUME_STRINGS array.
   * @param {number} volume
   * @returns {number} - index to pull from VOLUME_STRINGS array.
   */
  const volumeToIndex = ( volume ) => {
    if ( volume <= .220 ) {
      return 0;
    }
    else if ( volume <= .330 ) {
      return 1;
    }
    else if ( volume <= .410 ) {
      return 2;
    }
    else if ( volume <= .530 ) {
      return 3;
    }
    else if ( volume <= .780 ) {
      return 4;
    }
    else if ( volume <= .960 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} );