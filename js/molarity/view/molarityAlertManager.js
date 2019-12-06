// Copyright 2019, University of Colorado Boulder

/**
 * MolarityAlertManager is responsible for generating and adding alerts to the utteranceQueue. This file is responsible
 * for all of the interfacing with utteranceQueue for the whole sim.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ActivationUtterance = require( 'UTTERANCE_QUEUE/ActivationUtterance' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utterance = require( 'UTTERANCE_QUEUE/Utterance' );
  const ValueChangeUtterance = require( 'UTTERANCE_QUEUE/ValueChangeUtterance' );

  // a11y strings
  const atMaxConcentrationAlertString = MolarityA11yStrings.atMaxConcentrationAlert.value;
  const noSoluteAlertString = MolarityA11yStrings.noSoluteAlert.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeSliderAlertPatternString = MolarityA11yStrings.qualitativeSliderAlertPattern.value;
  const quantitativeSaturatedValueTextPatternString = MolarityA11yStrings.quantitativeSaturatedValueTextPattern.value;
  const quantitativeSliderAlertPatternString = MolarityA11yStrings.quantitativeSliderAlertPattern.value;
  const solutionValuesCheckedAlertString = MolarityA11yStrings.solutionValuesCheckedAlert.value;
  const solutionValuesUncheckedAlertString = MolarityA11yStrings.solutionValuesUncheckedAlert.value;

  class MolarityAlertManager {

    constructor() {

      // @private
      this.initialized = false;
    }

    /**
     * Initialize the alert manager, linking to the needed model Properties.
     * @public
     * @param {Solution} solution - from MolarityModel.
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - whether or not to use qualitative or
     *                                                                   quantitative descriptions.
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {SoluteAmountDescriber} soluteAmountDescriber
     * @param {VolumeDescriber} volumeDescriber
     * @param {SoluteDescriber} soluteDescriber
     * @param {Property.<boolean>} valuesVisibleProperty - toggles display for whether the "solution values" checkbox is
     *                                                     checked.
     */
    initialize( solution, useQuantitativeDescriptionsProperty, concentrationDescriber, soluteAmountDescriber,
                volumeDescriber, soluteDescriber, valuesVisibleProperty ) {
      assert && assert( !this.initialized, 'molarityAlertManager has already been initialized' );
      this.initialized = true;

      // @private
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.solution = solution;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private - create utterances
      this.saturationUtterance = new Utterance();
      this.sliderUtterance = new ValueChangeUtterance();
      this.soluteUtterance = new ActivationUtterance();
      this.valuesVisibleUtterance = new ActivationUtterance();

      solution.soluteAmountProperty.lazyLink( () => this.alertValueChanged( soluteAmountDescriber ) );
      solution.volumeProperty.lazyLink( () => this.alertValueChanged( volumeDescriber ) );

      // An alert is read out when the solute is changed.
      solution.soluteProperty.lazyLink( () => this.alertSoluteChanged() );

      // An alert is read out when the valuesVisibleProperty changes.
      valuesVisibleProperty.lazyLink( newValue => this.alertValuesVisibleChanged( newValue ) );
    }

    /**
     * Alert when a user driven (likely from a slider) solution value was changed.
     * @param {{getChangeStrings:function():ChangeStrings, getRegionChanged:function():boolean}} describer
     * @private
     */
    alertValueChanged( describer ) {

      // A special alert is read out if the solution is saturated without any solids. If the solution is newly
      // saturated or newly unsaturated, an alert is read out. The text depends on whether descriptions are
      // qualitative or quantitative, and if there is any solute in the beaker.
      if ( this.concentrationDescriber.isExactlySaturated() ) {
        this.alertMaxConcentration();
      }
      else if ( this.concentrationDescriber.saturationStateChanged() ) {
        this.alertNewSaturation();
      }
      else if ( !this.solution.hasSolute() ) {
        this.alertNoSolute( this.useQuantitativeDescriptionsProperty );
      }
      else if ( this.useQuantitativeDescriptionsProperty.value ) {
        this.alertSliderQuantitative();
      }
      else {
        this.alertSliderQualitative( describer.getChangeStrings(), describer.getRegionChanged() );
      }
    }

    /**
     * Alert when the solution is exactly at the saturation point without any solids
     * @private
     */
    alertMaxConcentration() {
      this.sliderUtterance.alert = StringUtils.fillIn( atMaxConcentrationAlertString, {
        concentration: this.concentrationDescriber.getCurrentConcentrationClause( true )
      } );
      phet.joist.sim.utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Alert when the solution is either newly saturated or newly unsaturated.
     * @private
     */
    alertNewSaturation() {
      this.saturationUtterance.alert = this.concentrationDescriber.getSaturationChangedString();

      // clears the utteranceQueue to remove utterances from previous saturation region, then adds the saturation utterance.
      phet.joist.sim.utteranceQueue.clear();
      phet.joist.sim.utteranceQueue.addToFront( this.saturationUtterance );
    }

    /**
     * Alerts when there is no solute in the beaker.
     * @private
     */
    alertNoSolute() {
      assert && assert( !this.solution.hasSolute(), 'no solute alert triggered with solute in the beaker' );
      this.sliderUtterance.alert = noSoluteAlertString;
      phet.joist.sim.utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Alerts when there is a change in solute.
     * @private
     */
    alertSoluteChanged() {
      this.soluteUtterance.alert = this.soluteDescriber.getSoluteChangedAlertString( this.useQuantitativeDescriptionsProperty );
      phet.joist.sim.utteranceQueue.addToBack( this.soluteUtterance );
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
      phet.joist.sim.utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }

    /**
     * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {ChangeStrings} changeStrings - contains multiple strings.
     * @param {boolean} quantityChange - true if the quantity has increased, false if quantity has decreased
     * @private
     */
    alertSliderQualitative( changeStrings, quantityChange ) {
      assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'quantitative descriptions should be used.' );
      let alertText = '';

      // alert text is different based on whether or not the solution is saturated.
      if ( this.solution.isSaturated() ) {
        alertText = StringUtils.fillIn( qualitativeSaturatedValueTextPatternString, {
          propertyAmountChange: changeStrings.quantityChangeString,
          solidsChange: this.concentrationDescriber.getSolidsChangeString(),
          colorChange: changeStrings.colorChangeString,
          stillSaturatedClause: this.concentrationDescriber.getStillSaturatedClause()
        } );
      }
      else {

        // state info is appended to the alert if the descriptive region has changed for any relevant quantity.
        const includeStateInfo = quantityChange || this.concentrationDescriber.concentrationRegionChanged() ||
                                 this.concentrationDescriber.solidsRegionChanged;

        alertText = StringUtils.fillIn( qualitativeSliderAlertPatternString, {
          quantityChange: changeStrings.quantityChangeString,
          colorChange: changeStrings.colorChangeString,
          stateInfo: includeStateInfo ? this.concentrationDescriber.getQualitativeConcentrationState() : ''
        } );
      }

      this.sliderUtterance.alert = alertText;
      phet.joist.sim.utteranceQueue.addToBack( this.sliderUtterance );
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
          solidsChange: this.concentrationDescriber.getSolidsChangeString( true ),
          stillSaturatedClause: this.concentrationDescriber.getStillSaturatedClause()
        } );
      }
      else {
        alertText = StringUtils.fillIn( quantitativeSliderAlertPatternString, {
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString( true ),
          concentration: this.concentrationDescriber.getCurrentConcentrationClause(),
          colorChange: this.concentrationDescriber.getColorChangeString()
        } );
      }

      this.sliderUtterance.alert = alertText;
      phet.joist.sim.utteranceQueue.addToBack( this.sliderUtterance );
    }
  }

  return molarity.register( 'molarityAlertManager', new MolarityAlertManager() );
} );