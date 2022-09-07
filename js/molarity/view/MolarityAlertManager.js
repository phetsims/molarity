// Copyright 2019-2022, University of Colorado Boulder

/**
 * MolarityAlertManager is responsible for generating and adding alerts to the utteranceQueue. This file is responsible
 * for all of the interfacing with utteranceQueue for the whole sim.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import ActivationUtterance from '../../../../utterance-queue/js/ActivationUtterance.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import ValueChangeUtterance from '../../../../utterance-queue/js/ValueChangeUtterance.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';

const atMaxConcentrationAlertPatternString = MolarityStrings.a11y.atMaxConcentrationAlertPattern;
const noSoluteAlertString = MolarityStrings.a11y.noSoluteAlert;
const qualitativeSaturatedValueTextPatternString = MolarityStrings.a11y.qualitative.saturatedValueTextPattern;
const qualitativeSliderAlertPatternString = MolarityStrings.a11y.qualitative.sliderAlertPattern;
const quantitativeSaturatedValueTextPatternString = MolarityStrings.a11y.quantitative.saturatedValueTextPattern;
const quantitativeSliderAlertPatternString = MolarityStrings.a11y.quantitative.sliderAlertPattern;
const solutionValuesCheckedAlertString = MolarityStrings.a11y.solutionValuesCheckedAlert;
const solutionValuesUncheckedAlertString = MolarityStrings.a11y.solutionValuesUncheckedAlert;

class MolarityAlertManager extends Alerter {

  /**
   * Initialize the alert manager, linking to the needed model Properties.
   * @param {Node} node
   * @param {MacroSolution} solution - from MolarityModel.
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - whether or not to use qualitative or
   *                                                                   quantitative descriptions.
   * @param {ConcentrationDescriber} concentrationDescriber
   * @param {PrecipitateAmountDescriber} precipitateAmountDescriber
   * @param {SoluteAmountDescriber} soluteAmountDescriber
   * @param {VolumeDescriber} volumeDescriber
   * @param {SoluteDescriber} soluteDescriber
   * @param {Property.<boolean>} valuesVisibleProperty - toggles display for whether the "solution values" checkbox is
   *                                                     checked.
   * @public
   */
  constructor( node, solution, useQuantitativeDescriptionsProperty, concentrationDescriber, precipitateAmountDescriber,
               soluteAmountDescriber, volumeDescriber, soluteDescriber, valuesVisibleProperty ) {
    super( {
      descriptionAlertNode: node
    } );

    // @private - utterances with specific jobs so that duplicates are overwritten in the queue.
    this.saturationUtterance = new Utterance();
    this.sliderUtterance = new ValueChangeUtterance();
    this.soluteUtterance = new ActivationUtterance();
    this.valuesVisibleUtterance = new ActivationUtterance();

    // @private
    this.concentrationDescriber = concentrationDescriber;
    this.precipitateAmountDescriber = precipitateAmountDescriber;
    this.soluteDescriber = soluteDescriber;
    this.solution = solution;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

    // An alert is read out when the solute is changed.
    solution.soluteProperty.lazyLink( () => this.alertSoluteChanged() );

    // An alert is read out when the valuesVisibleProperty changes.
    valuesVisibleProperty.lazyLink( newValue => this.alertValuesVisibleChanged( newValue ) );
  }

  /**
   * Alert when a user driven (likely from a slider) solution value was changed.
   * @param {{getStringsFromSliderChange:function():StringsFromSliderChange, getRegionChanged:function():boolean}} describer
   * @private
   */
  alertSolutionQuantityChanged( describer ) {

    // A special alert is read out if the solution is at max concentration without any precipitate.
    if ( !this.solution.isSaturated() && this.solution.atMaxConcentration() ) {
      this.alertMaxConcentrationNotSaturated();
    }

    // alert when the solution has just become saturated, or has just become unsaturated.
    else if ( this.concentrationDescriber.saturationValueChanged ) {
      this.alertNewlySaturated();
    }

    // alert when there is no solute in the solution (so the solution is just water)
    else if ( !this.solution.hasSolute() ) {
      this.alertNoSolute( this.useQuantitativeDescriptionsProperty );
    }

    // quantitative alerts (when the 'solution values' checkbox is checked)
    else if ( this.useQuantitativeDescriptionsProperty.value ) {
      this.alertSliderQuantitative();
    }

    // qualitative alerts (when the 'solution values' checkbox is unchecked)
    else {
      this.alertSliderQualitative( describer.getStringsFromSliderChange(), describer.getRegionChanged() );
    }
  }

  /**
   * Alert when the solution is exactly at the max concentration point without any precipitate
   * @private
   */
  alertMaxConcentrationNotSaturated() {
    this.sliderUtterance.alert = StringUtils.fillIn( atMaxConcentrationAlertPatternString, {
      concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
    } );
    this.alertDescriptionUtterance( this.sliderUtterance );
  }

  /**
   * Alert when the solution is either newly saturated or newly unsaturated.
   * @private
   */
  alertNewlySaturated() {
    this.forEachUtteranceQueue( utteranceQueue => {

      // sliderUtterance must be removed from the queue because it is otherwise possible to get stale slider alerts that no
      // longer make sense with the current saturation state.
      if ( utteranceQueue.hasUtterance( this.sliderUtterance ) ) {
        utteranceQueue.removeUtterance( this.sliderUtterance );
      }
      this.saturationUtterance.alert = this.precipitateAmountDescriber.getSaturationChangedString();
      utteranceQueue.addToFront( this.saturationUtterance );
    } );
  }

  /**
   * Alerts when there is no solute in the beaker.
   * @private
   */
  alertNoSolute() {
    assert && assert( !this.solution.hasSolute(), 'no solute alert triggered with solute in the beaker' );
    this.sliderUtterance.alert = noSoluteAlertString;
    this.alertDescriptionUtterance( this.sliderUtterance );
  }

  /**
   * Alerts when there is a change in solute.
   * @private
   */
  alertSoluteChanged() {
    this.soluteUtterance.alert = this.soluteDescriber.getSoluteChangedAlertString( this.useQuantitativeDescriptionsProperty );
    this.alertDescriptionUtterance( this.soluteUtterance );
  }

  /**
   * Alerts when there is a change in the valuesVisibleProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @private
   */
  alertValuesVisibleChanged( valuesVisibleProperty ) {
    this.valuesVisibleUtterance.alert = valuesVisibleProperty ?
                                        solutionValuesCheckedAlertString :
                                        solutionValuesUncheckedAlertString;
    this.alertDescriptionUtterance( this.valuesVisibleUtterance );
  }

  /**
   * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
   * @param {StringsFromSliderChange} changeStrings - contains multiple strings.
   * @param {boolean} quantityRegionChanged - indicates whether the changed Property (SoluteAmount or Volume) has changed
   * description regions.
   * @private
   */
  alertSliderQualitative( changeStrings, quantityRegionChanged ) {
    assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'quantitative descriptions should be used.' );
    let alertText = '';

    // alert text is different based on whether or not the solution is saturated.
    if ( this.solution.isSaturated() ) {
      alertText = StringUtils.fillIn( qualitativeSaturatedValueTextPatternString, {
        propertyAmountChange: changeStrings.quantityChangeString,
        solidsChange: this.precipitateAmountDescriber.getPrecipitateAmountChangeString(),
        stillSaturatedClause: this.precipitateAmountDescriber.getStillSaturatedClause()
      } );
    }
    else {

      // information about the state of solution (particularly its concentration is appended to the alert if the descriptive
      // region has changed for any relevant quantity.
      const includeStateInfo = quantityRegionChanged || this.concentrationDescriber.concentrationRegionChanged;
      alertText = StringUtils.fillIn( qualitativeSliderAlertPatternString, {
        quantityChange: changeStrings.quantityChangeString,
        colorChange: changeStrings.colorChangeString,
        stateInfo: includeStateInfo ? this.concentrationDescriber.getQualitativeConcentrationDescription() : ''
      } );
    }

    this.sliderUtterance.alert = alertText;
    this.alertDescriptionUtterance( this.sliderUtterance );
  }

  /**
   * When quantitative descriptions are used, and SoluteAmountProperty or VolumeProperty changes, creates an alert.
   * @private
   */
  alertSliderQuantitative() {
    assert && assert( this.useQuantitativeDescriptionsProperty.value, 'qualitative descriptions should be used.' );
    let alertText = '';
    if ( this.solution.isSaturated() ) {
      alertText = StringUtils.fillIn( quantitativeSaturatedValueTextPatternString, {
        solidsChange: this.precipitateAmountDescriber.getPrecipitateAmountChangeString( true ),
        stillSaturatedClause: this.precipitateAmountDescriber.getStillSaturatedClause()
      } );
    }
    else {
      alertText = StringUtils.fillIn( quantitativeSliderAlertPatternString, {
        concentrationChange: this.concentrationDescriber.getConcentrationChangeString(),
        concentration: this.concentrationDescriber.getCurrentConcentrationClause(),
        colorChange: this.concentrationDescriber.getColorChangeString()
      } );
    }

    this.sliderUtterance.alert = alertText;
    this.alertDescriptionUtterance( this.sliderUtterance );
  }
}

/**
 * This contains two strings; these strings can be used as component pieces of longer alert strings.
 * @typedef StringsFromSliderChange
 * @type {Object}
 * @property {string} colorChangeString - describing the color change of the solute
 * @property {string} quantityChangeString - describing the slider quantity that changed
 */

molarity.register( 'MolarityAlertManager', MolarityAlertManager );
export default MolarityAlertManager;