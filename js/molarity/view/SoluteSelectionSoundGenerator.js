// Copyright 2019-2020, University of Colorado Boulder

/**
 * sound generator used to indicate changes to the selected solute
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import MultiClip from '../../../../tambo/js/sound-generators/MultiClip.js';
import soluteSelection001Sound from '../../../../tambo/sounds/selection-arpeggio-001_mp3.js';
import soluteSelection002Sound from '../../../../tambo/sounds/selection-arpeggio-002_mp3.js';
import soluteSelection003Sound from '../../../../tambo/sounds/selection-arpeggio-003_mp3.js';
import soluteSelection004Sound from '../../../../tambo/sounds/selection-arpeggio-004_mp3.js';
import soluteSelection005Sound from '../../../../tambo/sounds/selection-arpeggio-005_mp3.js';
import soluteSelection006Sound from '../../../../tambo/sounds/selection-arpeggio-006_mp3.js';
import soluteSelection007Sound from '../../../../tambo/sounds/selection-arpeggio-007_mp3.js';
import soluteSelection008Sound from '../../../../tambo/sounds/selection-arpeggio-008_mp3.js';
import soluteSelection009Sound from '../../../../tambo/sounds/selection-arpeggio-009_mp3.js';
import molarity from '../../molarity.js';

// sounds
const selectionSounds = [
  soluteSelection001Sound,
  soluteSelection002Sound,
  soluteSelection003Sound,
  soluteSelection004Sound,
  soluteSelection005Sound,
  soluteSelection006Sound,
  soluteSelection007Sound,
  soluteSelection008Sound,
  soluteSelection009Sound
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