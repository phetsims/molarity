// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate the concentration level, but triggered by changes in solution volume or solute amount
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BinMapper = require( 'TAMBO/BinMapper' );
  const molarity = require( 'MOLARITY/molarity' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );
  const MolarityConstants = require( 'MOLARITY/molarity/MolarityConstants' );

  // sounds
  const marimbaSound = require( 'sound!TAMBO/bright-marimba.mp3' );
  const softLowMarimbaSound = require( 'sound!MOLARITY/no-solute-solution-volume-bonk.mp3' );

  // constants
  const NUM_SOLUTE_BINS = 13; // empirically determined to produce sounds as frequently as needed but not TOO frequently
  const NUM_VOLUME_BINS = 10; // empirically determined to produce sounds as frequently as needed but not TOO frequently
  const ZERO_CONCENTRATION_PITCH_RATE = 0.33; // about 2.5 octaves below the nominal pitch, empirically determined

  class ConcentrationSoundGenerator extends SoundGenerator {

    /**
     * @param {Solution} solution - model of the solution
     * @param {VerticalSlider} soluteAmountSlider - slider that controls the amount of solute
     * @param {VerticalSlider} solutionVolumeSlider - slider that controls the volume of the solution
     * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
     * @param {Object} [options]
     */
    constructor( solution, soluteAmountSlider, solutionVolumeSlider, resetInProgressProperty, options ) {
      super( options );

      // create and hook up the sound clips
      const nonZeroConcentrationSoundClip = new SoundClip( marimbaSound, { rateChangesAffectPlayingSounds: false } );
      nonZeroConcentrationSoundClip.connect( this.masterGainNode );
      const zeroConcentrationSoundClip = new SoundClip( softLowMarimbaSound );
      zeroConcentrationSoundClip.connect( this.masterGainNode );

      // keep track of the concentration value each time sound is played
      let concentrationAtLastSoundProduction = solution.concentrationProperty.value;

      // closure for playing the appropriate concentration sound
      const playConcentrationSound = () => {
        const concentration = solution.concentrationProperty.value;
        if ( concentration > 0 ) {
          nonZeroConcentrationSoundClip.setPlaybackRate( 0.5 + concentration / MolarityConstants.CONCENTRATION_RANGE.max );
          nonZeroConcentrationSoundClip.play();
        }
        else if ( concentrationAtLastSoundProduction > 0 ) {

          // the concentration value has transitioned to zero, so play the long version of the low bonk sound
          nonZeroConcentrationSoundClip.setPlaybackRate( ZERO_CONCENTRATION_PITCH_RATE );
          nonZeroConcentrationSoundClip.play();
        }
        else {

          // the user is changing the volume of the solution with no solute in it, play the sound for this specific case
          zeroConcentrationSoundClip.play();
        }
        concentrationAtLastSoundProduction = concentration;
      };

      // trigger playing of the concentration sound as the solute amount changes
      const soluteAmountBinMapper = new BinMapper( MolarityConstants.SOLUTE_AMOUNT_RANGE, NUM_SOLUTE_BINS );
      solution.soluteAmountProperty.lazyLink( ( soluteAmount, previousSoluteAmount ) => {

        // don't play if saturated - other sounds are used in that case
        if ( !solution.precipitateAmountProperty.value > 0 ) {

          // determine if the sound was caused by an a11y-related action, such as kayboard manipulation
          const changeDueToA11yAction = soluteAmountSlider.draggingPointerType === 'a11y' ||
                                        solutionVolumeSlider.draggingPointerType === 'a11y';

          // map the solute amount value to bins
          const previousBin = soluteAmountBinMapper.mapToBin( previousSoluteAmount );
          const currentBin = soluteAmountBinMapper.mapToBin( soluteAmount );

          // play the sound if appropriate
          if ( !resetInProgressProperty.value &&
               ( changeDueToA11yAction ||
                 previousBin !== currentBin ||
                 soluteAmount === MolarityConstants.SOLUTE_AMOUNT_RANGE.max ||
                 soluteAmount === MolarityConstants.SOLUTE_AMOUNT_RANGE.min ) ) {

            playConcentrationSound();
          }
        }
      } );

      // trigger playing of the concentration sound as the solution volume changes
      const volumeBinMapper = new BinMapper( MolarityConstants.SOLUTION_VOLUME_RANGE, NUM_VOLUME_BINS );
      solution.volumeProperty.lazyLink( ( volume, previousVolume ) => {

        // don't play if saturated - other sounds are used in that case
        if ( !solution.precipitateAmountProperty.value > 0 ) {

          // determine if the sound was caused by an a11y-related action, such as kayboard manipulation
          const changeDueToA11yAction = soluteAmountSlider.draggingPointerType === 'a11y' ||
                                        solutionVolumeSlider.draggingPointerType === 'a11y';

          // map the solution volume value to bins
          const previousBin = volumeBinMapper.mapToBin( previousVolume );
          const currentBin = volumeBinMapper.mapToBin( volume );
          if ( !resetInProgressProperty.value &&
               ( changeDueToA11yAction ||
                 previousBin !== currentBin ||
                 volume === MolarityConstants.SOLUTION_VOLUME_RANGE.max ||
                 volume === MolarityConstants.SOLUTION_VOLUME_RANGE.min ) ) {

            playConcentrationSound();
          }
        }
      } );
    }
  }

  return molarity.register( 'ConcentrationSoundGenerator', ConcentrationSoundGenerator );
} );
