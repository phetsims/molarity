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
  const qualitativeSaturatedValueTextPatternString = MolarityA11yStrings.qualitativeSaturatedValueTextPattern.value;
  const qualitativeValueTextPatternString = MolarityA11yStrings.qualitativeValueTextPattern.value;
  const quantitativeInitialAlertPatternString = MolarityA11yStrings.quantitativeInitialAlertPattern.value;
  const quantitativeValueTextPatternString = MolarityA11yStrings.quantitativeValueTextPattern.value;

  class MolarityAlertManager {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {ConcentrationDescriber} concentrationDescriber
     */
    constructor( solution, concentrationDescriber ) {
      this.concentrationDescriber = concentrationDescriber;
      this.solution = solution;

      // create utterances
      this.saturationUtterance = new Utterance();
      this.sliderUtterance = new ValueChangeUtterance();
      this.soluteUtterance = new ActivationUtterance();
      this.valuesVisibleUtterance = new ActivationUtterance();
    }

    /**
     * Responsible for adding the alerts associated with both sliders to the utteranceQueue. Includes alerts for
     * concentration increasing or decreasing, solute amount being zero, and saturation state changing.
     * @public
     */
    alertSlider( alertText ) {
      this.sliderUtterance.alert = alertText;
      utteranceQueue.addToBack( this.sliderUtterance );
    }

    /**
     * Responsible for adding the alerts associated saturation state changing.
     * @public
     */
    alertSaturation( alertText ) {
      this.saturationUtterance.alert = alertText;
      utteranceQueue.addToBack( this.saturationUtterance );
    }

    /**
     * Responsible for adding the alert associated with a change in solute to the utteranceQueue.
     * @public
     */
    alertSolute( alertText ) {
      this.soluteUtterance.alert = alertText;
      utteranceQueue.addToBack( this.soluteUtterance );
    }

    /**
     * Responsible for adding the alert associated with a change in the "show values" checkbox.
     * @public
     */
    alertValuesVisible( alertText ) {
      this.valuesVisibleUtterance.alert = alertText;
      utteranceQueue.addToBack( this.valuesVisibleUtterance );
    }

    /**
     * When qualitative descriptions are being used and SoluteAmountProperty or VolumeProperty changes, creates an alert.
     * @param {string} quantityChangeString - e.g. "More solution" or "Less solute."
     * @param {boolean} quantityChange - true if the quantity has increased, false if quantity has d
     * @public
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
      if ( this.concentrationDescriber.solution.isSaturated() ) {
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
        this.alertSlider( alertText );
      }
    }


    /**
     * When quantitative descriptions are use, creates and triggers the alerts when the sliders move.
     * @param {boolean} isInitialAlert
     * @public
     * @returns {string}
     */
    alertSliderQuantitative( isInitialAlert ) {
      const capitalizeConcentrationChange = true;
      let alertText = '';

      // A different pattern is used when it's the first alert read out after the volume slider has been focused.
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
      this.alertSlider( alertText );
    }
  }

  return molarity.register( 'MolarityAlertManager', MolarityAlertManager );
} );