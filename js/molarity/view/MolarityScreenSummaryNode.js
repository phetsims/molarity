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
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const screenSummaryFirstParagraphPatternString = MolarityA11yStrings.screenSummaryFirstParagraphPattern.value;

  class MolarityScreenSummaryNode extends Node {

    /**
     * @param {MolarityModel} model
     */
    constructor( model ) {

      super();

      this.addChild(new Node({
        tagName: 'p',
        accessibleName: StringUtils.fillIn( screenSummaryFirstParagraphPatternString, { numberOfSolutes: model.solutes.length } )
      }));

      // @private
      this.model = model;

    }
  }
  return molarity.register( 'MolarityScreenSummaryNode', MolarityScreenSummaryNode );
} );
