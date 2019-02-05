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
  const currentSolutePatternString = MolarityA11yStrings.currentSolutePattern.value;
  const currentSoluteValuesVisiblePatternString = MolarityA11yStrings.currentSoluteValuesVisiblePattern.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {MolarityModel} model
     * @param {Property.<boolean>} valuesVisibleProperty - tracks whether the values are visible
     */
    constructor( model, valuesVisibleProperty ) {

      super();

      this.addChild( new Node( {
        tagName: 'p',
        accessibleName: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, { numberOfSolutes: model.solutes.length } )
      } ) );

      const stateOfSim = new Node( {
          tagName: 'ul'
      } );

      const currentSolute = new Node( {
          tagName: 'li'
      } );

      stateOfSim.addChild( currentSolute );
      this.addChild( stateOfSim );

      Property.multilink( [ model.solution.soluteProperty, valuesVisibleProperty ], ( currrentSolute, valuesVisible ) => {
        if ( valuesVisible ){
          currentSolute.accessibleName = StringUtils.fillIn( currentSoluteValuesVisiblePatternString, {
            solute: currrentSolute.name
          } );
        } else {
          currentSolute.accessibleName = StringUtils.fillIn( currentSolutePatternString, {
            solute: currrentSolute.name
          } );
        }
      } );

      // @private
      this.model = model;

    }
  }
  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
