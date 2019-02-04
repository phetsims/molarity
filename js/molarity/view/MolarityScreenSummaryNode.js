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

  // a11y strings
  const screenSummaryFirstParagraphString = MolarityA11yStrings.screenSummaryFirstParagraph.value;

  class MolarityScreenSummaryNode extends Node {
    /**
     *
     * @param {Object} [options]
     * @param {MolarityModel} model 
     * @constructor
     */
    constructor( model ) {

      super();

      this.addChild(new Node({
        tagName: 'p',
        accessibleName: screenSummaryFirstParagraphString
      }));

      // @private
      this.model = model;

    }
  }
  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
