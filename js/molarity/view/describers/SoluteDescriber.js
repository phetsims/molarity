// Copyright 2019, University of Colorado Boulder

/**
 * SoluteDescriber is responsible for generating descriptions about the Solution.soluteProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const MolaritySymbols = require( 'MOLARITY/molarity/MolaritySymbols' );
  const Water = require( 'MOLARITY/molarity/model/Water' );
  const StringCasingPair = require( 'SCENERY_PHET/accessibility/StringCasingPair' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const beakerChemicalFormulaPatternString = MolarityA11yStrings.beakerChemicalFormulaPattern.value;
  const noSoluteAlertQuantitativeString = MolarityA11yStrings.noSoluteAlertQuantitative.value;
  const noSoluteAlertQualitativeString = MolarityA11yStrings.noSoluteAlertQualitative.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const soluteChangedQuantitativeConcentrationPatternString = MolarityA11yStrings.soluteChangedQuantitativeConcentrationPattern.value;
  const soluteChangedSaturatedAlertPatternString = MolarityA11yStrings.soluteChangedSaturatedAlertPattern.value;
  const soluteChangedUnsaturatedAlertPatternString = MolarityA11yStrings.soluteChangedUnsaturatedAlertPattern.value;

  class SoluteDescriber {

    /**
     * @param {Solution} solution
     * @param {ConcentrationDescriber} concentrationDescriber
     */
    constructor( solution, concentrationDescriber ) {

      // @private
      this.solution = solution;
      this.concentrationDescriber = concentrationDescriber;
    }

    /**
     * Gets the name of the current solute selected.
     * @public
     * @param [isCapitalized] {boolean}
     * @returns {string}
     */
    getCurrentSoluteName( isCapitalized = false ) {
      const currentSolute = this.solution.soluteProperty.value;
      return isCapitalized ? currentSolute.name : currentSolute.lowercaseName;
    }

    /**
     * Gets the chemical formula of the currently selected solute.
     * @public
     * @returns {string} - e.g. 'chemical formula of potassium permanganate is KMnO4.'
     */
    getBeakerChemicalFormulaString() {
      assert && assert( this.solution.soluteProperty.value.formula !== MolaritySymbols.DRINK_MIX,
        'attempted to generate chemical formula string for drink mix, which has no chemical formula' );
      return StringUtils.fillIn( beakerChemicalFormulaPatternString, {
        chemicalFormula: this.solution.soluteProperty.value.formula,
        solute: this.getCurrentSoluteName()
      } );
    }

    /**
     * Gets the color of the solution.
     * @param [isCapitalized] {boolean}
     * @public
     * @returns {string}
     */
    getCurrentColor( isCapitalized = false ) {
      let currentSoluteColorPair = this.solution.soluteProperty.value.colorStringPair;
      assert && assert( currentSoluteColorPair instanceof StringCasingPair );
      if ( !this.solution.hasSolute() ) {
        currentSoluteColorPair = Water.colorStringPair;
      }
      return isCapitalized ? currentSoluteColorPair.capitalized : currentSoluteColorPair.lowercase;
    }

    /**
     * Describes the new solute and any change in saturation when a user changes the solute in the combo box.
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @public
     * @returns {string}
     */
    getSoluteChangedAlertString( useQuantitativeDescriptionsProperty ) {

      if ( !this.solution.hasSolute() ) {
        return useQuantitativeDescriptionsProperty.value ? noSoluteAlertQuantitativeString : noSoluteAlertQualitativeString;
      }

      let concentrationClause;
      let soluteChangedString;
      if ( this.solution.isSaturated() ) {
        soluteChangedString = soluteChangedSaturatedAlertPatternString;
        concentrationClause = useQuantitativeDescriptionsProperty.value ?
                              StringUtils.fillIn( soluteChangedQuantitativeConcentrationPatternString, {
                                concentration: this.concentrationDescriber.getCurrentConcentrationClause()
                              } ) : '';
      }
      else {
        soluteChangedString = soluteChangedUnsaturatedAlertPatternString;
        concentrationClause = useQuantitativeDescriptionsProperty.value ?
                              StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
                                concentration: this.concentrationDescriber.getCurrentConcentrationClause()
                              } ) :
                              this.concentrationDescriber.getCurrentConcentrationClause( true );
      }

      // necessary to call this method to update concentrationDescriber.lastSaturationState, as the state may have
      // changed when the solute was changed.
      // TODO: is there a better way to do this?
      this.concentrationDescriber.saturationStateChanged();

      return StringUtils.fillIn( soluteChangedString, {
        color: this.getCurrentColor( true ),
        solids: this.concentrationDescriber.getCurrentSolidsAmount( false ),
        concentrationClause: concentrationClause
      } );
    }
  }

  return molarity.register( 'SoluteDescriber', SoluteDescriber );
} );