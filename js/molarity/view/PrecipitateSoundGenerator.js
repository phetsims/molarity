// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate the amount of precipitate and changes thereto
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BinMapper = require( 'TAMBO/BinMapper' );
  const molarity = require( 'MOLARITY/molarity' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const InvertedBooleanProperty = require( 'TAMBO/InvertedBooleanProperty' );
  const Range = require( 'DOT/Range' );

  // sounds
  const precipitateSound = require( 'sound!MOLARITY/precipitate.mp3' );

  // constants
  const ONE_OCTAVE_NOTE_MULTIPLIERS = [ 1, 1.122, 1.260, 1.414, 1.587, 1.782 ]; // whole tone scale
  const NUM_OCTAVES = 2;
  const NOTE_SPAN = 4; // span of notes to choose from for a given precipitate level
  const NUM_BINS = 20;

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
     * @param {Property.<boolean>} alwaysPlayOnChangesProperty - play on any change to the solute or solution amounts
     * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
     * supports keyboard interaction, has precedence over alwaysPlayOnChanges
     * @param {Object} [options]
     */
    constructor( precipitateAmountProperty,
                 alwaysPlayOnChangesProperty,
                 resetInProgressProperty,
                 options ) {

      super( precipitateSound, _.extend( options, {
        initialOutputLevel: 0.5,
        rateChangesAffectPlayingSounds: false,
        enableControlProperties: [
          new InvertedBooleanProperty( resetInProgressProperty )
        ]
      } ) );

      // @private {number} - keeps track of previous played sound so that we never play it twice in a row
      this.previousMultiplierIndex = -1;

      // create a "bin mapper" to map the precipitate amount into a fixed set of bins
      const precipitateAmountBinMapper = new BinMapper( new Range( 0, 1 ), NUM_BINS );

      // monitor the precipitate level and play sounds as it changes
      precipitateAmountProperty.lazyLink( ( precipitateAmount, previousPrecipitateAmount ) => {

        // Check if a sound should be played regardless of the change amount, generally because of changes made through
        // keyboard interaction.
        if ( alwaysPlayOnChangesProperty.value ) {

          // for fine changes, play one sound, for larger ones, play two
          const changeAmount = Math.abs( previousPrecipitateAmount - precipitateAmount );
          this.playPrecipitateSound( precipitateAmount );
          if ( changeAmount > 0.04 ) {
            this.playPrecipitateSound( precipitateAmount, 0.1 );
          }
        }
        else {

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
        multiplierIndex = lowestIndex + Math.floor( phet.joist.random.nextDouble() * NOTE_SPAN );
      } while ( multiplierIndex === this.previousMultiplierIndex );

      // set the playback rate and play the sound
      this.setPlaybackRate( FREQUENCY_MULTIPLIERS[ multiplierIndex ] );
      this.play();
      this.previousMultiplierIndex = multiplierIndex;
    }
  }

  return molarity.register( 'PrecipitateSoundGenerator', PrecipitateSoundGenerator );
} );