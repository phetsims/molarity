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
  const noSoluteAlertQuantitativeString = MolarityA11yStrings.noSoluteAlertQuantitative.value;
  const noSoluteAlertQualitativeString = MolarityA11yStrings.noSoluteAlertQualitative.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const soluteChangedSaturatedAlertPatternString = MolarityA11yStrings.soluteChangedSaturatedAlertPattern.value;
  const soluteChangedUnsaturatedAlertPatternString = MolarityA11yStrings.soluteChangedUnsaturatedAlertPattern.value;
  const soluteChangedQualitativePatternString = MolarityA11yStrings.soluteChangedQualitativePattern.value;

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

  // capitalized color strings
  const redCapitalizedString = MolarityA11yStrings.redCapitalized.value;
  const pinkCapitalizedString = MolarityA11yStrings.pinkCapitalized.value;
  const orangeCapitalizedString = MolarityA11yStrings.orangeCapitalized.value;
  const goldCapitalizedString = MolarityA11yStrings.goldCapitalized.value;
  const yellowCapitalizedString = MolarityA11yStrings.yellowCapitalized.value;
  const greenCapitalizedString = MolarityA11yStrings.greenCapitalized.value;
  const blueCapitalizedString = MolarityA11yStrings.blueCapitalized.value;
  const purpleCapitalizedString = MolarityA11yStrings.purpleCapitalized.value;
  const clearCapitalizedString = MolarityA11yStrings.clearCapitalized.value;

  // Lowercase solute name strings
  const cobaltChlorideLowercaseString = MolarityA11yStrings.cobaltChlorideLowercase.value;
  const cobaltIINitrateLowercaseString = MolarityA11yStrings.cobaltIINitrateLowercase.value;
  const copperSulfateLowercaseString = MolarityA11yStrings.copperSulfateLowercase.value;
  const drinkMixLowercaseString = MolarityA11yStrings.drinkMixLowercase.value;
  const goldIIIChlorideLowercaseString = MolarityA11yStrings.goldIIIChlorideLowercase.value;
  const nickelIIChlorideLowercaseString = MolarityA11yStrings.nickelIIChlorideLowercase.value;
  const potassiumChromateLowercaseString = MolarityA11yStrings.potassiumChromateLowercase.value;
  const potassiumDichromateLowercaseString = MolarityA11yStrings.potassiumDichromateLowercase.value;
  const potassiumPermanganateLowercaseString = MolarityA11yStrings.potassiumPermanganateLowercase.value;

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
        switch( soluteName ) {
          case drinkMixString:
            return drinkMixLowercaseString;
          case cobaltIINitrateString:
            return cobaltIINitrateLowercaseString;
          case cobaltChlorideString:
            return cobaltChlorideLowercaseString;
          case potassiumDichromateString:
            return potassiumDichromateLowercaseString;
          case goldIIIChlorideString:
            return goldIIIChlorideLowercaseString;
          case potassiumChromateString:
            return potassiumChromateLowercaseString;
          case nickelIIChlorideString:
            return nickelIIChlorideLowercaseString;
          case copperSulfateString:
            return copperSulfateLowercaseString;
          case potassiumPermanganateString:
            return potassiumPermanganateLowercaseString;
          default:
            return '';
        }
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
     * Gets the color of the solution.
     * @param {boolean}  isCapitalized
     * @public
     * @returns {string}
     */
    getCurrentColor( isCapitalized = false ) {
      const currentSolute = this.getCurrentSolute( true );

      if ( !this.concentrationDescriber.hasSolute() ) {
        return isCapitalized ? clearCapitalizedString : clearString;
      }
      switch( currentSolute ) {
        case drinkMixString:
          return isCapitalized ? redCapitalizedString : redString;
        case cobaltIINitrateString:
          return isCapitalized ? redCapitalizedString : redString;
        case cobaltChlorideString:
          return isCapitalized ? pinkCapitalizedString : pinkString;
        case potassiumDichromateString:
          return isCapitalized ? orangeCapitalizedString : orangeString;
        case goldIIIChlorideString:
          return isCapitalized ? goldCapitalizedString : goldString;
        case potassiumChromateString:
          return isCapitalized ? yellowCapitalizedString : yellowString;
        case nickelIIChlorideString:
          return isCapitalized ? greenCapitalizedString : greenString;
        case copperSulfateString:
          return isCapitalized ? blueCapitalizedString : blueString;
        case potassiumPermanganateString:
          return isCapitalized ? purpleCapitalizedString : purpleString;
        default:
          return '';
      }
    }

    /**
     * Describes the new solute and any change in saturation when a user changes the solute in the combo box.
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString( useQuantitativeDescriptionsProperty ) {
      let concentrationClause;
      let soluteChangedString;
      if ( !this.concentrationDescriber.hasSolute() ) {
        return useQuantitativeDescriptionsProperty.value ? noSoluteAlertQuantitativeString : noSoluteAlertQualitativeString;
      }
      if ( this.solution.isSaturated() ) {
        soluteChangedString = soluteChangedSaturatedAlertPatternString;
        concentrationClause = useQuantitativeDescriptionsProperty.value ?
                              StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
                                concentration: this.concentrationDescriber.getCurrentConcentrationClause()
                              } ) :
                              soluteChangedQualitativePatternString;
      }
      else {
        soluteChangedString = soluteChangedUnsaturatedAlertPatternString;
        concentrationClause = useQuantitativeDescriptionsProperty.value ?
                              StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
                                concentration: this.concentrationDescriber.getCurrentConcentrationClause()
                              } ) :
                              this.concentrationDescriber.getCurrentPassiveConcentrationClause();
      }

      return StringUtils.fillIn( soluteChangedString, {
        color: this.getCurrentColor( true ),
        solids: this.concentrationDescriber.getCurrentSolidsAmount( false ),
        concentrationClause: concentrationClause
      } );
    }
  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );