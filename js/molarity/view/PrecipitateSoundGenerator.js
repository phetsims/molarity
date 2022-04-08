// Copyright 2019-2022, University of Colorado Boulder

/**
 * sound generator used to indicate the amount of precipitate and changes thereto
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import BinMapper from '../../../../tambo/js/BinMapper.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import precipitate_mp3 from '../../../sounds/precipitate_mp3.js';
import molarity from '../../molarity.js';

// constants
const ONE_OCTAVE_NOTE_MULTIPLIERS = [ 1, 1.122, 1.260, 1.414, 1.587, 1.782 ]; // whole tone scale
const NUM_OCTAVES = 2;
const NOTE_SPAN = 4; // span of notes to choose from for a given precipitate level
const NUM_BINS = 50;

// create an array with several octaves of frequency multipliers to use for generating variations of the base sound
const FREQUENCY_MULTIPLIERS = [];
_.times( NUM_OCTAVES, outerIndex => {
  const scale = Math.pow( 2, ( 1 - NUM_OCTAVES ) / 2 + outerIndex );
  ONE_OCTAVE_NOTE_MULTIPLIERS.forEach( multiplier => {
    FREQUENCY_MULTIPLIERS.push( multiplier * scale );
  } );
} );

class PrecipitateSoundGenerator extends SoundClip {

  /**
   * @param {Property.<number>} precipitateAmountProperty
   * @param {VerticalSlider} soluteAmountSlider - slider that controls the amount of solute
   * @param {VerticalSlider} solutionVolumeSlider - slider that controls the volume of the solution
   * @param {Object} [options]
   */
  constructor( precipitateAmountProperty, soluteAmountSlider, solutionVolumeSlider, options ) {

    super( precipitate_mp3, merge( {
      initialOutputLevel: 0.5,
      rateChangesAffectPlayingSounds: false
    }, options ) );

    // @private {number} - keeps track of previous played sound so that we never play it twice in a row
    this.previousMultiplierIndex = -1;

    // create a "bin mapper" to map the precipitate amount into a fixed set of bins
    const precipitateAmountBinMapper = new BinMapper( new Range( 0, 1 ), NUM_BINS );

    // monitor the precipitate level and play sounds as it changes
    precipitateAmountProperty.lazyLink( ( precipitateAmount, previousPrecipitateAmount ) => {

      // if the change was due to an pdom-caused event, a sound should be played on every change
      const changeDueToA11yAction = soluteAmountSlider.draggingPointerType === 'pdom' ||
                                    solutionVolumeSlider.draggingPointerType === 'pdom';

      // Check if a sound should be played regardless of the change amount, generally because of changes made through
      // keyboard interaction.
      if ( changeDueToA11yAction ) {

        // for fine changes, play one sound, for larger ones, play two
        const changeAmount = Math.abs( previousPrecipitateAmount - precipitateAmount );
        this.playPrecipitateSound( precipitateAmount );
        if ( changeAmount > 0.04 ) {
          this.playPrecipitateSound( precipitateAmount, 0.1 );
        }
      }

      // Otherwise only play if the change was initiated by the user changing the solute amount or solution volume
      else if ( soluteAmountSlider.draggingPointerType !== null ||
                solutionVolumeSlider.draggingPointerType !== null ) {

        // otherwise only play if the bin changed or we hit are un-hit one of the rails
        const oldBin = precipitateAmountBinMapper.mapToBin( previousPrecipitateAmount );
        const newBin = precipitateAmountBinMapper.mapToBin( precipitateAmount );
        if ( newBin !== oldBin ||
             precipitateAmount > 0 && previousPrecipitateAmount === 0 ||
             precipitateAmount === 0 && previousPrecipitateAmount > 0 ) {
          this.playPrecipitateSound( precipitateAmount );
        }
      }
    } );
  }

  /**
   * play the precipitate sound based on the provided precipitate amount
   * @private
   */
  playPrecipitateSound( precipitateAmount ) {
    const lowestIndex = Math.floor( ( 1 - precipitateAmount ) * ( FREQUENCY_MULTIPLIERS.length - NOTE_SPAN ) );

    // choose the note index, but make sure it's not the same as the last one
    let multiplierIndex;
    do {
      multiplierIndex = lowestIndex + Math.floor( dotRandom.nextDouble() * NOTE_SPAN );
    } while ( multiplierIndex === this.previousMultiplierIndex );

    // set the playback rate and play the sound
    this.setPlaybackRate( FREQUENCY_MULTIPLIERS[ multiplierIndex ] );
    this.play();
    this.previousMultiplierIndex = multiplierIndex;
  }
}

molarity.register( 'PrecipitateSoundGenerator', PrecipitateSoundGenerator );
export default PrecipitateSoundGenerator;