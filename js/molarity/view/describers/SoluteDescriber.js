// Copyright 2019-2022, University of Colorado Boulder

/**
 * SoluteDescriber is responsible for generating descriptions about the Solution.soluteProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import StringCasingPair from '../../../../../scenery-phet/js/accessibility/StringCasingPair.js';
import molarity from '../../../molarity.js';
import MolarityStrings from '../../../MolarityStrings.js';
import Water from '../../model/Water.js';
import MolaritySymbols from '../../MolaritySymbols.js';

const beakerChemicalFormulaPatternString = MolarityStrings.a11y.beaker.chemicalFormulaPattern;
const noSoluteAlertQuantitativeString = MolarityStrings.a11y.noSoluteAlertQuantitative;
const noSoluteAlertQualitativeString = MolarityStrings.a11y.noSoluteAlertQualitative;
const quantitativeConcentrationStatePatternString = MolarityStrings.a11y.quantitative.concentrationStatePattern;
const soluteChangedQuantitativeConcentrationPatternString = MolarityStrings.a11y.soluteChangedQuantitativeConcentrationPattern;
const soluteChangedQualitativeConcentrationPatternString = MolarityStrings.a11y.soluteChangedQualitativeConcentrationPattern;
const soluteChangedSaturatedAlertPatternString = MolarityStrings.a11y.soluteChangedSaturatedAlertPattern;
const soluteChangedUnsaturatedAlertPatternString = MolarityStrings.a11y.soluteChangedUnsaturatedAlertPattern;

class SoluteDescriber {

  /**
   * @param {MacroSolution} solution
   * @param {ConcentrationDescriber} concentrationDescriber
   * @param {PrecipitateAmountDescriber} precipitateAmountDescriber
   */
  constructor( solution, concentrationDescriber, precipitateAmountDescriber ) {

    // @private
    this.solution = solution;
    this.concentrationDescriber = concentrationDescriber;
    this.precipitateAmountDescriber = precipitateAmountDescriber;
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

                              // this qualitative description is to support the no trailing/leading space assertion, but could be simplifilied if that ever changes
                            } ) : soluteChangedQualitativeConcentrationPatternString;
    }
    else {
      soluteChangedString = soluteChangedUnsaturatedAlertPatternString;
      concentrationClause = useQuantitativeDescriptionsProperty.value ?
                            StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
                              concentration: this.concentrationDescriber.getCurrentConcentrationClause()
                            } ) :
                            this.concentrationDescriber.getCurrentConcentrationClause( true );
    }

    return StringUtils.fillIn( soluteChangedString, {
      color: this.getCurrentColor( true ),
      solids: this.precipitateAmountDescriber.getCurrentPrecipitateAmountDescription(),
      concentrationClause: concentrationClause
    } );
  }
}

molarity.register( 'SoluteDescriber', SoluteDescriber );
export default SoluteDescriber;