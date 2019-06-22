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
  const saturatedString = MolarityA11yStrings.saturated.value;
  const notSaturatedString = MolarityA11yStrings.notSaturated.value;
  const qualitativeConcentrationPatternString = MolarityA11yStrings.qualitativeConcentrationPattern.value;
  const quantitativeConcentrationPatternString = MolarityA11yStrings.quantitativeConcentrationPattern.value;
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;
  const screenSummarySecondParagraphString = MolarityA11yStrings.screenSummarySecondParagraph.value;
  const stateOfSimNoSolutePatternString = MolarityA11yStrings.stateOfSimNoSolutePattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;
  const stateOfSimInteractionHintString = MolarityA11yStrings.stateOfSimInteractionHint.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {Solution} solution -- from MolarityModel
     * @param {Array} solutes -- from MolarityModel
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty- tracks whether the values are visible
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {SoluteAmountDescriber} soluteAmountDescriber
     * @param {SoluteDescriber} soluteDescriber
     * @param {VolumeDescriber} volumeDescriber
     */
    constructor( solution, solutes, useQuantitativeDescriptionsProperty, concentrationDescriber, soluteAmountDescriber,
                 soluteDescriber, volumeDescriber ) {

      super();

      //@private
      this.solution = solution;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.soluteAmountDescriber = soluteAmountDescriber;
      this.soluteDescriber = soluteDescriber;
      this.volumeDescriber = volumeDescriber;

      // First paragraph of the screen summary -- static regardless of state of sim.
      this.addChild( new Node( {
        tagName: 'p',
        innerContent: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, {
          numberOfSolutes: solutes.length
        } )
      } ) );

      this.addChild( new Node( {
        tagName: 'p',
        innerContent: screenSummarySecondParagraphString
      } ) );

      const stateOfSimNode = new Node( {
        tagName: 'p'
      } );
      const interactionHintNode = new Node({
        tagName: 'p',
        innerContent: stateOfSimInteractionHintString
      });

      this.addChild( stateOfSimNode );
      this.addChild( interactionHintNode );

      // Third paragraph of the screen summary -- updated when model properties change.
      Property.multilink( [ solution.soluteProperty, solution.volumeProperty,
        solution.soluteAmountProperty, solution.concentrationProperty, useQuantitativeDescriptionsProperty ], () => {
        stateOfSimNode.innerContent = this.stateOfSimDescription();
      } );
    }

    /**
     * @returns {string} - the screen summary paragraph, which differs based on whether quantitative or qualitative
     * descriptions are show, and whether or not there is some solute in the beaker.
     * @private
     */
    stateOfSimDescription() {
      let stateString = stateOfSimPatternString;

      // Creates the substring describing concentration -- differs based on use of quantitative descriptions and saturation state.
      const concentrationString = this.useQuantitativeDescriptionsProperty.value ?
                                  quantitativeConcentrationPatternString :
                                  qualitativeConcentrationPatternString;
      const concentrationPattern = StringUtils.fillIn( concentrationString, {
        concentration: this.concentrationDescriber.getCurrentConcentration(),
        saturatedConcentration: this.solution.isSaturated() ? saturatedString : notSaturatedString
      } );

      // If there is no solute in the beaker, the descriptive language changes in the PDOM
      if ( this.solution.soluteAmountProperty.value === 0 ) {
        stateString = stateOfSimNoSolutePatternString;
      }

      //TODO: add "has" back into
      return StringUtils.fillIn( stateString, {
        volume: this.volumeDescriber.getCurrentVolume(true),
        solute: this.soluteDescriber.getCurrentSolute(),
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount( true ),
        concentrationClause: concentrationPattern,
        saturatedConcentration: this.concentrationDescriber.isSaturated ? saturatedString : ''
      } );
    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
