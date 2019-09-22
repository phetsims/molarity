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
          if ( this.concentrationDescriber.concentrationIncreased !== null ||
               this.concentrationDescriber.solidsIncreased !== null ) {
            this.alertSliderQualitative( soluteAmountDescriber.getSoluteAmountChangeString(),
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
          if ( this.concentrationDescriber.concentrationIncreased !== null ||
               this.concentrationDescriber.solidsIncreased !== null ) {
            this.alertSliderQualitative( volumeDescriber.getVolumeChangeString(), volumeDescriber.volumeRegionChanged );
          }
        }
      } );

      // An alert is read out when the solute is changed.
      solution.soluteProperty.lazyLink( () => this.alertSolute() );

      // An alert is read out when the valuesVisibleProperty changes.
      valuesVisibleProperty.lazyLink( newValue => this.alertValuesVisible( newValue ) );
    }

    /**
     * Alert only when the solution is either newly saturated or newly unsaturated.
     * @private
     */
    alertNewSaturation() {
      this.saturationUtterance.alert = this.concentrationDescriber.getSaturationChangedString(
        this.useQuantitativeDescriptionsProperty );

      // clears the utteranceQueue to remove utterances from previous saturation region, then adds the saturation utterance.
      utteranceQueue.clear();
      utteranceQueue.addToFront( this.saturationUtterance );
    }

    /**
     * Alerts when there is no solute in the beaker.
     * @private
     */
    alertNoSolute( useQuantitativeDescriptionsProperty ) {
      this.sliderUtterance.alert = useQuantitativeDescriptionsProperty.value ?
                                   noSoluteQuantitativeAlertString :
                                   noSoluteQualitativeAlertString;
      utteranceQueue.addToBack( this.sliderUtterance );
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
     * @returns {string} - text of alert to add to back
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
        alertText = StringUtils.fillIn( qualitativeSliderAlertPatternString, {
          quantityChange: quantityChangeString,
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString(),
          stateInfo: stateInfo
        } );
      }

      this.sliderUtterance.alert = alertText;
      utteranceQueue.addToBack( this.sliderUtterance );
    }


    /**
     * When quantitative descriptions are used, and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @private
     * @returns {string}
     */
    alertSliderQuantitative() {
      let alertText = '';

      if ( this.solution.isSaturated() ) {
        alertText = this.concentrationDescriber.getStillSaturatedClause();
      }
      else {
        alertText = StringUtils.fillIn( quantitativeSliderAlertPatternString, {
          concentrationChange: this.concentrationDescriber.getConcentrationChangeString( true ),
          concentration: this.concentrationDescriber.getCurrentConcentration()
        } );
      }

      this.sliderUtterance.alert = alertText;
      utteranceQueue.addToBack( this.sliderUtterance );
    }
  }

  return molarity.register( 'molarityAlertManager', new MolarityAlertManager() );
} );