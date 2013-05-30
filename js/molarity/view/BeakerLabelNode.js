// Copyright 2002-2013, University of Colorado

/**
 * Label that appears on the beaker in a frosty, translucent frame.
 * Displays solute formula. Origin at top center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var Dimension2 = require( "DOT/Dimension2" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MSymbols = require( "molarity/MSymbols" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  // constants
  var LABEL_SIZE = new Dimension2( 180, 80 );
  var LABEL_FONT = new MFont( 28, "bold" );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function BeakerLabelNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    var formulaNode = new HTMLText( "?", { font: LABEL_FONT } );
    var backgroundNode = new Rectangle( -LABEL_SIZE.width / 2, 0, LABEL_SIZE.width, LABEL_SIZE.height, 10, 10,
                                        { fill: new Color( 255, 255, 255, 0.6 ), stroke: Color.LIGHT_GRAY } );

    thisNode.addChild( backgroundNode );
    thisNode.addChild( formulaNode );

    var updateFormula = function( solute ) {
      // use solute formula
      if ( solution.volume === 0 ) {
        formulaNode.text = "";
      }
      else if ( solution.concentration === 0 ) {
        formulaNode.text = MSymbols.WATER;
      }
      else {
        formulaNode.text = solution.solute.formula;
      }
      // center formula in background
      formulaNode.centerX = backgroundNode.centerX;
      formulaNode.centerY = backgroundNode.centerY;
    };
    solution.link( 'solute', updateFormula );
    solution.link( 'volume', updateFormula );
    solution.link( 'concentration', updateFormula );
  }

  inherit( BeakerLabelNode, Node );

  return BeakerLabelNode;
} );