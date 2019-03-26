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
  const SolutionDescriber = require( 'MOLARITY/molarity/view/describers/SolutionDescriber' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // initialize the alertManager to support the singleton pattern -- see this.initialize
  let alertManager = null;

  class MolarityAlertManager {

    /**
     * @param {Solution} solution from the Molarity Model
     */
    constructor( solution ) {

      // @private
      const solutionDescriber = SolutionDescriber.getDescriber();

      // adds an alert when the solute is changed
      solution.soluteProperty.lazyLink( () => {
        const utterance = solutionDescriber.getSoluteChangedAlertString();
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'stateOfSim' } ) );
      } );

      // alert read out when volume property changes
      solution.volumeProperty.lazyLink( ( newVolume, oldVolume, ) => {
        const utterance = solutionDescriber.getSliderAlertString( newVolume > oldVolume, true );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'volumeSliderMoved' } ) );
      } );

      // alert read out when solute amount property changes
      solution.soluteAmountProperty.lazyLink( ( newAmount, oldAmount, ) => {
        const utterance = solutionDescriber.getSliderAlertString( newAmount > oldAmount, false );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'soluteAmountSliderMoved' } ) );
      } );
    }

    /**
     * Initialize the describer singleton
     * @param {MolarityModel} model
     * @returns {MolarityAlertManager} - for chaining
     */
    static initialize( model ) {
      alertManager = new MolarityAlertManager( model );
      return alertManager;
    }
  }

  molarity.register( 'MolarityAlertManager', MolarityAlertManager );

  return MolarityAlertManager;
} );