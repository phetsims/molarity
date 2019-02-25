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
  const SolutionDescriber = require( 'MOLARITY/molarity/view/describers/SolutionDescriber' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {MolarityModel} model
     * @param {Property.<boolean>} valuesVisibleProperty - tracks whether the values are visible
     */
    constructor( model, valuesVisibleProperty ) {

      super();

      this.addChild( new Node( {
        tagName: 'p',
        innerContent: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, {
          numberOfSolutes: model.solutes.length
        } )
      } ) );

      const solutionDescriber = SolutionDescriber.getDescriber();

      const stateOfSimNode = new Node( {
        tagName: 'p'
      } );

      this.addChild( stateOfSimNode );

      Property.multilink( [ model.solution.soluteProperty, model.solution.volumeProperty, model.solution.soluteAmountProperty, model.solution.concentrationProperty, valuesVisibleProperty ], () => {
        stateOfSimNode.innerContent = solutionDescriber.getStateOfSimDescription();
      } );

      Property.multilink( [ model.solution.soluteProperty, valuesVisibleProperty ], () => {
        var utterance = solutionDescriber.getSoluteDescription();
        utteranceQueue.addToBack( new Utterance( { alert: utterance, uniqueGroupId: 'stateOfSim' } ) );
      } );


      // @private
      this.model = model;

    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
