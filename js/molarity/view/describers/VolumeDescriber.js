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
      this.changed = null; // filled in below, TOOD: doc

      volumeProperty.link( ( newValue, oldValue ) => {
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ) );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.changed = this.currentRegion !== oldRegion;
      } );
    }


    /**
     * @returns {string} - main value text for when volume changes
     */
    getVolumeChangedValueText() {
      return this.valuesVisibleProperty.value ? this.getQuantitativeAriaValueText() : this.getQualitativeAriaValueText();
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
        quantity: this.getCurrentVolumeAndUnit(),
        concentration: this.concentrationDescriber.getCurrentConcentration()
      } );
    }

    // TODO: support this
    getQualitativeAriaValueText() {
      return 'this is a simulation, you are dreaming.';
    }

    /**
     * Gets the current value of volume either quantitatively or quantitatively to plug into descriptions.
     * @private
     * @returns {string} - quantitative or qualitative description of current volume.
     */
    getCurrentVolumeAndUnit() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
          volume: Util.toFixed( this.volumeProperty.value, MConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else {
        return VOLUME_STRINGS[ volumeToIndex( this.volumeProperty.value ) ];
      }
    }

    // TODO: use this in new system
    // /**
    //  * Fills in the state info if region has changed and the solution is not saturated.
    //  * @private
    //  * @returns {string}
    //  */
    // getVolumeStateInfoNotSaturated() {
    //   return StringUtils.fillIn( volumeStateInfoPatternString, {
    //     volume: this.getCurrentVolumeAndUnit(),
    //     concentration: this.concentrationDescriber.getCurrentConcentration()
    //   } );
    // }
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
} )
;