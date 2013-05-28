// Copyright 2002-2013, University of Colorado

/**
 * A label that is switchable between 2 representations: qualitative and quantitative.
 * When property valueVisible is true, the quantitative label is displayed; otherwise the qualitative label is displayed.
 * X-coordinate of the origin is adjusted to be in the center, to simplify layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {

  // imports
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Text = require( "SCENERY/nodes/Text" );

  /**
   * @param {String} quantitativeValue
   * @param {String} qualitativeValue
   * @param {Property<Boolean>} isQuantitative
   * @param {Font} font
   * @constructor
   */
  function DualLabelNode( quantitativeValue, qualitativeValue, isQuantitative, font ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var quantitativeNode = new Text( quantitativeValue, { font: font } );
    thisNode.addChild( quantitativeNode );

    var qualitativeNode = new Text( qualitativeValue, { font: font } );
    thisNode.addChild( qualitativeNode );
    qualitativeNode.centerX = quantitativeNode.centerX;
    qualitativeNode.centerY = quantitativeNode.centerY;

    // add an invisible rectangle so that bounds don't change
    thisNode.addChild( new Rectangle( thisNode.left, thisNode.top, thisNode.width, thisNode.height ) );

    // switch between qualitative and quantitative
    isQuantitative.addObserver( function( isQuantitative ) {
      quantitativeNode.setVisible( isQuantitative );
      qualitativeNode.setVisible( !isQuantitative );
    } );
  }

  inherit( DualLabelNode, Node );

  return DualLabelNode;
} );