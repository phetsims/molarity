// Copyright 2019, University of Colorado Boulder

/**
 * MolarityAlertManager is responsible for generating strings about ConcentrationProperty. Also includes alert text
 * for alerts past saturation point, including descriptions about the amount of solids (precipitate) in the beaker.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ActivationUtterance = require( 'SCENERY_PHET/accessibility/ActivationUtterance' );
  const molarity = require( 'MOLARITY/molarity' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );

  class MolarityAlertManager {
    constructor() {

      // create utterances
      this.saturationUtterance = new Utterance();
      this.sliderUtterance = new ActivationUtterance( { alertMaximumDelay: 1000 } );
      this.soluteUtterance = new ActivationUtterance();
      this.valuesVisibleUtterance = new ActivationUtterance();
    }

    /**
     * Responsible for adding the alerts associated with both sliders to the utteranceQueue. Includes alerts for
     * concentration increasing or decreasing, solute amount being zero, and saturation state changing.
     * @public
     */
    alertSlider( alertText ) {
      this.sliderUtterance.alert = alertText;
      utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Responsible for adding the alerts associated saturation state changing.
     * @public
     */
    alertSaturation( alertText ) {
      this.saturationUtterance.alert = alertText;
      utteranceQueue.addToBack( this.saturationUtterance );
    }

    /**
     * Responsible for adding the alert associated with a change in solute to the utteranceQueue.
     * @public
     */
    alertSolute( alertText ) {
      this.soluteUtterance.alert = alertText;
      utteranceQueue.addToBack( this.soluteUtterance );
    }

    /**
     * Responsible for adding the alert associated with a change in the "show values" checkbox.
     * @public
     */
    alertValuesVisible( alertText ) {
      this.valuesVisibleUtterance.alert = alertText;
      utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }
  }

  return molarity.register( 'MolarityAlertManager', MolarityAlertManager );
} );