// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate changes to the selected solute
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );

  // sounds
  const compoundWLowPassFilter001Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-001.mp3' );
  const compoundWLowPassFilter002Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-002.mp3' );
  const compoundWLowPassFilter003Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-003.mp3' );
  const compoundWLowPassFilter004Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-004.mp3' );
  const compoundWLowPassFilter005Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-005.mp3' );
  const compoundWLowPassFilter006Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-006.mp3' );
  const compoundWLowPassFilter007Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-007.mp3' );
  const compoundWLowPassFilter008Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-008.mp3' );
  const compoundWLowPassFilter009Sound = require( 'sound!MOLARITY/compound-w-low-pass-filter-009.mp3' );

  // sounds
  const selectionSounds = [
    compoundWLowPassFilter001Sound,
    compoundWLowPassFilter002Sound,
    compoundWLowPassFilter003Sound,
    compoundWLowPassFilter004Sound,
    compoundWLowPassFilter005Sound,
    compoundWLowPassFilter006Sound,
    compoundWLowPassFilter007Sound,
    compoundWLowPassFilter008Sound,
    compoundWLowPassFilter009Sound
  ];

  class SoluteSelectionSoundGenerator extends MultiClip {

    /**
     * @param {Property.<Solute>} soluteProperty
     * @param {Solute[]} solutes - a list of the values that soluteProperty can take on
     * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
     * @param {Object} [options]
     */
    constructor( soluteProperty, solutes, resetInProgressProperty, options ) {

      // the number of solutes needs to match the number of available sounds
      assert && assert( solutes.length === selectionSounds.length, 'the number of solutes must match the number of selection sounds' );

      // map the solutes to the sounds
      const soluteToSoundInfoMap = new Map();
      solutes.forEach( ( solute, index ) => {
        soluteToSoundInfoMap.set( solute, selectionSounds[ index ] );
      } );
      super( soluteToSoundInfoMap, options );

      // play a sound when the solute change unless a reset is in progress
      soluteProperty.lazyLink( solute => {

        if ( !resetInProgressProperty.value ) {
          this.playAssociatedSound( solute );
        }
      } );
    }
  }

  return molarity.register( 'SoluteSelectionSoundGenerator', SoluteSelectionSoundGenerator );
} );