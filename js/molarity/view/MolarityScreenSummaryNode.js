// Copyright 2019-2022, University of Colorado Boulder

/**
 * Node that holds the PDOM content for the screen summary in Molarity.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import molarity from '../../molarity.js';
import MolarityStrings from '../../MolarityStrings.js';

const ofString = MolarityStrings.a11y.of;
const notSaturatedString = MolarityStrings.a11y.notSaturated;
const screenSummaryQualitativeConcentrationPatternString = MolarityStrings.a11y.screenSummary.qualitativeConcentrationPattern;
const screenSummaryQuantitativeConcentrationPatternString = MolarityStrings.a11y.screenSummary.quantitativeConcentrationPattern;
const saturatedString = MolarityStrings.a11y.saturated;
const screenSummaryPlayAreaPatternString = MolarityStrings.a11y.screenSummary.playAreaPattern;
const screenSummaryControlAreaPatternString = MolarityStrings.a11y.screenSummary.controlAreaPattern;
const screenSummarySimInteractionHintString = MolarityStrings.a11y.screenSummary.simInteractionHint;
const screenSummaryCurrentStateOfSimNoSolutePatternString = MolarityStrings.a11y.screenSummary.currentStateOfSimNoSolutePattern;
const screenSummaryCurrentStateOfSimPatternString = MolarityStrings.a11y.screenSummary.currentStateOfSimPattern;

class MolarityScreenSummaryNode extends Node {

  /**
   * @param {MolarityModel} model
   * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - tracks whether the values are visible
   * @param {ConcentrationDescriber} concentrationDescriber
   * @param {SoluteAmountDescriber} soluteAmountDescriber
   * @param {SoluteDescriber} soluteDescriber
   * @param {VolumeDescriber} volumeDescriber
   */
  constructor( model, useQuantitativeDescriptionsProperty, concentrationDescriber, soluteAmountDescriber,
               soluteDescriber, volumeDescriber ) {

    super();

    // @private
    this.solution = model.solution;
    this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;
    this.concentrationDescriber = concentrationDescriber;
    this.soluteAmountDescriber = soluteAmountDescriber;
    this.soluteDescriber = soluteDescriber;
    this.volumeDescriber = volumeDescriber;

    // First paragraph of the screen summary -- static regardless of state of sim, describes the play area
    this.addChild( new Node( {
      tagName: 'p',
      innerContent: StringUtils.fillIn( screenSummaryPlayAreaPatternString, {
        numberOfSolutes: model.solutes.length
      } )
    } ) );

    // Second paragraph of the screen summary -- static regardless of state of sim, describes the control area
    this.addChild( new Node( {
      tagName: 'p',
      innerContent: screenSummaryControlAreaPatternString
    } ) );

    // Third paragraph of the screen summary -- dynamic depending on the state of the sim so keep a reference to it.
    const stateOfSimNode = new Node( {
      tagName: 'p'
    } );
    this.addChild( stateOfSimNode );

    // Fourth paragraph of the screen summary -- static regardless of state of sim, gives the interaction hint
    this.addChild( new Node( {
      tagName: 'p',
      innerContent: screenSummarySimInteractionHintString
    } ) );

    // Updates the third paragraph of the screen summary when sim Properties change.
    Multilink.multilink( [
      this.solution.soluteProperty,
      this.solution.volumeProperty,
      this.solution.soluteAmountProperty,
      this.solution.concentrationProperty,
      useQuantitativeDescriptionsProperty
    ], () => {
      stateOfSimNode.innerContent = this.getStateOfSimDescription();
    } );
  }

  /**
   * @private
   * @returns {string} - the screen summary paragraph, which differs based on whether quantitative or qualitative
   * descriptions are show, and whether or not there is some solute in the beaker.
   */
  getStateOfSimDescription() {
    let stateString = screenSummaryCurrentStateOfSimPatternString;

    // concentrationString will form the base of the concentrationPattern substring (filled in below)
    const concentrationString = this.useQuantitativeDescriptionsProperty.value ?
                                screenSummaryQuantitativeConcentrationPatternString :
                                screenSummaryQualitativeConcentrationPatternString;
    const concentrationPattern = StringUtils.fillIn( concentrationString, {
      concentration: this.concentrationDescriber.getCurrentConcentrationClause(),
      isSaturated: this.solution.isSaturated() ? saturatedString : notSaturatedString
    } );

    // If there is no solute in the beaker, the PDOM descriptions change.
    if ( !this.solution.hasSolute() ) {
      stateString = screenSummaryCurrentStateOfSimNoSolutePatternString;
    }

    return StringUtils.fillIn( stateString, {
      volume: this.volumeDescriber.getCurrentVolume( true ),
      color: this.soluteDescriber.getCurrentColor(),
      solute: this.soluteDescriber.getCurrentSoluteName(),
      soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount(),
      of: this.useQuantitativeDescriptionsProperty.value ? ofString : '',
      concentrationClause: concentrationPattern,
      saturatedConcentration: this.solution.isSaturated() ? saturatedString : ''
    } );
  }
}

molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
export default MolarityScreenSummaryNode;