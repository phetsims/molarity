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
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const cobaltChlorideString = require( 'string!MOLARITY/cobaltChloride' );
  const cobaltIINitrateString = require( 'string!MOLARITY/cobaltIINitrate' );
  const copperSulfateString = require( 'string!MOLARITY/copperSulfate' );
  const drinkMixString = require( 'string!MOLARITY/drinkMix' );
  const goldIIIChlorideString = require( 'string!MOLARITY/goldIIIChloride' );
  const nickelIIChlorideString = require( 'string!MOLARITY/nickelIIChloride' );
  const potassiumChromateString = require( 'string!MOLARITY/potassiumChromate' );
  const potassiumDichromateString = require( 'string!MOLARITY/potassiumDichromate' );
  const potassiumPermanganateString = require( 'string!MOLARITY/potassiumPermanganate' );

  // a11y strings
  const beakerChemicalFormulaPatternString = MolarityA11yStrings.beakerChemicalFormulaPattern.value;
  const soluteChangedAlertPatternString = MolarityA11yStrings.soluteChangedAlertPattern.value;
  const soluteChangedSaturatedAlertPatternString = MolarityA11yStrings.soluteChangedSaturatedAlertPattern.value;
  const soluteChangedUnsaturatedAlertPatternString = MolarityA11yStrings.soluteChangedUnsaturatedAlertPattern.value;

  // color strings
  const redString = MolarityA11yStrings.red.value;
  const pinkString = MolarityA11yStrings.pink.value;
  const orangeString = MolarityA11yStrings.orange.value;
  const goldString = MolarityA11yStrings.gold.value;
  const yellowString = MolarityA11yStrings.yellow.value;
  const greenString = MolarityA11yStrings.green.value;
  const blueString = MolarityA11yStrings.blue.value;
  const purpleString = MolarityA11yStrings.purple.value;
  const clearString = MolarityA11yStrings.clear.value;

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
     * Gets the chemical formula of the currently selected solute.
     * @public
     * @returns {string} - e.g. 'chemical formula of potassium permanganate is KMnO4.'
     */
    getBeakerChemicalFormulaString() {
      assert && assert( this.getCurrentSolute( true ) !== drinkMixString,
        'attempted to generate chemical formula string for drink mix, which has no chemical formula' );
      return StringUtils.fillIn( beakerChemicalFormulaPatternString, {
        chemicalFormula: this.solution.soluteProperty.value.formula,
        solute: this.getCurrentSolute()
      } );
    }

    /**
     * //TODO: make static with parameter
     * Gets the color of the solution.
     * @public
     * @returns {string}
     */
    getCurrentColor() {
      const currentSolute = this.getCurrentSolute( true );

      if ( this.concentrationDescriber.isNoSolute() ) {
        return clearString;
      }
      switch( currentSolute ) {
        case drinkMixString:
          return redString;
        case cobaltIINitrateString:
          return redString;
        case cobaltChlorideString:
          return pinkString;
        case potassiumDichromateString:
          return orangeString;
        case goldIIIChlorideString:
          return goldString;
        case potassiumChromateString:
          return yellowString;
        case nickelIIChlorideString:
          return greenString;
        case copperSulfateString:
          return blueString;
        case potassiumPermanganateString:
          return purpleString;
        default:
          return '';
      }
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
        concentrationRange: this.concentrationDescriber.getCurrentConcentrationRange()
      } );
    }
  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );