// Copyright 2019, University of Colorado Boulder

/**
 * Manager for the alerts that are dynamically emitted in the simulation.
 * Responsible for adding all alerts to the utteranceQueue.
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  class MolarityAlertManager {

    /**
     * @param {Solution} solution - solution from the Molarity Model
     * @param {SolutionDescriber} solutionDescriber
     */
    constructor( solution, solutionDescriber ) {

      // adds an alert when the solute is changed
      solution.soluteProperty.lazyLink( () => {
        const utterance = solutionDescriber.soluteDescriber.getSoluteChangedAlertString();
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'stateOfSim' } ) );
      } );

      // alert read out when volume property changes
      solution.volumeProperty.lazyLink( ( newVolume, oldVolume, ) => {
        const utterance = solutionDescriber.getVolumeSliderAlertString( newVolume > oldVolume );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'volumeSliderMoved' } ) );
      } );

      // alert read out when solute amount property changes
      solution.soluteAmountProperty.lazyLink( ( newAmount, oldAmount, ) => {
        const utterance = solutionDescriber.getSoluteAmountSliderAlertString( newAmount > oldAmount );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'soluteAmountSliderMoved' } ) );
      } );
    }
  }

  molarity.register( 'MolarityAlertManager', MolarityAlertManager );

  return MolarityAlertManager;
} );