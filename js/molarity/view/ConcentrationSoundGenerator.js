// Copyright 2019-2022, University of Colorado Boulder

/**
 * sound generator used to indicate the concentration level, but triggered by changes in solution volume or solute amount
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BinMapper from '../../../../tambo/js/BinMapper.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import brightMarimba_mp3 from '../../../../tambo/sounds/brightMarimba_mp3.js';
import softNoSolute_v2_mp3 from '../../../sounds/softNoSolute_v2_mp3.js';
import molarity from '../../molarity.js';
import MolarityConstants from '../MolarityConstants.js';

// constants
const NUM_SOLUTE_BINS = 13; // empirically determined to produce sounds as frequently as needed but not TOO frequently
const NUM_VOLUME_BINS = 10; // empirically determined to produce sounds as frequently as needed but not TOO frequently
const ZERO_CONCENTRATION_PLAYBACK_RATE = 2; // about 2 octaves above the nominal pitch, empirically determined

class ConcentrationSoundGenerator extends SoundGenerator {

  /**
   * @param {MacroSolution} solution - model of the solution
   * @param {VerticalSlider} soluteAmountSlider - slider that controls the amount of solute
   * @param {VerticalSlider} solutionVolumeSlider - slider that controls the volume of the solution
   * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
   * @param {Object} [options]
   */
  constructor( solution, soluteAmountSlider, solutionVolumeSlider, resetInProgressProperty, options ) {
    super( options );

    // sound clip that is played when the concentration is above zero (pitch is varied as a function of concentration)
    const nonZeroConcentrationSoundClip = new SoundClip( brightMarimba_mp3, { rateChangesAffectPlayingSounds: false } );
    nonZeroConcentrationSoundClip.connect( this.soundSourceDestination );

    // sound clip that is played when the solute amount transitions to zero
    const transitionToZeroConcentrationSoundClip = new SoundClip( brightMarimba_mp3, {
      initialOutputLevel: 1.5, // higher than nominal, seems to work to make it more pronounced
      initialPlaybackRate: ZERO_CONCENTRATION_PLAYBACK_RATE
    } );
    transitionToZeroConcentrationSoundClip.connect( this.soundSourceDestination );

    // sound clip that is played when the solution level is changed when the concentration is zero
    const atZeroConcentrationSoundClip = new SoundClip( softNoSolute_v2_mp3, { initialOutputLevel: 0.6 } );
    atZeroConcentrationSoundClip.connect( this.soundSourceDestination );

    // keep track of the concentration value each time sound is played
    let concentrationAtLastSoundProduction = solution.concentrationProperty.value;

    // closure for playing the appropriate concentration sound
    const playConcentrationSound = () => {
      const concentration = solution.concentrationProperty.value;
      const normalizedConcentration = concentration / MolarityConstants.CONCENTRATION_RANGE.max;
      if ( normalizedConcentration > 0 ) {
        nonZeroConcentrationSoundClip.setPlaybackRate( 1.5 - normalizedConcentration );
        nonZeroConcentrationSoundClip.play();
      }
      else if ( concentrationAtLastSoundProduction > 0 ) {

        // the concentration value has transitioned to zero, so play the sound at a pitch meant to convey emptiness
        transitionToZeroConcentrationSoundClip.play();
      }
      else {

        // the user is changing the volume of the solution with no solute in it, play the sound for this specific case
        atZeroConcentrationSoundClip.play();
      }
      concentrationAtLastSoundProduction = concentration;
    };

    // trigger playing of the concentration sound as the solute amount changes
    const soluteAmountBinMapper = new BinMapper( MolarityConstants.SOLUTE_AMOUNT_RANGE, NUM_SOLUTE_BINS );
    solution.soluteAmountProperty.lazyLink( ( soluteAmount, previousSoluteAmount ) => {

      // don't play if saturated - other sounds are used in that case
      if ( !solution.precipitateAmountProperty.value > 0 ) {

        // determine if the sound was caused by an a11y-related action, such as keyboard manipulation
        const changeDueToA11yAction = soluteAmountSlider.draggingPointerType === 'pdom' ||
                                      solutionVolumeSlider.draggingPointerType === 'pdom';

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
        const changeDueToA11yAction = soluteAmountSlider.draggingPointerType === 'pdom' ||
                                      solutionVolumeSlider.draggingPointerType === 'pdom';

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

molarity.register( 'ConcentrationSoundGenerator', ConcentrationSoundGenerator );
export default ConcentrationSoundGenerator;