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
  const soluteChangedSaturatedAlertPatternString = MolarityA11yStrings.soluteChangedSaturatedAlertPattern.value;
  const soluteChangedUnsaturatedAlertPatternString = MolarityA11yStrings.soluteChangedUnsaturatedAlertPattern.value;

  class SoluteDescriber {

    /**
     * @param {Property.<Solute>} solution.soluteProperty - from Solution model element.
     */
    constructor( solution, concentrationDescriber ) {

      // @private
      this.solution = solution;
      this.concentrationDescriber = concentrationDescriber;
    }

    /**
     * Gets the name of the current solute selected.
     * @public
     * @param {boolean} isCapitalized
     * @returns {string}
     */
    getCurrentSolute( isCapitalized = false ) {
      const soluteName = this.solution.soluteProperty.value.name;
      if ( isCapitalized ) {
        return soluteName;
      }
      else {
        return soluteName.charAt( 1 ).toLowerCase() + soluteName.slice( 2 );
      }
    }

    /**
     * Gets the saturated concentration level for the currently selected solute.
     * @public
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.solution.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the chemical formula of the currently selected solute.
     * @public
     * @returns {string}
     */
    getCurrentChemicalFormula() {
      return this.solution.soluteProperty.value.formula;
    }

    /**
     * Describes the new solute and any change in saturation when a user changes the solute in the combo box.
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString() {

      // If a solute change causes a change in saturation, special alerts are read out.
      if ( this.concentrationDescriber.saturationStateChanged ) {
        return this.solution.isSaturated() ?
               StringUtils.fillIn( soluteChangedSaturatedAlertPatternString, {
                 solids: this.concentrationDescriber.getCurrentSolidsAmount()
               } ) :
               StringUtils.fillIn( soluteChangedUnsaturatedAlertPatternString, {
                 concentration: this.concentrationDescriber.getCurrentConcentration()
               } );
      }
      return StringUtils.fillIn( soluteChangedAlertPatternString, {
        solute: this.getCurrentSolute( true ),
        maxConcentration: StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( this.getCurrentSaturatedConcentration() > 5.0 ? 5.0 : this.getCurrentSaturatedConcentration(),
            MConstants.CONCENTRATION_DECIMAL_PLACES )
        } )
      } );
    }
  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );