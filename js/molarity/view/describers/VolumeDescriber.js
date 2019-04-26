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
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeStateInfoPatternString = MolarityA11yStrings.qualitativeStateInfoPattern.value;
  const qualitativeVolumeSliderValueTextPatternString = MolarityA11yStrings.qualitativeVolumeSliderValueTextPattern.value;
  const qualitativeVolumeStatePatternString = MolarityA11yStrings.qualitativeVolumeStatePattern.value;
  const qualitativeVolumeValueTextPatternString = MolarityA11yStrings.qualitativeVolumeValueTextPattern.value;
  const quantitativeInitialValueTextPatternString = MolarityA11yStrings.quantitativeInitialValueTextPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
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
  const lessString = MolarityA11yStrings.lessString.value;
  const moreString = MolarityA11yStrings.moreString.value;

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
      this.currentRegion = null; // number -- the index of the descriptive region from VOLUME_STRINGS array.
      this.volumeRegionChanged = null; // boolean -- tracks whether the descriptive volume region has just changed.
      this.volumeChangeValue = null; // string -- describes whether volume has just increased or decreased
      this.isInitialVolumeAlert = true; // tracks whether the volume slider has just been focused

      this.volumeProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ) );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = this.currentRegion !== oldRegion;
        this.volumeChangeValue = newValue > oldValue ? moreString : lessString;
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
     * @private
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
        moreLess: this.volumeChangeValue
      } );
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
          quantityState: StringUtils.fillIn( qualitativeVolumeStatePatternString, { volume: this.getCurrentVolume() } ),
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
    getOnFocusVolumeAriaValueText() {
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
        return this.useQuantitativeDescriptions.value ? this.getQuantitativeAriaValueText() : this.getQualitativeAriaValueText();
      }
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is checked
     * @private
     * @returns {string}
     */
    getQuantitativeAriaValueText() {
      let string = quantitativeValueTextPatternString;

      // A different pattern is used when it's the first alert read out after the volume slider has been focused.
      if ( this.isInitialVolumeAlert ) {
        string = quantitativeInitialValueTextPatternString;
        this.isInitialVolumeAlert = false;
      }

      return StringUtils.fillIn( string, {
        concentrationChange: this.concentrationDescriber.getConcentrationChangeString(), // TODO: handle capital more/less on initial text
        quantity: this.getCurrentVolume(),
        concentration: this.concentrationDescriber.getCurrentConcentration()
      } );
    }

    /**
     * Creates aria-valueText strings when the "show values" checkbox is not checked.
     * @private
     * @returns {string}
     */
    getQualitativeAriaValueText() {
      if ( this.solution.isSaturated() ) {
        return StringUtils.fillIn( qualitativeSaturatedValueTextPatternString, {
          propertyAmountChange: this.getVolumeChangeString(),
          solidsChange: this.concentrationDescriber.getSolidsChangeString(),
          stillSaturatedClause: this.concentrationDescriber.getStillSaturatedClause()
        } );
      }
      else {
        return StringUtils.fillIn( qualitativeVolumeValueTextPatternString, {
          volumeChange: this.getVolumeChangeString(),
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString(),
          stateInfo: this.getVolumeStateInfo()
        } );
      }
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