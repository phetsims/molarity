// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about VolumeProperty
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const fullString = MolarityA11yStrings.fullString.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFullString.value;
  const overHalfString = MolarityA11yStrings.overHalfString.value;
  const halfFullString = MolarityA11yStrings.halfFullString.value;
  const underHalfString = MolarityA11yStrings.underHalfString.value;
  const lowString = MolarityA11yStrings.lowString.value;
  const leastAmountString = MolarityA11yStrings.leastAmountString.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const volumeStateInfoPatternString = MolarityA11yStrings.volumeStateInfoPattern.value;

  // constants
  const VOLUME_STRINGS = [
    leastAmountString,
    lowString,
    underHalfString,
    halfFullString,
    overHalfString,
    nearlyFullString,
    fullString
  ];


  class VolumeDescriber {

    /**
     * @param {VolumeProperty} volumeProperty- from MolarityModel
     * @param {SoluteProperty} soluteProperty- from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( volumeProperty, soluteProperty, valuesVisibleProperty ) {

      // @private
      this.volumeProperty = volumeProperty;
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.volumeRegion = 0; // tracks the last descriptive region for volume
    }

    /** calculates the which item to use from the VOLUME_STRINGS array
     * @returns {number} index to pull from VOLUME_STRINGS array
     */
    volumeToIndex() {
      const volume = this.volumeProperty.value;
      if ( volume <= .220 ) {
        return 0;
      }
      if ( volume <= .330 ) {
        return 1;
      }
      if ( volume <= .410 ) {
        return 2;
      }
      if ( volume <= .530 ) {
        return 3;
      }
      if ( volume <= .780 ) {
        return 4;
      }
      if ( volume <= .960 ) {
        return 5;
      }
      if ( volume <= 1.000 ) {
        return 6;
      }
    }

    /**
     * gets the current value of volume either quantitatively or quantitatively to plug into descriptions
     * @private
     * @returns {string} - quantitative or qualitative description of current volume
     */
    getCurrentVolume() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
          volume: Util.toFixed( this.volumeProperty.value, 3 )
        } );
      }
      else {
        return VOLUME_STRINGS[ this.volumeToIndex() ];
      }
    }

    /**
     * Checks to see if the volume descriptive region has changed, and updates to reflect new regions
     * @public
     * @returns {boolean} - whether or not there was a region to update
     */
    updateVolumeRegion() {
      const volumeIndex = this.volumeToIndex();
      const isNewVolumeRegion = this.volumeRegion !== volumeIndex;

      // update the region to the new one if a region has changed
      if ( isNewVolumeRegion ) {
        this.volumeRegion = volumeIndex;
      }

      return isNewVolumeRegion;
    }


    /**
     * fills in the state info if region has changed and the solution is not saturated
     * @private
     * @returns {string}
     */
    getVolumeStateInfoNotSaturated() {
      return StringUtils.fillIn( volumeStateInfoPatternString, {
        volume: this.getCurrentVolume()
      } );
    }
  }

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} )
;