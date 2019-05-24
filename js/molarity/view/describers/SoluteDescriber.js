// Copyright 2019, University of Colorado Boulder

/**
 * SoluteDescriber is responsible for generating descriptions about the solute Property.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;

  class SoluteDescriber {

    /**
     * @param {Property.<Solute>} soluteProperty - from Solution model element.
     */
    constructor( soluteProperty ) {

      // @private
      this.soluteProperty = soluteProperty;
    }

    /**
     * Gets the name of the current solute selected.
     * @public
     * @returns {string}
     */
    getCurrentSolute() {
      const soluteName = this.soluteProperty.value.name;
      return soluteName.charAt( 1 ).toLowerCase() + soluteName.slice( 2 );
    }

    /**
     * Gets the saturated concentration level for the currently selected solute.
     * @public
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the chemical formula of the currently selected solute.
     * @public
     * @returns {string}
     */
    getCurrentChemicalFormula() {
      return this.soluteProperty.value.formula;
    }

    /**
     * Describes the new solute when a user changes the solute in the combo box.
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.getCurrentSolute(),
        maxConcentration: StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( this.getCurrentSaturatedConcentration() > 5.0 ? 5.0 : this.getCurrentSaturatedConcentration(),
            MConstants.CONCENTRATION_DECIMAL_PLACES )
        } )
      } );
    }
  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );