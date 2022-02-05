// Copyright 2019-2022, University of Colorado Boulder

/**
 * sound generator used to indicate changes to the selected solute
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import MultiClip from '../../../../tambo/js/sound-generators/MultiClip.js';
import selectionArpeggio001_mp3 from '../../../../tambo/sounds/selectionArpeggio001_mp3.js';
import selectionArpeggio002_mp3 from '../../../../tambo/sounds/selectionArpeggio002_mp3.js';
import selectionArpeggio003_mp3 from '../../../../tambo/sounds/selectionArpeggio003_mp3.js';
import selectionArpeggio004_mp3 from '../../../../tambo/sounds/selectionArpeggio004_mp3.js';
import selectionArpeggio005_mp3 from '../../../../tambo/sounds/selectionArpeggio005_mp3.js';
import selectionArpeggio006_mp3 from '../../../../tambo/sounds/selectionArpeggio006_mp3.js';
import selectionArpeggio007_mp3 from '../../../../tambo/sounds/selectionArpeggio007_mp3.js';
import selectionArpeggio008_mp3 from '../../../../tambo/sounds/selectionArpeggio008_mp3.js';
import selectionArpeggio009_mp3 from '../../../../tambo/sounds/selectionArpeggio009_mp3.js';
import molarity from '../../molarity.js';

// sounds
const selectionSounds = [
  selectionArpeggio001_mp3,
  selectionArpeggio002_mp3,
  selectionArpeggio003_mp3,
  selectionArpeggio004_mp3,
  selectionArpeggio005_mp3,
  selectionArpeggio006_mp3,
  selectionArpeggio007_mp3,
  selectionArpeggio008_mp3,
  selectionArpeggio009_mp3
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
    const soluteToSoundMap = new Map();
    solutes.forEach( ( solute, index ) => {
      soluteToSoundMap.set( solute, selectionSounds[ index ] );
    } );
    super( soluteToSoundMap, options );

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