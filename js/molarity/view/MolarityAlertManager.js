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
  const ActivationUtterance = require( 'SCENERY_PHET/accessibility/ActivationUtterance' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const ValueChangeUtterance = require( 'SCENERY_PHET/accessibility/ValueChangeUtterance' );

  // a11y strings
  const noSoluteAlertString = MolarityA11yStrings.noSoluteAlert.value;
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;

  // REVIEW: this is used as an alert, rename from "value text"
  const qualitativeValueTextPatternString = MolarityA11yStrings.qualitativeValueTextPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
  const solutionValuesCheckedAlertString = MolarityA11yStrings.solutionValuesCheckedAlert.value;
  const solutionValuesUncheckedAlertString = MolarityA11yStrings.solutionValuesUncheckedAlert.value;

  class MolarityAlertManager {

    /**
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
    constructor( solution, useQuantitativeDescriptionsProperty, concentrationDescriber, soluteAmountDescriber,
                 volumeDescriber, soluteDescriber, valuesVisibleProperty ) {

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

        // If the solution is newly saturated or newly unsaturated, an alert is read out
        this.alertSaturation();

        // Different alert text is read out depending on whether descriptions are qualitative or quantitative.
        if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative();
        }
        else {

          // A special alert is read out when there is no solute in the beaker
          if ( concentrationDescriber.isNoSolute() ) {
            this.alertNoSolute();
          }
          else {
            this.alertSliderQualitative( soluteAmountDescriber.getSoluteAmountChangeString(),
              soluteAmountDescriber.soluteAmountRegionChanged );
          }
        }
      } );

      solution.volumeProperty.link( () => {

        // If the solution is newly saturated or newly unsaturated, an alert is read out
        this.alertSaturation();

        // Different alert text is read out depending on whether descriptions are qualitative or quantitative.
        if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative();
        }
        else {

          // A special alert is read out when there is no solute in the beaker
          if ( concentrationDescriber.isNoSolute() ) {
            this.alertNoSolute();
          }
          else {
            this.alertSliderQualitative( volumeDescriber.getVolumeChangeString(), volumeDescriber.volumeRegionChanged );
          }
        }
      } );

      // An alert is read out when the solute is changed
      solution.soluteProperty.lazyLink( () => this.alertSolute() );

      // An alert is read out when the valuesVisibleProperty changes.
      valuesVisibleProperty.lazyLink(
        newValue => this.alertValuesVisible( newValue )
      );
    }

    /**
     * Alerts when there is no solute in the beaker.
     * @private
     */
    alertNoSolute() {
      this.sliderUtterance.alert = noSoluteAlertString;
      utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Alert only when the solution is either newly saturated or newly unsaturated.
     * @private
     */
    alertSaturation() {

      // REVIEW: The name of this function suggests that it would always alert, but this is hidden behind this conditional
      if ( this.concentrationDescriber.isNewSaturationState() ) {
        this.saturationUtterance.alert = this.concentrationDescriber.getSaturationChangedString();
        utteranceQueue.addToBack( this.saturationUtterance );
      }
    }

    /**
     * Alerts when there is a change in solute.
     * @private
     */
    alertSolute() {
      this.soluteUtterance.alert = this.soluteDescriber.getSoluteChangedAlertString( this.useQuantitativeDescriptionsProperty );
      utteranceQueue.addToBack( this.soluteUtterance );
    }

    /**
     * Alerts when there is a change in the valuesVisibleProperty
     * @param {Property.<boolean>} valuesVisibleProperty
     * @private
     */
    alertValuesVisible( valuesVisibleProperty ) {
      this.valuesVisibleUtterance.alert = valuesVisibleProperty ?
                                          solutionValuesCheckedAlertString :
                                          solutionValuesUncheckedAlertString;
      utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }

    /**
     * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {string} quantityChangeString - e.g. "More solution" or "Less solute."
     * @param {boolean} quantityChange - true if the quantity has increased, false if quantity has decreased
     * @private
     */
    alertSliderQualitative( quantityChangeString, quantityChange ) {
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
          propertyAmountChange: quantityChangeString,
          solidsChange: this.concentrationDescriber.getSolidsChangeString(),
          stillSaturatedClause: this.concentrationDescriber.getStillSaturatedClause()
        } );
      }
      else {
        alertText = StringUtils.fillIn( qualitativeValueTextPatternString, {
          quantityChange: quantityChangeString,
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString(),
          stateInfo: stateInfo
        } );
      }

      // alert is read out except if sim has just been loaded or reset
      // REVIEW: The name of this function suggests that it would always alert, but this is hidden behind this conditional
      if ( this.concentrationDescriber.concentrationIncreased !== null ||
           this.concentrationDescriber.solidsIncreased !== null ) {
        this.sliderUtterance.alert = alertText;
        utteranceQueue.addToBack( this.sliderUtterance );
      }
    }


    /**
     * When quantitative descriptions are used, and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {boolean}
     * @private
     * @returns {string}
     */
    alertSliderQuantitative() {

      // REVIEW: this doesn't change, perhaps a constant or just pass true to getConcentrationChangeString
      const capitalizeConcentrationChange = true;
      let alertText = '';

      if ( this.solution.isSaturated() ) {
        alertText = this.concentrationDescriber.getStillSaturatedClause();
      }
      else {
        alertText = StringUtils.fillIn( quantitativeValueTextPatternString, {
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString( capitalizeConcentrationChange ),
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      this.sliderUtterance.alert = alertText;
      utteranceQueue.addToBack( this.sliderUtterance );
    }
  }

  return molarity.register( 'MolarityAlertManager', MolarityAlertManager );
} );