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
     * @param {MolarityModel} model
     */
    constructor( model ) {

      // @private
      this.model = model;
      this.solution = model.solution;
      this.solutionDescriber = SolutionDescriber.getDescriber();

      // adds an alert when the solute is changed
      this.solution.soluteProperty.lazyLink( () => {
        const utterance = this.solutionDescriber.getSoluteChangedAlertString();
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'stateOfSim' } ) );
      } );

      // alert read out when volume property changes
      this.solution.volumeProperty.lazyLink( ( newVolume, oldVolume, ) => {
        const utterance = this.solutionDescriber.getVolumeAlertString( newVolume > oldVolume );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'volumeSliderMoved' } ) );
      } );

      // alert read out when solute amount property changes
      this.solution.soluteAmountProperty.lazyLink( ( newAmount, oldAmount, ) => {
        const utterance = this.solutionDescriber.getSoluteAmountAlertString( newAmount > oldAmount );
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'soluteAmountSliderMoved' } ) );
      } );
    }

    /**
     * Uses the singleton pattern to keep one instance of this alertManager for the entire lifetime of the sim.
     * @returns {MolarityAlertManager}
     */
    static getAlertManager() {
      assert && assert( alertManager, 'alertManager has not yet been initialized' );
      return alertManager;
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