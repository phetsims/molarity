// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate changes to the selected solute
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import MultiClip from '../../../../tambo/js/sound-generators/MultiClip.js';
import compoundWLowPassFilter001Sound from '../../../sounds/compound-w-low-pass-filter-001_mp3.js';
import compoundWLowPassFilter002Sound from '../../../sounds/compound-w-low-pass-filter-002_mp3.js';
import compoundWLowPassFilter003Sound from '../../../sounds/compound-w-low-pass-filter-003_mp3.js';
import compoundWLowPassFilter004Sound from '../../../sounds/compound-w-low-pass-filter-004_mp3.js';
import compoundWLowPassFilter005Sound from '../../../sounds/compound-w-low-pass-filter-005_mp3.js';
import compoundWLowPassFilter006Sound from '../../../sounds/compound-w-low-pass-filter-006_mp3.js';
import compoundWLowPassFilter007Sound from '../../../sounds/compound-w-low-pass-filter-007_mp3.js';
import compoundWLowPassFilter008Sound from '../../../sounds/compound-w-low-pass-filter-008_mp3.js';
import compoundWLowPassFilter009Sound from '../../../sounds/compound-w-low-pass-filter-009_mp3.js';
import molarity from '../../molarity.js';

// sounds

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

molarity.register( 'SoluteSelectionSoundGenerator', SoluteSelectionSoundGenerator );
export default SoluteSelectionSoundGenerator;