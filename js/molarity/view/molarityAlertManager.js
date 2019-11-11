// Copyright 2019, University of Colorado Boulder

/**
 * MolarityAlertManager is responsible for generating and adding alerts to the utteranceQueue.
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
  const noSoluteQualitativeAlertString = MolarityA11yStrings.noSoluteQualitativeAlert.value;
  const noSoluteQuantitativeAlertString = MolarityA11yStrings.noSoluteQuantitativeAlert.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeSliderAlertPatternString = MolarityA11yStrings.qualitativeSliderAlertPattern.value;
  const quantitativeSliderAlertPatternString = MolarityA11yStrings.quantitativeSliderAlertPattern.value;
  const solutionValuesCheckedAlertString = MolarityA11yStrings.solutionValuesCheckedAlert.value;
  const solutionValuesUncheckedAlertString = MolarityA11yStrings.solutionValuesUncheckedAlert.value;

  class MolarityAlertManager {

    constructor() {
      this.initialized = false;
    }

    /**
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

      solution.soluteAmountProperty.link( () => {

        // If the solution is newly saturated or newly unsaturated, an alert is read out. The text depends on whether
        // descriptions are qualitative or quantitative, and if there is any solute in the beaker.
        if ( this.concentrationDescriber.saturationStateChanged ) {
          this.alertNewSaturation();
        }
        else if ( !concentrationDescriber.hasSolute() ) {
          this.alertNoSolute( useQuantitativeDescriptionsProperty );
        }
        else if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative();
        }
        else {

          // concentrationDescriber.concentrationIncreased and concentrationDescriber.solidsIncreased are both null on
          // initial load or reset of the sim. No alert is read out in this case.
          if ( this.concentrationDescriber.concentrationIncreased !== null ||
               this.concentrationDescriber.solidsIncreased !== null ) {
            this.alertSliderQualitative( soluteAmountDescriber.getSoluteAmountChangeStrings(),
              soluteAmountDescriber.soluteAmountRegionChanged );
          }
        }
      } );

      solution.volumeProperty.link( () => {

        // If the solution is newly saturated or newly unsaturated, an alert is read out. The text depends on whether
        // descriptions are qualitative or quantitative, and if there is any solute in the beaker.
        if ( this.concentrationDescriber.saturationStateChanged ) {
          this.alertNewSaturation();
        }
        else if ( !concentrationDescriber.hasSolute() ) {
          this.alertNoSolute( useQuantitativeDescriptionsProperty );
        }
        else if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative();
        }
        else {

          // concentrationDescriber.concentrationIncreased and concentrationDescriber.solidsIncreased are both null on
          // initial load or reset of the sim. No alert is read out in this case.
          if ( this.concentrationDescriber.concentrationIncreased !== null ||
               this.concentrationDescriber.solidsIncreased !== null ) {
            this.alertSliderQualitative( volumeDescriber.getVolumeChangeStrings(), volumeDescriber.volumeRegionChanged );
          }
        }
      } );

      // An alert is read out when the solute is changed.
      solution.soluteProperty.lazyLink( () => this.alertSoluteChanged() );

      // An alert is read out when the valuesVisibleProperty changes.
      valuesVisibleProperty.lazyLink( newValue => this.alertValuesVisibleChanged( newValue ) );
    }

    /**
     * Alert when the solution is either newly saturated or newly unsaturated.
     * @private
     */
    alertNewSaturation() {
      assert && assert( this.concentrationDescriber.saturationStateChanged, 'alert triggered when saturation state has not changed' );
      this.saturationUtterance.alert = this.concentrationDescriber.getSaturationChangedString(
        this.useQuantitativeDescriptionsProperty );

      // clears the utteranceQueue to remove utterances from previous saturation region, then adds the saturation utterance.
      phet.joist.sim.display.utteranceQueue.clear();
      phet.joist.sim.display.utteranceQueue.addToFront( this.saturationUtterance );
    }

    /**
     * Alerts when there is no solute in the beaker.
     * @private
     */
    alertNoSolute( useQuantitativeDescriptionsProperty ) {
      assert && assert( !this.concentrationDescriber.hasSolute(), 'no solute alert triggered with solute in the beaker' );
      this.sliderUtterance.alert = useQuantitativeDescriptionsProperty.value ?
                                   noSoluteQuantitativeAlertString :
                                   noSoluteQualitativeAlertString;
      phet.joist.sim.display.utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Alerts when there is a change in solute.
     * @private
     */
    alertSoluteChanged() {
      this.soluteUtterance.alert = this.soluteDescriber.getSoluteChangedAlertString( this.useQuantitativeDescriptionsProperty );
      phet.joist.sim.display.utteranceQueue.addToBack( this.soluteUtterance );
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
      phet.joist.sim.display.utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }

    /**
     * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {Object} changeStrings - contains multiple strings.
     * @param {boolean} quantityChange - true if the quantity has increased, false if quantity has decreased
     * @returns {string} - text of alert to add to back
     * @private
     */
    alertSliderQualitative( changeStrings, quantityChange ) {
      assert && assert( !this.useQuantitativeDescriptionsProperty.value, 'quantitative descriptions should be used.' );
      let alertText = '';
      let stateInfo = '';

      // state info is appended to the alert if the descriptive region has changed for any relevant quantity.
      if ( quantityChange || this.concentrationDescriber.concentrationRegionChanged ||
           this.concentrationDescriber.solidsRegionChanged ) {
        stateInfo = this.concentrationDescriber.getConcentrationState();
      }

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
        alertText = StringUtils.fillIn( qualitativeSliderAlertPatternString, {
          quantityChange: changeStrings.quantityChangeString,
          colorChange: changeStrings.colorChangeString,
          stateInfo: stateInfo
        } );
      }

      this.sliderUtterance.alert = alertText;
      phet.joist.sim.display.utteranceQueue.addToBack( this.sliderUtterance );
    }


    /**
     * When quantitative descriptions are used, and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @private
     * @returns {string}
     */
    alertSliderQuantitative() {
      assert && assert( this.useQuantitativeDescriptionsProperty.value, 'qualitative descriptions should be used.' );
      let alertText = '';
      if ( this.solution.isSaturated() ) {
        alertText = this.concentrationDescriber.getStillSaturatedClause();
      }
      else {
        alertText = StringUtils.fillIn( quantitativeSliderAlertPatternString, {
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString( true ),
          concentration: this.concentrationDescriber.getCurrentConcentrationClause(),
          colorChange: this.concentrationDescriber.getColorChangeString()
        } );
      }

      this.sliderUtterance.alert = alertText;
      phet.joist.sim.display.utteranceQueue.addToBack( this.sliderUtterance );
    }
  }

  return molarity.register( 'molarityAlertManager', new MolarityAlertManager() );
} );