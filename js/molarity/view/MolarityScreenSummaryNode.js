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
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {MolarityModel} model
     * @param {Property.<boolean>} valuesVisibleProperty - tracks whether the values are visible
     * @param {SolutionDescriber} solutionDescriber
     */
    constructor( model, valuesVisibleProperty, solutionDescriber ) {

      super();

      this.addChild( new Node( {
        tagName: 'p',
        innerContent: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, {
          numberOfSolutes: model.solutes.length
        } )
      } ) );

      const stateOfSimNode = new Node( {
        tagName: 'p'
      } );

      this.addChild( stateOfSimNode );

      Property.multilink( [ model.solution.soluteProperty, model.solution.volumeProperty,
        model.solution.soluteAmountProperty, model.solution.concentrationProperty, valuesVisibleProperty ], () => {
        stateOfSimNode.innerContent = solutionDescriber.getStateOfSimDescription();
      } );
    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
