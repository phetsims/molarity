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
        accessibleName: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, {
          numberOfSolutes: model.solutes.length
        } )
      } ) );

      const solutionDescriber = SolutionDescriber.getDescriber();

      const stateOfSim = new Node( {
        tagName: 'ul'
      } );

      const currentSoluteNode = new Node( {
        tagName: 'li'
      } );

      const soluteAmountNode = new Node( {
        tagName: 'li'
      } );

      const solutionVolumeNode = new Node( {
        tagName: 'li'
      } );

      const solutionConcentrationNode = new Node( {
        tagName: 'li'
      } );

      const stateOfSimNode = new Node( {
        tagName: 'p'
      } );

      stateOfSim.addChild( currentSoluteNode );
      stateOfSim.addChild( soluteAmountNode );
      stateOfSim.addChild( solutionVolumeNode );
      stateOfSim.addChild( solutionConcentrationNode );
      this.addChild( stateOfSim );
      this.addChild( stateOfSimNode );

      Property.multilink( [ model.solution.soluteProperty, model.solution.volumeProperty, model.solution.soluteAmountProperty, model.solution.concentrationProperty, valuesVisibleProperty ], () => {
        stateOfSimNode.accessibleName = solutionDescriber.getStateOfSimDescription();
      } );

      Property.multilink( [ model.solution.soluteProperty, model.solution.volumeProperty, valuesVisibleProperty ], () => {
        currentSoluteNode.accessibleName = solutionDescriber.getCurrentSoluteDescription();
      } );
      Property.multilink( [ model.solution.soluteAmountProperty, valuesVisibleProperty ], () => {
        soluteAmountNode.accessibleName = solutionDescriber.getSoluteAmountDescription();
      } );
      Property.multilink( [ model.solution.volumeProperty, valuesVisibleProperty ], () => {
        solutionVolumeNode.accessibleName = solutionDescriber.getSolutionVolumeDescription();
      } );
      Property.multilink( [ model.solution.concentrationProperty, valuesVisibleProperty ], () => {
        solutionConcentrationNode.accessibleName = solutionDescriber.getSolutionConcentrationDescription();
      } );

      // @private
      this.model = model;

    }
  }

  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
