// Copyright 2019, University of Colorado Boulder

/**
 * MolarityAlertManager is responsible for generating strings about ConcentrationProperty. Also includes alert text
 * for alerts past saturation point, including descriptions about the amount of solids (precipitate) in the beaker.
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
  const qualitativeValueTextPatternString = MolarityA11yStrings.qualitativeValueTextPattern.value;
  const quantitativeInitialAlertPatternString = MolarityA11yStrings.quantitativeInitialAlertPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;
  const showValuesCheckedAlertString = MolarityA11yStrings.showValuesCheckedAlert.value;
  const showValuesUncheckedAlertString = MolarityA11yStrings.showValuesUncheckedAlert.value;

  class MolarityAlertManager {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - whether or not to use qualitative or
     *                                                                   quantitative descriptions.
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {SoluteAmountDescriber} soluteAmountDescriber
     * @param {VolumeDescriber} volumeDescriber
     * @param {SoluteDescriber} soluteDescriber
     * @param {Property.<boolean>} valuesVisibleProperty - toggles display for whether the "show values" checkbox is
     *                                                     checked.
     */
    constructor( solution, useQuantitativeDescriptionsProperty, concentrationDescriber, soluteAmountDescriber,
                 volumeDescriber, soluteDescriber, valuesVisibleProperty ) {

      // @private
      this.concentrationDescriber = concentrationDescriber;
      this.soluteDescriber = soluteDescriber;
      this.solution = solution;

      // @private - create utterances
      this.saturationUtterance = new Utterance();
      this.sliderUtterance = new ValueChangeUtterance();
      this.soluteUtterance = new ActivationUtterance();
      this.valuesVisibleUtterance = new ActivationUtterance();

      solution.soluteAmountProperty.link( () => {
        this.alertSaturation();
        if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative( soluteAmountDescriber.isInitialSoluteAmountAlert );
          if ( soluteAmountDescriber.isInitialSoluteAmountAlert ) {
            soluteAmountDescriber.isInitialSoluteAmountAlert = false;
          }
        }
        else {

          // a special alert is read out when there is no solute in the beaker
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
        this.alertSaturation();
        if ( useQuantitativeDescriptionsProperty.value ) {
          this.alertSliderQuantitative( volumeDescriber.isInitialVolumeAlert );
          if ( volumeDescriber.isInitialVolumeAlert ) {
            volumeDescriber.isInitialVolumeAlert = false;
          }
        }
        else {

          // a special alert is read out when there is no solute in the beaker
          if ( concentrationDescriber.isNoSolute() ) {
            this.alertNoSolute();
          }
          else {
            this.alertSliderQualitative( volumeDescriber.getVolumeChangeString(), volumeDescriber.volumeRegionChanged );
          }
        }
      } );

      solution.soluteProperty.lazyLink( () => this.alertSolute() );
      valuesVisibleProperty.lazyLink( newValue => this.alertValuesVisible( newValue ) );
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
      if ( this.concentrationDescriber.isNewSaturationState() ) {
        this.saturationUtterance.alert = this.concentrationDescriber.getSaturationChangedString();
        utteranceQueue.addToBack( this.saturationUtterance );
      }
    }

    /**
     * Responsible for adding the alert associated with a change in solute to the utteranceQueue.
     * @private
     */
    alertSolute() {
      this.soluteUtterance.alert = this.soluteDescriber.getSoluteChangedAlertString();
      utteranceQueue.addToBack( this.soluteUtterance );
    }

    /**
     * Responsible for adding the alert associated with a change in the "show values" checkbox.
     * @param {boolean} valuesVisible
     * @private
     */
    alertValuesVisible( valuesVisible ) {
      this.valuesVisibleUtterance.alert = valuesVisible ? showValuesCheckedAlertString : showValuesUncheckedAlertString;
      utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }

    /**
     * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {string} quantityChangeString - e.g. "More solution" or "Less solute."
     * @param {boolean} quantityChange - true if the quantity has increased, false if quantity has d
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
      if ( this.concentrationDescriber.concentrationIncreased !== null ||
           this.concentrationDescriber.solidsIncreased !== null ) {
        this.sliderUtterance.alert = alertText;
        utteranceQueue.addToBack( this.sliderUtterance );
      }
    }


    /**
     * When quantitative descriptions are used, and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {boolean} isInitialAlert
     * @private
     * @returns {string}
     */
    alertSliderQuantitative( isInitialAlert ) {
      const capitalizeConcentrationChange = true;
      let alertText = '';

      // A different pattern is used when it's the first alert read out after the slider has been focused.
      if ( isInitialAlert && !this.solution.isSaturated() ) {
        alertText = StringUtils.fillIn( quantitativeInitialAlertPatternString, {
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString( capitalizeConcentrationChange ),
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }
      else if ( this.solution.isSaturated() ) {
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
} )
;