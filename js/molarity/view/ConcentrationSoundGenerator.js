// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate the concentration level, but triggered by changes in solution volume or solute amount
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
  const MConstants = require( 'MOLARITY/molarity/MConstants' );

  // sounds
  const marimbaSound = require( 'sound!TAMBO/bright-marimba.mp3' );

  // constants
  const NUM_SOLUTE_BINS = 13; // empirically determined to produce sounds as frequently as needed but not TOO frequently
  const NUM_VOLUME_BINS = 10; // empirically determined to produce sounds as frequently as needed but not TOO frequently
  const ZERO_CONCENTRATION_PITCH_RATE = 0.33; // about 2.5 octaves below the nominal pitch, empirically determined

  class ConcentrationSoundGenerator extends SoundClip {

    /**
     * @param {Solution} solution - model of the solution
     * @param {Property.<boolean>} alwaysPlayOnChangesProperty - play on any change to the solute or solution amounts,
     * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
     * supports keyboard interaction
     * @param {Object} [options]
     */
    constructor( solution, alwaysPlayOnChangesProperty, resetInProgressProperty, options ) {
      super( marimbaSound, _.extend( options, {
        initialOutputLevel: 0.5,
        rateChangesAffectPlayingSounds: false,
        enableControlProperties: [ new InvertedBooleanProperty( resetInProgressProperty ) ]
      } ) );

      // @private
      this.concentrationProperty = solution.concentrationProperty;

      // trigger playing of the concentration sound as the solute amount changes
      const soluteAmountBinMapper = new BinMapper( MConstants.SOLUTE_AMOUNT_RANGE, NUM_SOLUTE_BINS );
      solution.soluteAmountProperty.lazyLink( ( soluteAmount, previousSoluteAmount ) => {
        const previousBin = soluteAmountBinMapper.mapToBin( previousSoluteAmount );
        const currentBin = soluteAmountBinMapper.mapToBin( soluteAmount );
        if ( previousBin !== currentBin || alwaysPlayOnChangesProperty.value ) {
          this.playConcentrationSound();
        }
      } );

      // trigger playing of the concentration sound as the solution volume changes
      const volumeBinMapper = new BinMapper( MConstants.SOLUTION_VOLUME_RANGE, NUM_VOLUME_BINS );
      solution.volumeProperty.lazyLink( ( volume, previousVolume ) => {
        const previousBin = volumeBinMapper.mapToBin( previousVolume );
        const currentBin = volumeBinMapper.mapToBin( volume );
        if ( solution.concentrationProperty.value > 0 &&
             ( previousBin !== currentBin ||
               volume === MConstants.SOLUTION_VOLUME_RANGE.max ||
               volume === MConstants.SOLUTION_VOLUME_RANGE.min ||
               alwaysPlayOnChangesProperty.value ) ) {
          this.playConcentrationSound();
        }
      } );

      // trigger playing of the concentration sound at the min and max values
      solution.concentrationProperty.lazyLink( concentration => {
        if ( concentration === MConstants.CONCENTRATION_RANGE.min ||
             concentration === MConstants.CONCENTRATION_RANGE.max ) {
          this.playConcentrationSound();
        }
      } );
    }

    /**
     * play a discrete sound with pitch adjusted to indicate the concentration level
     * @private
     */
    playConcentrationSound() {
      const concentration = this.concentrationProperty.value;
      if ( concentration > 0 ) {
        this.setPlaybackRate( 0.5 + this.concentrationProperty.value / MConstants.CONCENTRATION_RANGE.max );
      }
      else {
        this.setPlaybackRate( ZERO_CONCENTRATION_PITCH_RATE );
      }
      this.play();
    }
  }

  return molarity.register( 'ConcentrationSoundGenerator', ConcentrationSoundGenerator );
} );
