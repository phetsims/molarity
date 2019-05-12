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
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const saturatedString = MolarityA11yStrings.saturated.value;
  const noSoluteAlertString = MolarityA11yStrings.noSoluteAlert.value;
  const notSaturatedString = MolarityA11yStrings.notSaturated.value;
  const qualitativeConcentrationPatternString = MolarityA11yStrings.qualitativeConcentrationPattern.value;
  const quantitativeConcentrationPatternString = MolarityA11yStrings.quantitativeConcentrationPattern.value;
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;
  const stateOfSimNoSolutePatternString = MolarityA11yStrings.stateOfSimNoSolutePattern.value;
  const stateOfSimPatternString = MolarityA11yStrings.stateOfSimPattern.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {Solution} solution -- from MolarityModel
     * @param {Array} solutes -- from MolarityModel
     * @param {Property.<boolean>} useQuantitativeDescriptions- tracks whether the values are visible
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {SoluteAmountDescriber} soluteAmountDescriber
     * @param {SoluteDescriber} soluteDescriber
     * @param {VolumeDescriber} volumeDescriber
     */
    constructor( solution, solutes, useQuantitativeDescriptions, concentrationDescriber, soluteAmountDescriber,
                 soluteDescriber, volumeDescriber ) {

      super();

      //@private
      this.solution = solution;
      this.useQuantitativeDescriptions = useQuantitativeDescriptions;
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

      const stateOfSimNode = new Node( {
        tagName: 'p'
      } );
      this.addChild( stateOfSimNode );

      // Third paragraph of the screen summary -- updated when model properties change.
      Property.multilink( [ solution.soluteProperty, solution.volumeProperty,
        solution.soluteAmountProperty, solution.concentrationProperty, useQuantitativeDescriptions ], () => {
        stateOfSimNode.innerContent = this.stateOfSimDescription();
      } );
    }

    stateOfSimDescription() {
      const concentrationString = this.useQuantitativeDescriptions.value ?
                                  quantitativeConcentrationPatternString :
                                  qualitativeConcentrationPatternString;
      const concentrationPattern = StringUtils.fillIn( concentrationString, {
        concentration: this.concentrationDescriber.getCurrentConcentration(),
        saturatedConcentration: this.solution.isSaturated() ? saturatedString : notSaturatedString
      } );

      // If there is no solute in the beaker, a special state description is returned and alert is read.
      if ( this.solution.soluteAmountProperty.value === 0 ) {

        // aria-live alert
        const simStateUtterance = new Utterance();
        simStateUtterance.alert = noSoluteAlertString;
        utteranceQueue.addToBack( simStateUtterance );

        // PDOM text
        return StringUtils.fillIn( stateOfSimNoSolutePatternString, {
          volume: this.volumeDescriber.getCurrentVolume(),
          solute: this.soluteDescriber.getCurrentSolute()
        } );
      }

      return StringUtils.fillIn( stateOfSimPatternString, {
        volume: this.volumeDescriber.getCurrentVolume(),
        solute: this.soluteDescriber.getCurrentSolute(),
        soluteAmount: this.soluteAmountDescriber.getCurrentSoluteAmount(),
        concentrationClause: concentrationPattern,
        saturatedConcentration: this.concentrationDescriber.isSaturated ? saturatedString : ''
      } );
    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
