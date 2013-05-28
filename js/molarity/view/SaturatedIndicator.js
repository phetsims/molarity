// Copyright 2002-2013, University of Colorado

/**
 * Indicator that the solution is saturated.
 * This consists of "Saturated!" on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var MFont = require( "molarity/MFont" );
  var MStrings = require( "molarity/MStrings" );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function SaturatedIndicator( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    var label = new Text( MStrings.saturated, { font: new MFont( 22 ) } );

    // translucent light-gray background, so this shows up on all solution colors
    var background = new Rectangle( 0, 0, 1.2 * label.width, 1.2 * label.height, 8, 8,
                                    { fill: "rgba( 240, 240, 240, 0.6 )" } );

    // rendering order
    thisNode.addChild( background );
    thisNode.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution is saturated
    solution.precipitateAmount.addObserver( function() {
      thisNode.visible = solution.isSaturated();
    } );
  }

  inherit( SaturatedIndicator, Node );

  return SaturatedIndicator;
} );