// Copyright 2019, University of Colorado Boulder

/**
 * SoluteDescriber is responsible for creating strings about SoluteProperty that are used for PDOM content and alerts.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;

  class SoluteDescriber {
    /**
     * @param {SoluteProperty} soluteProperty from MolarityModel
     * @param {BooleanProperty} valuesVisibleProperty - tracks whether the "Show values" checkbox is checked
     */
    constructor( soluteProperty, valuesVisibleProperty ) {

      // @private
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;
    }

    /**
     * gets the name of the current solute selected
     * @public
     * @returns { string } name of current solute
     */
    getCurrentSolute() {
      return this.soluteProperty.value.name;
    }

    /**
     * gets the saturated concentration amount of the currently selected solute.
     * @public
     * @returns { string }
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * gets the chemical formula of the currently selected solute.
     * @private
     * @returns { string }
     */
    getCurrentChemicalFormula() {
      return this.soluteProperty.value.formula;
    }

    /**
     * Describes the new solute when a user changes the solute in the combo box
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.getCurrentSolute(),
        maxConcentration: this.getCurrentSaturatedConcentration()
      } );
    }

  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );