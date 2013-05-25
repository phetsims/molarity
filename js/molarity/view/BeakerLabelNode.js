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
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var MSymbols = require( "molarity/MSymbols" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Solution} solution
   * @param {Dimension2} labelSize
   * @param {Font} font
   * @constructor
   */
  function BeakerLabelNode( solution, labelSize, font ) {

    var thisNode = this;
    Node.call( thisNode );

    var formulaNode = new HTMLText( "?", { font: font } );
    var backgroundNode = new Rectangle( -labelSize.width / 2, 0, labelSize.width, labelSize.height, 10, 10,
                                        { fill: new Color( 255, 255, 255, 150 ), stroke: Color.LIGHT_GRAY } );

    thisNode.addChild( backgroundNode );
    thisNode.addChild( formulaNode );

    var updateFormula = function( solute ) {
      // use solute formula
      if ( solution.volume.get() == 0 ) {
        formulaNode.text = "";
      }
      else if ( solution.concentration.get() == 0 ) {
        formulaNode.text = MSymbols.WATER;
      }
      else {
        formulaNode.text = solution.solute.get().formula;
      }
      // center formula in background
      formulaNode.centerX = backgroundNode.centerX;
      formulaNode.centerY = backgroundNode.centerY;
    };
    solution.solute.addObserver( updateFormula );
    solution.volume.addObserver( updateFormula );
    solution.concentration.addObserver( updateFormula );
  }

  inherit( BeakerLabelNode, Node );

  return BeakerLabelNode;
} );