// Copyright 2002-2013, University of Colorado

/**
 * Visual representation of a beaker.
 * 3D perspective is provided by an image (see BeakerImageNode).
 * Other elements (ticks, label, ...) are added programmatically.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var BeakerImageNode = require( "molarity/view/BeakerImageNode" );
  var BeakerLabelNode = require( "molarity/view/BeakerLabelNode" );
  var Circle = require( "SCENERY/nodes/Circle" );
  var Color = require( "SCENERY/util/Color" );
  var Image = require( "SCENERY/nodes/Image" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MImages = require( "molarity/MImages" );
  var MStrings = require( "molarity/MStrings" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var Util = require( "DOT/Util" );
  var Vector2 = require( "DOT/Vector2" );

  // constants
  var DEBUG_SHAPES = false;
  var TICK_COLOR = Color.GRAY;
  var MINOR_TICK_SPACING = 0.1; // L
  var MINOR_TICKS_PER_MAJOR_TICK = 5;
  var MAJOR_TICK_LABELS = [ "\u00bd", "1" ]; // 1/2L, 1L
  var TICK_LABEL_FONT = new MFont( 20 );
  var TICK_LABEL_COLOR = Color.DARK_GRAY;
  var TICK_LABEL_X_SPACING = 8;

  /**
   * @param {Solution} solution
   * @param {Number} maxVolume
   * @param {Property<Boolean>} valuesVisibleProperty
   * @constructor
   */
  function BeakerNode( solution, maxVolume, valuesVisibleProperty ) {

    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    // the glass beaker
    thisNode._beakerImageNode = new BeakerImageNode();
    thisNode._beakerImageNode.scale( 0.75, 0.75 );
    var cylinderSize = thisNode._beakerImageNode.getCylinderSize();
    var cylinderOffset = thisNode._beakerImageNode.getCylinderOffset();
    var cylinderEndHeight = thisNode._beakerImageNode.getCylinderEndHeight();
    thisNode._beakerImageNode.translation = new Vector2( -cylinderOffset.x, -cylinderOffset.y );

    // inside bottom line
    var bottomShape = new Shape().ellipticalArc( cylinderSize.width / 2, cylinderSize.height,
                                                 cylinderSize.width / 2, cylinderEndHeight / 2,
                                                 0, Util.toRadians( 0 ), Util.toRadians( 180 ), true );
    var bottomNode = new Path( { shape: bottomShape, stroke: new Color( 150, 150, 150, 100 ), lineWidth: 2 } );

    // label on the beaker
    var labelNode = new BeakerLabelNode( solution );
    labelNode.x = cylinderSize.width / 2;
    labelNode.y = 0.15 * cylinderSize.height;

    // parents for tick marks and labels
    var tickMarkNodes = new Node();
    var tickLabelNodes = new Node();

    // rendering order
    thisNode.addChild( bottomNode );
    thisNode.addChild( thisNode._beakerImageNode );
    thisNode.addChild( tickMarkNodes );
    thisNode.addChild( tickLabelNodes );
    thisNode.addChild( labelNode );

    // tick marks, arcs that wrap around the edge of the beaker's cylinder
    var numberOfTicks = Math.round( maxVolume / MINOR_TICK_SPACING );
    var bottomY = cylinderSize.height; // don't use bounds or position will be off because of stroke width
    var deltaY = cylinderSize.height / numberOfTicks;
    var y, tickMarkShape, tickMarkNode, tickLabelIndex, tickLabel, tickLabelNode; // vars used inside the for-loop
    for ( var i = 1; i <= numberOfTicks; i++ ) {
      y = bottomY - ( i * deltaY );
      if ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 ) {

        // major tick mark
        tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Util.toRadians( 165 ), Util.toRadians( 135 ), true );
        tickMarkNode = new Path( { shape: tickMarkShape, stroke: TICK_COLOR, lineWidth: 2 } );
        tickMarkNodes.addChild( tickMarkNode );

        // major tick label
        tickLabelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( tickLabelIndex < MAJOR_TICK_LABELS.length ) {
          tickLabel = StringUtils.format( MStrings.pattern_0value_1units, MAJOR_TICK_LABELS[tickLabelIndex], MStrings.units_liters );
          tickLabelNode = new Text( tickLabel, { font: TICK_LABEL_FONT, stroke: TICK_LABEL_COLOR } );
          tickLabelNodes.addChild( tickLabelNode );
          tickLabelNode.left = tickMarkNode.right + TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = tickMarkNode.bottom;
        }
      }
      else {
        // minor tick mark, no label
        tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Util.toRadians( 165 ), Util.toRadians( 150 ), true );
        tickMarkNode = new Path( { shape: tickMarkShape, stroke: TICK_COLOR, lineWidth: 2 } );
        tickMarkNodes.addChild( tickMarkNode );
      }
    }

    if ( DEBUG_SHAPES ) {
      // draw the cylinder that represents the beaker's interior
      thisNode.addChild( new Rectangle( 0, 0, cylinderSize.width, cylinderSize.height, { stroke: 'red' } ) );
      // draw a circle at the origin
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    valuesVisibleProperty.link( function( visible ) {
      tickLabelNodes.visible = visible;
    } );
  }

  inherit( Node, BeakerNode );

  BeakerNode.prototype.getCylinderSize = function() {
    return this._beakerImageNode.getCylinderSize();
  };

  BeakerNode.prototype.getCylinderEndHeight = function() {
    return this._beakerImageNode.getCylinderEndHeight();
  };

  return BeakerNode;
} );