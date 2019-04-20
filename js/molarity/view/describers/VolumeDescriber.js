// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about VolumeProperty.
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
  const fullString = MolarityA11yStrings.fullString.value;
  const halfFullString = MolarityA11yStrings.halfFullString.value;
  const lowString = MolarityA11yStrings.lowString.value;
  const nearlyEmptyString = MolarityA11yStrings.nearlyEmptyString.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFullString.value;
  const overHalfString = MolarityA11yStrings.overHalfString.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const underHalfString = MolarityA11yStrings.underHalfString.value;
  const quantitativeInitialValueTextPatternString = MolarityA11yStrings.quantitativeInitialValueTextPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
  const qualitativeVolumeValueTextPatternString = MolarityA11yStrings.qualitativeVolumeValueTextPattern.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeVolumeStatePatternString = MolarityA11yStrings.qualitativeVolumeStatePattern.value;
  const qualitativeStateInfoPatternString = MolarityA11yStrings.qualitativeStateInfoPattern.value;
  const volumeChangePatternString = MolarityA11yStrings.volumeChangePattern.value;

  const lessString = MolarityA11yStrings.lessString.value;
  const moreString = MolarityA11yStrings.moreString.value;


  // constants
  const VOLUME_STRINGS = [
    nearlyEmptyString,
    lowString,
    underHalfString,
    halfFullString,
    overHalfString,
    nearlyFullString,
    fullString
  ];

  class VolumeDescriber {

    /**
     * @param {Property} volumeProperty - from Solution model element
     * @param {Property} soluteProperty - from Solution model element
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {BooleanProperty} valuesVisibleProperty - whether values are visible in the view
     */
    constructor( volumeProperty, soluteProperty, concentrationDescriber, valuesVisibleProperty ) {

      // @private
      this.concentrationDescriber = concentrationDescriber;
      this.volumeProperty = volumeProperty;
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;

      // @public -- TODO: doc
      this.initialVolumeAlert = true;
      this.currentRegion = null; // filled in below, TODO: doc
      this.volumeRegionChanged = null; // filled in below, TODO: doc
      this.volumeChangeValue = null;

      volumeProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ) );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = this.currentRegion !== oldRegion;
        this.volumeChangeValue = newValue > oldValue ? moreString : lessString;
      } );
    }

    /**
     * Returns a string describing the change in volume (e.g. "more solution")
     * @private
     * @returns {string} - quantitative or qualitative description of current volume.
     */
    getVolumeChangeString() {
      return StringUtils.fillIn( volumeChangePatternString, {
        moreLess: this.volumeChangeValue
      } );
    }

    // fills in state info if the volume or concentration regions have changed
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
     * Gets the current value of volume either quantitatively or quantitatively to plug into descriptions.
     * Examples: "1.500 Liters" for quantitative or "half full" for qualitative
     * @private
     * @returns {string} - quantitative or qualitative description of current volume.
     */
    getCurrentVolume() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
          volume: Util.toFixed( this.volumeProperty.value, MConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else {
        return VOLUME_STRINGS[ volumeToIndex( this.volumeProperty.value ) ];
      }
    }

    /**
     * @public
     * @returns {string} - main value text for when volume changes
     */
    getVolumeChangedValueText() {
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

      if ( this.initialVolumeAlert ) {
        string = quantitativeInitialValueTextPatternString;
        this.initialVolumeAlert = false;
      }

      return StringUtils.fillIn( string, {
        concentrationChange: this.concentrationDescriber.getConcentrationChangeString(), // TODO: handle capital more/less on initial text
        quantity: this.getCurrentVolume(),
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