// Copyright 2019, University of Colorado Boulder

/**
 * Node that holds the PDOM content for the screen summary in Molarity.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const ofString = MolarityA11yStrings.of.value;
  const notSaturatedString = MolarityA11yStrings.notSaturated.value;
  const screenSummaryQualitativeConcentrationPatternString = MolarityA11yStrings.screenSummaryQualitativeConcentrationPattern.value;
  const screenSummaryQuantitativeConcentrationPatternString = MolarityA11yStrings.screenSummaryQuantitativeConcentrationPattern.value;
  const saturatedString = MolarityA11yStrings.saturated.value;
  const screenSummaryPlayAreaPatternString = MolarityA11yStrings.screenSummaryPlayAreaPattern.value;
  const screenSummaryControlAreaPatternString = MolarityA11yStrings.screenSummaryControlAreaPattern.value;
  const simInteractionHintString = MolarityA11yStrings.simInteractionHint.value;
  const currentStateOfSimNoSolutePatternString = MolarityA11yStrings.currentStateOfSimNoSolutePattern.value;
  const currentStateOfSimPatternString = MolarityA11yStrings.currentStateOfSimPattern.value;

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
        innerContent: simInteractionHintString
      } ) );

      // Updates the third paragraph of the screen summary when sim Properties change.
      Property.multilink( [
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
      let stateString = currentStateOfSimPatternString;

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
        stateString = currentStateOfSimNoSolutePatternString;
      }

      return StringUtils.fillIn( stateString, {
        volume: this.volumeDescriber.getCurrentVolume( true ),
        color: this.soluteDescriber.getCurrentColor(),
        solute: this.soluteDescriber.getCurrentSoluteName(),
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount( false ),
        of: this.useQuantitativeDescriptionsProperty.value ? ofString : '',
        concentrationClause: concentrationPattern,
        saturatedConcentration: this.solution.isSaturated() ? saturatedString : ''
      } );
    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
